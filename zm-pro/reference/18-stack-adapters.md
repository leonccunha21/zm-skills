# Stack adapters

> Optional, detection-first guidance per ecosystem. These are **procedures**, not preferences: always inspect the repository before naming a command, and never install or migrate without a stated need. Load only the ecosystem in use.

## Universal rule

1. Read the manifests and lockfiles: `package.json`, `pyproject.toml`/`requirements.txt`, `pom.xml`/`build.gradle`, `*.csproj`, `composer.json`, `go.mod`, `Cargo.toml`, `pubspec.yaml`.
2. Detect versions and the tool that owns them (`.nvmrc`, `.python-version`, `global.json`, `rust-toolchain.toml`, `mise.toml`, `asdf`).
3. Discover scripts/tasks from the project, not from this page: CI config is the best source of the real commands.
4. Run the discovered command; quote output. Do not add a tool the project does not use.
5. When the repo is a monorepo, scope to the affected package and respect workspace rules.

## JavaScript / TypeScript

| Need | Look for | Typical command (only if present) |
|---|---|---|
| Package manager | `packageManager`, lockfile | `npm ci` · `pnpm install --frozen-lockfile` · `yarn install --immutable` · `bun install` |
| Typecheck | `tsconfig.json`, script | `npm run typecheck` / `tsc --noEmit` |
| Lint/format | eslint/prettier/biome config | `npm run lint`, `npm run format:check` |
| Tests | vitest/jest/node:test | `npm test`, `npx vitest run <file>` |
| Build | script | `npm run build` |

- ESM vs CJS: check `"type"` in `package.json`; do not mix casually.
- Monorepos: `workspaces`, `pnpm-workspace.yaml`, `turbo.json`, `nx.json` — run the task scoped to the package.
- Never commit `node_modules`; keep the lockfile change in the same PR as the manifest change.

## Python

| Need | Look for | Typical command |
|---|---|---|
| Env/tool | `pyproject.toml`, `poetry.lock`, `uv.lock`, `Pipfile` | `uv sync` · `poetry install` · `pip install -r requirements.txt` |
| Lint/format | ruff/flake8/black config | `ruff check .`, `ruff format --check .` |
| Types | mypy/pyright config | `mypy .` / `pyright` |
| Tests | pytest config | `pytest -q`, `pytest tests/test_x.py` |

- Respect the configured virtualenv; never install into system Python.
- Pin Python version from `.python-version`/`requires-python`.

## Java / Kotlin (JVM)

- Build tool wins: Maven (`mvn -q verify`) or Gradle (`./gradlew check`); use the wrapper, never a global install.
- Java version from `maven.compiler.release`, toolchains or `.java-version`.
- Frameworks (Spring/Quarkus/Micronaut): run the project's own test profile; configuration per environment, secrets external.
- Kotlin: `./gradlew ktlintCheck detekt` only if configured.

## .NET

- SDK version from `global.json`; commands via `dotnet`: `dotnet build`, `dotnet test`, `dotnet format --verify-no-changes`.
- Solution vs. project: scope `dotnet test <project>` when the repo is large.
- Central package management (`Directory.Packages.props`) is the source of versions.

## PHP

- Composer owns dependencies: `composer install --no-interaction`; check `composer.lock` is committed.
- Tests: `phpunit` / `pest`; static: `phpstan`/`psalm` if configured; style: `php-cs-fixer`/`pint`.
- Framework commands (artisan, bin/console) only when the framework is present.

## Go

- `go.mod` sets the module and version; `go work` for workspaces.
- Checks: `go build ./...`, `go test ./...`, `go vet ./...`; `golangci-lint` only if configured.
- No vendored edits unless `vendor/` is intentionally committed.

## Rust

- `cargo build`, `cargo test`, `cargo clippy -- -D warnings`, `cargo fmt --check`.
- Workspaces (`[workspace]`): scope with `-p <crate>`.
- Toolchain from `rust-toolchain.toml`.

## Mobile

- **iOS:** Xcode project/workspace; `xcodebuild test -scheme <scheme>`; Swift Package Manager or CocoaPods as configured; signing handled by the project — never improvise certificates.
- **Android:** Gradle wrapper: `./gradlew test`, `./gradlew lint`, `./gradlew assembleDebug`; SDK/version from `build.gradle(.kts)`.
- **Cross-platform (Flutter/React Native):** follow the project's scripts; emulator/simulator setup is environment-specific — state what was not tested.

## Data stores and cloud providers

- Read the existing integration (ORM, driver, SDK, IaC) before proposing anything; match the project's provider and region.
- Never introduce a vendor without an owner decision (cost, lock-in, data residency).
- Migrations and infrastructure changes follow `09` (delivery) and `10` (operations), with rollback.

## Keeping adapters honest

- Every command above is conditional on the project actually using that tool; the repo, not this page, is the source of truth.
- Examples that change behavior need a test or a reproducible check in the same PR.
- If a stack is not covered, use the universal rule — do not invent a convention.

## Checklist

- [ ] Installed toolchain and versions detected, not assumed
- [ ] Commands copied from the project (CI/scripts), not invented
- [ ] Monorepo scope respected
- [ ] No dependency installed or migrated without a stated need
- [ ] Unsupported or untested parts named explicitly
