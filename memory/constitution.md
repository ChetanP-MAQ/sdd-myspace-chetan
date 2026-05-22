# MySpace Portal Constitution

## Principles

### 1. Identity & Auth
All user identity and authentication decisions MUST rely on a single authoritative identity provider; the application MUST NOT maintain local account stores or separate credential systems.
✅ Example: Login validates every session token against the central identity provider instead of checking a local users table.

### 2. Time
All timestamps MUST be stored, transmitted, and compared in UTC only; local timezone offsets MUST never be used as the primary event time.
✅ Example: A leave request record stores `2026-05-21T09:00:00Z` and all scheduling logic compares UTC values.

### 3. PII
Personally identifiable information MUST never be logged in plain text; all PII fields MUST be redacted before any log entry is emitted.
✅ Example: Logs show `employeeEmail=REDACTED` instead of the actual email address.

### 4. Secrets
Secrets MUST never be committed to source code, configuration files, or version control; they MUST be supplied through environment variables or secure secret management.
✅ Example: Database credentials are loaded from `DATABASE_URL` at runtime, not stored in the repository.

### 5. Observability
Every write operation MUST emit a structured log event with `actor`, `action`, and `entity_id` so change events are traceable and auditable.
✅ Example: Updating a leave request logs `{ actor: "user:123", action: "update_leave_request", entity_id: "leave:456" }`.

## Governance
This constitution captures the project’s cross-cutting, non-negotiable rules. Amendments require documented approval and an explicit version update.
