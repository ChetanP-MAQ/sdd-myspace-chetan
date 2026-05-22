# Implementation Plan: Leave Balance + Apply Leave Widget

## Overview
This plan delivers a dashboard-first leave widget for MySpace portal using Next.js 14, Prisma, and Postgres. The widget will fetch the current employee’s leave balances and last 5 leave requests, and allow leave application through a compact three-field form. The design honors the constitution by using a centralized identity provider, UTC timestamps, PII-safe logging, environment-driven secrets, and structured write observability.

## Architecture
- **Frontend**: Next.js 14 App Router with a server component that renders the widget and a client component for the apply-leave form.
- **Backend**: Prisma ORM querying Postgres via `process.env.DATABASE_URL`.
- **Auth**: Centralized identity provider integration via NextAuth or equivalent provider adapter; no local user accounts.
- **Observability**: Write operations emit structured logs with `actor`, `action`, and `entity_id` through a centralized logging utility.
- **Persona focus**: The widget is designed so the P1 employee can manage leave from the dashboard without leaving their primary work view.

## Widget Data Flow
1. On dashboard render, a Next.js server component calls a service `getEmployeeLeaveDashboard(employeeId)`.
2. The service performs two optimized Prisma queries:
   - active leave balances for up to 10 leave types
   - latest 5 leave requests sorted by `createdAtUTC` descending
3. The widget renders balance rows and request status cards including each request's submitted date and status in a compact responsive layout.
4. If no recent leave requests exist, the widget renders a clear placeholder message stating that no recent leave requests are available.
5. The client-side apply form submits via a Next.js API route or server action to create a new leave request.

## Primary Read Design for NFRs
- **NFR-001 (p95 ≤ 500 ms)**
  - Use targeted indexed queries by `employeeId` and timestamp fields.
  - Query only the current employee’s balances and exactly 5 requests.
  - Avoid eager-loading unrelated relations; join only the leave type metadata required for display.
  - Keep request payload minimal: the dashboard backend returns only leave type label, available balance, request dates, and status.

- **NFR-002 (Responsive widget with up to 10 leave types)**
  - Render the dashboard widget with a flexible grid or stack layout.
  - Use CSS `minmax` and `overflow-wrap` to keep balance rows readable on narrow screens.
  - Keep the form compact by limiting it to three fields and avoiding optional extras.

- **NFR-003 (Clear visual distinction)**
  - Display each leave type, balance, and request status in visually distinct cards.
  - Use a legend or badge for statuses like `Pending`, `Approved`, and `Rejected`.
  - Include explicit zero-balance text and a no-requests placeholder when needed.

## Write Flow and Observability
- **Submission flow**:
  - User fills leave type, from-date, to-date.
  - Client validates required fields and date order.
  - Submit to a Next.js POST route or server action.
  - Server validates again, stores the leave request, and returns success or error.
- **Observability**:
  - On successful request creation, emit structured log:
    - `actor`: employee ID
    - `action`: `create_leave_request`
    - `entity_id`: new leave request ID
  - On validation failure, log a non-PII diagnostic event without employee-sensitive fields.

## Constitution Compliance
- **Identity & Auth**: The dashboard uses single-source identity from the central auth provider and never authenticates against a local user table.
- **Time**: All stored timestamps are UTC (`createdAtUTC`, `fromDateUTC`, `toDateUTC`) and all comparisons use UTC values.
- **PII**: Logs redact employee PII. Only IDs and high-level status are emitted in diagnostics.
- **Secrets**: `DATABASE_URL`, identity provider keys, and other secrets are loaded from environment variables only.
- **Observability**: Leave request creation is a write operation instrumented with structured logs that include `actor`, `action`, and `entity_id`.

## Failure Modes and Trade-offs
1. **Failure mode: slow dashboard query due to wide join or large result sets**
   - Trade-off: keep dashboard query narrow and two-part rather than a single heavy join.
   - Rationale: this trades slightly more code for more reliable p95 performance and easier indexing.

2. **Failure mode: stale or incorrect balances if caching is too aggressive**
   - Trade-off: avoid long-lived cache on the primary dashboard read and use short-lived in-memory or HTTP cache only for non-critical metadata.
   - Rationale: freshness of leave balance is more valuable than micro-optimizations in the dashboard path.

3. **Failure mode: form submission accepted with invalid dates**
   - Trade-off: enforce both client-side and server-side validation, even if it adds duplicate checks.
   - Rationale: this keeps behavior robust and prevents invalid write operations while preserving the simple widget UX.

## Minimum Data-Model Slice
### Entities
- **Employee**
  - `id`
  - `displayName`

- **LeaveTypeBalance**
  - `employeeId`
  - `leaveTypeId`
  - `leaveTypeName`
  - `availableDays`

- **LeaveRequest**
  - `id`
  - `employeeId`
  - `leaveTypeId`
  - `fromDateUTC`
  - `toDateUTC`
  - `status`
  - `createdAtUTC`

### Notes
- Only the P1 data needs are included: current balances and recent requests.
- The model avoids entitlement policy details and approval workflow data.

## API Surface
- `GET /dashboard/leave-summary` or server component service `getEmployeeLeaveDashboard(employeeId)`
  - returns leave balances and last 5 requests
- `POST /dashboard/apply-leave` or server action
  - accepts leave type, from-date, to-date
  - returns validation result or confirmation

## Validation and Error Handling
- Client validates required fields and date order before submission.
- Server enforces rules again and returns descriptive errors for:
  - missing fields
  - invalid date range
  - unknown leave type
- Error responses omit PII and use generic failure messages where needed.

## Deployment Considerations
- Use `DATABASE_URL` from environment variables.
- Ensure Postgres indexes on `employeeId` and `createdAtUTC` for `LeaveRequest`, and `employeeId` for `LeaveTypeBalance`.
- Store and compare all dates in UTC; no timezone conversions in the primary read path.

## Tuple-Fit Note
This design keeps the employee persona in focus by delivering a fast, dashboard-native leave summary and application flow, while the NFR emphasis on p95 performance and responsive rendering ensures the widget remains usable and reliable for self-service scenarios. 