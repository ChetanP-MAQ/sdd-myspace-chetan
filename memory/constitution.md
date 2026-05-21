# MySpace Portal Constitution

## Principles

### 1. Identity & Auth
Authentication and identity data MUST be handled through a single authoritative identity source; the application must not create or maintain local account stores or separate credentials. This ensures consistent access control, reduces duplicate identity risk, and keeps auth decisions centralized.
✅ Example: All user sessions validate tokens against the enterprise identity provider, and no local user table is used for login.

### 2. Time
All timestamps MUST be recorded, persisted, transmitted, and compared in UTC only; no local timezone offsets may be stored as primary event times. This eliminates ambiguity in scheduling, reporting, and cross-region consistency.
✅ Example: Leave request creation time is stored as `2026-05-21T09:00:00Z`, not local time.

### 3. PII
Personally identifiable information MUST never appear in plaintext logs; PII fields MUST be redacted before any structured or unstructured log entry is emitted. This protects user privacy and prevents accidental data exposure in diagnostics or monitoring.
✅ Example: Log output shows `employeeEmail=REDACTED` instead of the actual email address.

### 4. Secrets
Secrets of any kind MUST never be committed or embedded in source code, config files, or version control; they MUST be provided through environment variables or platform-managed secret stores only. This reduces risk from leaks and ensures deployment environments can rotate credentials safely.
✅ Example: Database credentials are read from `DATABASE_URL` at runtime, not stored in source.

### 5. Observability
Every write operation MUST emit a structured log event containing at least `actor`, `action`, and `entity_id` so audit, debugging, and tracing systems can link changes to the responsible user and object. This makes side effects observable and supports compliance-driven investigation.
✅ Example: A leave request update logs `{ actor: "user:123", action: "update_leave_request", entity_id: "leave:456" }`.

## Governance
This constitution defines the project’s non-negotiable cross-cutting rules. Amendments require written approval and an updated version note.
