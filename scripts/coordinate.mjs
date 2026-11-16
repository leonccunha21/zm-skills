#!/usr/bin/env node
// Zero-dependency cross-platform coordination CLI for AI agents (OpenCode,
// Antigravity, Claude Code, Cursor, Codex, Gemini CLI, etc.).
//
// Uses the repository filesystem as a universal asynchronous blackboard to:
//   - Announce active sessions and heartbeats
//   - Claim files and detect concurrent editing collisions
//   - Exchange structured messages and handoff records
//   - Track session state without external servers or network
//
// Usage:
//   node scripts/coordinate.mjs register --id <id> --platform <platform> --task <task> [--files <f1,f2>] [--role <role>]
//   node scripts/coordinate.mjs status [--json] [--stale-minutes <m>]
//   node scripts/coordinate.mjs check <path> [--id <my-id>]
//   node scripts/coordinate.mjs claim --id <id> --files <f1,f2>
//   node scripts/coordinate.mjs release --id <id> [--files <f1,f2>]
//   node scripts/coordinate.mjs post --from <id> [--to <target|all>] --msg "<text>" [--type <type>]
//   node scripts/coordinate.mjs read [--from <id>] [--to <id>] [--limit <n>] [--json]
//   node scripts/coordinate.mjs clean [--stale-minutes <m>]

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"

const args = process.argv.slice(2)
const command = args[0]

if (!command || args.includes("--help") || args.includes("-h")) {
  printUsage()
  process.exit(0)
}

function printUsage() {
  console.log(`Cross-agent coordination CLI

Commands:
  register   Announce session, update heartbeat and claim files
             --id <id> --platform <platform> --task <task> [--files <a,b>] [--role <role>]
  status     Show active sessions, claims, conflicts and warnings
             [--json] [--stale-minutes <m>]
  check      Verify if a file path is safe to edit (exit 0) or claimed (exit 1)
             <filepath> [--id <my-id>]
  claim      Claim additional files for an active session
             --id <id> --files <a,b>
  release    Release claimed files or finish session
             --id <id> [--files <a,b>]
  post       Send message to blackboard log
             --from <id> [--to <target|all>] --msg "<text>" [--type <type>]
  read       Read messages from blackboard log
             [--from <id>] [--to <id>] [--limit <n>] [--json]
  clean      Purge released or expired stale sessions
             [--stale-minutes <m>]
`)
}

// Helper to find repo root
function findRepoRoot(start = process.cwd()) {
  let curr = resolve(start)
  while (true) {
    if (existsSync(join(curr, ".git")) || existsSync(join(curr, "package.json")) || existsSync(join(curr, "AGENTS.md"))) {
      return curr
    }
    const parent = dirname(curr)
    if (parent === curr) break
    curr = parent
  }
  return resolve(start)
}

const root = findRepoRoot()
const coordDir = join(root, ".agents", "coordination")
const sessionsDir = join(coordDir, "sessions")
const messagesFile = join(coordDir, "messages.ndjson")

function ensureDirs() {
  if (!existsSync(sessionsDir)) mkdirSync(sessionsDir, { recursive: true })
}

function parseArg(flag, defaultValue = null) {
  const idx = args.indexOf(flag)
  if (idx !== -1 && idx + 1 < args.length) return args[idx + 1]
  const prefix = `${flag}=`
  const inline = args.find((a) => a.startsWith(prefix))
  if (inline) return inline.slice(prefix.length)
  return defaultValue
}

function hasFlag(flag) {
  return args.includes(flag)
}

