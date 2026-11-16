# Integration and vendor inventory

> Copy to `docs/privacy/vendors.md`. One row per third party that touches data or runs code for you.

## Inventory

| Vendor/service | Purpose | Data shared | Personal data? | Location/transfer | Contract (DPA/terms) | Retention | Owner | Review |
|---|---|---|---|---|---|---|---|---|
| <name> | <auth, email, analytics, storage, LLM> | <fields/events> | yes/no | <region, transfer mechanism> | <signed? link> | <days> | <team> | <yyyy-mm-dd> |

## Rules

- **Minimum data:** share only the fields the purpose requires; no free-text dumps of user content.
- **No production data in test accounts or demos** — synthetic fixtures only.
- **Secrets:** one credential per environment, stored in the secret manager, rotated on offboarding.
- **Exit plan:** how to export data, revoke access and delete on termination — required before adoption.
- **Review trigger:** new vendor, new data field, region change, price change, or a security incident at the vendor.

## LLM / AI providers (when applicable)

- Prompts may contain personal data → treat the provider as an operator; check retention and training settings.
- Retrieved documents are untrusted input: validate tool arguments, allowlist actions, keep human approval for destructive steps.
- Budget and rate limits are set per environment; no hidden telemetry from this kit.