function normalizePath(p) {
  return p.replace(/\\/g, "/").replace(/^\.\//, "")
}

function readAllSessions(staleMinutes = 15) {
  ensureDirs()
  const sessions = []
  const now = Date.now()
  const staleThresholdMs = staleMinutes * 60 * 1000

  for (const entry of readdirSync(sessionsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) continue
    try {
      const content = readFileSync(join(sessionsDir, entry.name), "utf8")
      const session = JSON.parse(content)
      const lastUpdate = Date.parse(session.updatedAt || session.startedAt || 0)
      const elapsedMs = now - lastUpdate
      session.isStale = session.status === "active" && elapsedMs > staleThresholdMs
      session.elapsedMinutes = Math.round(elapsedMs / 60000)
      sessions.push(session)
    } catch {
      // skip unparseable
    }
  }
  return sessions
}

function appendMessage(msg) {
  ensureDirs()
  const record = {
    timestamp: new Date().toISOString(),
    from: msg.from || "unknown",
    to: msg.to || "all",
    type: msg.type || "info",
    message: msg.message || "",
  }
  writeFileSync(messagesFile, `${JSON.stringify(record)}\n`, { flag: "a" })
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

switch (command) {
  case "register": {
    const id = parseArg("--id")
    const platform = parseArg("--platform") || "unknown"
    const task = parseArg("--task") || "unspecified task"
    const role = parseArg("--role") || "specialist"
    const filesArg = parseArg("--files") || ""

    if (!id) {
      console.error("coordinate error: --id is required for register")
      process.exit(1)
    }

    ensureDirs()
    const sessionFile = join(sessionsDir, `${id}.json`)
    let existing = null
    if (existsSync(sessionFile)) {
      try {
        existing = JSON.parse(readFileSync(sessionFile, "utf8"))
      } catch {}
    }

    const claimedFiles = new Set(existing?.claimedFiles || [])
    if (filesArg) {
      for (const f of filesArg.split(",").map((s) => s.trim()).filter(Boolean)) {
        claimedFiles.add(normalizePath(f))
      }
    }

    const now = new Date().toISOString()
    const sessionData = {
      id,
      platform,
      role,
      status: "active",
      currentTask: task,
      startedAt: existing?.startedAt || now,
      updatedAt: now,
      claimedFiles: [...claimedFiles],
    }

    writeFileSync(sessionFile, `${JSON.stringify(sessionData, null, 2)}\n`, "utf8")
    appendMessage({
      from: id,
      to: "all",
      type: existing ? "heartbeat" : "register",
      message: `${id} (${platform}) [${role}]: ${task}`,
    })

    console.log(`ok - session registered: ${id} (${platform}) · ${sessionData.claimedFiles.length} file(s) claimed`)
    break
  }

  case "status": {
    const json = hasFlag("--json")
    const staleMin = parseInt(parseArg("--stale-minutes", "15"), 10)
    const sessions = readAllSessions(staleMin)

    // Build claim map to detect conflicts
    const claimMap = new Map()
    for (const s of sessions) {
      if (s.status !== "active" || s.isStale) continue
      for (const f of s.claimedFiles || []) {
        if (!claimMap.has(f)) claimMap.set(f, [])
        claimMap.get(f).push(s.id)
      }
    }

    const conflicts = []
    for (const [file, claimants] of claimMap.entries()) {
      if (claimants.length > 1) {
        conflicts.push({ file, claimants })
      }
    }

    if (json) {
      console.log(JSON.stringify({ sessions, conflicts, totalSessions: sessions.length }, null, 2))
    } else {
      console.log(`=== Multi-Agent Coordination Status ===`)
      console.log(`Directory: ${coordDir}`)
      console.log(`Active sessions: ${sessions.filter((s) => s.status === "active" && !s.isStale).length}`)
      console.log(`Stale sessions:  ${sessions.filter((s) => s.isStale).length}`)
      console.log(`Released:        ${sessions.filter((s) => s.status === "released").length}\n`)

      if (sessions.length === 0) {
        console.log("No agent sessions registered. Run `node scripts/coordinate.mjs register` to begin.")
      } else {
        for (const s of sessions) {
          const badge = s.isStale ? "[STALE]" : s.status === "active" ? "[ACTIVE]" : "[RELEASED]"
          console.log(`${badge.padEnd(11)} ${s.id} (${s.platform}) [${s.role || "specialist"}]`)
          console.log(`            Task: ${s.currentTask}`)
          console.log(`            Updated: ${s.updatedAt} (${s.elapsedMinutes}m ago)`)
          if (s.claimedFiles?.length > 0) {
            console.log(`            Claimed: ${s.claimedFiles.join(", ")}`)
          }
          console.log("")
        }
      }

      if (conflicts.length > 0) {
        console.log("⚠️  CONFLICT DETECTED: multiple active sessions claimed the same files:")
        for (const c of conflicts) {
          console.log(`   - ${c.file} claimed by: ${c.claimants.join(", ")}`)
        }
        console.log("\nResolve file ownership before proceeding to avoid collisions.")
      }
    }
    break
  }

  case "check": {
    const fileArg = args.find((a) => a !== "check" && !a.startsWith("--"))
    const myId = parseArg("--id")
    const staleMin = parseInt(parseArg("--stale-minutes", "15"), 10)

    if (!fileArg) {
      console.error("coordinate error: file path required for check")
      process.exit(1)
    }

    const targetFile = normalizePath(fileArg)
    const sessions = readAllSessions(staleMin)
    const activeClaimants = sessions.filter(
      (s) => s.status === "active" && !s.isStale && s.id !== myId && (s.claimedFiles || []).includes(targetFile),
    )

    if (activeClaimants.length > 0) {
      const names = activeClaimants.map((s) => `${s.id} (${s.platform}, task: "${s.currentTask}")`).join(", ")
      console.error(`COLLISION PREVENTED: "${targetFile}" is claimed by active session(s): ${names}`)
      process.exit(1)
    }

    console.log(`ok - "${targetFile}" is clear to edit`)
    break
  }

  case "claim": {
    const id = parseArg("--id")
    const filesArg = parseArg("--files")
    if (!id || !filesArg) {
      console.error("coordinate error: --id and --files are required for claim")
      process.exit(1)
    }

    ensureDirs()
    const sessionFile = join(sessionsDir, `${id}.json`)
    if (!existsSync(sessionFile)) {
      console.error(`coordinate error: session ${id} not found. Register first.`)
      process.exit(1)
    }

    const session = JSON.parse(readFileSync(sessionFile, "utf8"))
    const claimed = new Set(session.claimedFiles || [])
    const toAdd = filesArg.split(",").map((s) => normalizePath(s.trim())).filter(Boolean)

    for (const f of toAdd) claimed.add(f)
    session.claimedFiles = [...claimed]
    session.updatedAt = new Date().toISOString()
    session.status = "active"

    writeFileSync(sessionFile, `${JSON.stringify(session, null, 2)}\n`, "utf8")
    appendMessage({
      from: id,
      to: "all",
      type: "claim",
      message: `Claimed files: ${toAdd.join(", ")}`,
    })

    console.log(`ok - claimed for ${id}: ${toAdd.join(", ")}`)
    break
  }

  case "release": {
    const id = parseArg("--id")
    const filesArg = parseArg("--files")
    if (!id) {
      console.error("coordinate error: --id is required for release")
      process.exit(1)
    }

    ensureDirs()
    const sessionFile = join(sessionsDir, `${id}.json`)
    if (!existsSync(sessionFile)) {
      console.error(`coordinate error: session ${id} not found`)
      process.exit(1)
    }

    const session = JSON.parse(readFileSync(sessionFile, "utf8"))
    if (filesArg) {
      const toRemove = new Set(filesArg.split(",").map((s) => normalizePath(s.trim())))
      session.claimedFiles = (session.claimedFiles || []).filter((f) => !toRemove.has(f))
      session.updatedAt = new Date().toISOString()
      console.log(`ok - released files for ${id}: ${[...toRemove].join(", ")}`)
    } else {
      session.claimedFiles = []
      session.status = "released"
      session.updatedAt = new Date().toISOString()
      console.log(`ok - session ${id} released and closed`)
    }

    writeFileSync(sessionFile, `${JSON.stringify(session, null, 2)}\n`, "utf8")
    appendMessage({
      from: id,
      to: "all",
      type: "release",
      message: filesArg ? `Released: ${filesArg}` : `Session closed`,
    })
    break
  }

  case "post": {
    const from = parseArg("--from")
    const to = parseArg("--to") || "all"
    const msg = parseArg("--msg")
    const type = parseArg("--type") || "info"

    if (!from || !msg) {
      console.error("coordinate error: --from and --msg are required for post")
      process.exit(1)
    }

    appendMessage({ from, to, type, message: msg })
    console.log(`ok - message posted to blackboard (${from} → ${to})`)
    break
  }

  case "read": {
    const fromFilter = parseArg("--from")
    const toFilter = parseArg("--to")
    const limit = parseInt(parseArg("--limit", "15"), 10)
    const json = hasFlag("--json")

    ensureDirs()
    if (!existsSync(messagesFile)) {
      if (json) console.log("[]")
      else console.log("No messages in blackboard log.")
      break
    }

    const raw = readFileSync(messagesFile, "utf8")
    const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0)
    let records = []
    for (const l of lines) {
      try {
        records.push(JSON.parse(l))
      } catch {}
    }

    if (fromFilter) records = records.filter((r) => r.from === fromFilter)
    if (toFilter) records = records.filter((r) => r.to === toFilter || r.to === "all")

    const slice = records.slice(-limit)

    if (json) {
      console.log(JSON.stringify(slice, null, 2))
    } else {
      console.log(`=== Blackboard Messages (last ${slice.length}) ===`)
      for (const m of slice) {
        console.log(`[${m.timestamp}] ${m.from} → ${m.to} (${m.type}): ${m.message}`)
      }
    }
    break
  }

  case "clean": {
    const staleMin = parseInt(parseArg("--stale-minutes", "60"), 10)
    ensureDirs()
    const now = Date.now()
    const thresholdMs = staleMin * 60 * 1000
    let removed = 0

    for (const entry of readdirSync(sessionsDir, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith(".json")) continue
      const p = join(sessionsDir, entry.name)
      try {
        const session = JSON.parse(readFileSync(p, "utf8"))
        const last = Date.parse(session.updatedAt || session.startedAt || 0)
        if (session.status === "released" || now - last > thresholdMs) {
          rmSync(p)
          removed++
        }
      } catch {
        rmSync(p)
        removed++
      }
    }
    console.log(`ok - cleaned ${removed} stale/released session file(s)`)
    break
  }

  default:
    console.error(`coordinate error: unknown command "${command}"`)
    printUsage()
    process.exit(1)
}
