# Tasks: Leave Balance + Apply Leave Widget

**Input**: specs/001-leave/spec.md, specs/001-leave/plan.md

## Phase 1: Setup (Shared Infrastructure)
**Entry**: None required
**Exit**: Next.js project structure, environment handling, and initial tooling are in place

- [x] T001 [P] Initialize Next.js 14 App Router project in `frontend/` or `src/`
- [x] T002 [P] Add Prisma and Postgres dependencies in `package.json`
- [x] T003 [P] Configure environment variables in `.env` and `.env.example` for `DATABASE_URL` and identity provider secrets
- [x] T004 [P] Create base Next.js dashboard page in `src/app/dashboard/page.tsx`
- [x] T005 [P] Add formatting and linting configuration in `.vscode/settings.json` and `package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)
**Entry**: Phase 1 completed
**Exit**: Authentication, persistence, logging, and schema foundations are ready for feature implementation

- [x] T006 [P] Create Prisma schema models for `Employee`, `LeaveTypeBalance`, and `LeaveRequest` in `prisma/schema.prisma`
- [x] T007 [P] Configure Prisma client initialization in `src/lib/prisma.ts`
- [x] T008 [P] Implement identity provider authentication stub in `src/lib/auth.ts` using centralized auth and no local accounts
- [x] T009 [P] Create structured logging utility in `src/lib/logging.ts` that emits `actor`, `action`, and `entity_id`
- [x] T010 [P] Add UTC timestamp handling helpers in `src/lib/time.ts` and enforce UTC storage semantics
- [x] T011 [P] Create environment configuration loader in `src/lib/config.ts` that reads `DATABASE_URL` and provider keys from env variables
- [x] T012 [P] Add a base API route or server action entrypoint in `src/app/api/leave/route.ts` or `src/actions/leave.ts`

---

## Phase 3: User Story 1 - Dashboard leave overview and apply flow (Priority: P1) 🎯 MVP
**Goal**: Render employee leave balances, recent requests, and a dashboard apply-leave form in a single widget
**Independent Test**: Verify dashboard widget shows leave balances, last 5 requests, and a three-field apply form without navigating away

### Test Tasks
- [x] T013 [T] [US1] Create a frontend integration test in `tests/integration/leave-dashboard.test.ts` for balance rendering and form submission
- [x] T014 [T] [US1] Create a performance test in `tests/performance/leave-dashboard-latency.test.ts` asserting p95 ≤ 500 ms for 10 leave types and 5 requests

### Implementation Tasks
- [x] T015 [P] [US1] Implement `src/services/leaveDashboardService.ts` to fetch employee leave balances and last 5 leave requests
- [x] T016 [US1] Implement `src/app/dashboard/LeaveWidget.tsx` to render balances, request dates, statuses, and the apply form
- [x] T017 [US1] Implement `src/app/dashboard/LeaveRequestList.tsx` to display up to 5 recent requests with status badges and request dates
- [x] T018 [US1] Implement `src/app/dashboard/LeaveBalanceRow.tsx` to display each leave type balance including zero balances clearly
- [x] T019 [US1] Implement `src/app/api/leave/route.ts` or `src/actions/leave.ts` POST handling for create leave request with server-side validation
- [x] T020 [US1] Add no-recent-requests placeholder text in `src/app/dashboard/LeaveWidget.tsx`
- [x] T021 [US1] Add client-side validation for required fields and `from-date`/`to-date` ordering in `src/app/dashboard/LeaveWidget.tsx`
- [x] T022 [US1] Add structured write logging for leave request creation in `src/app/api/leave/route.ts` or `src/actions/leave.ts`

**Checkpoint**: Employee dashboard can independently show balances, request history, and submit leave requests.

---

## Phase 4: User Story 2 - Compact leave application input (Priority: P2)
**Goal**: Ensure leave application is available via a compact, three-field form on the dashboard
**Independent Test**: Verify the dashboard widget form has leave type, from-date, and to-date fields only

### Test Tasks
- [x] T023 [T] [US2] Create a UI test in `tests/ui/leave-apply-form.test.ts` validating the form has exactly 3 fields

### Implementation Tasks
- [x] T024 [P] [US2] Implement `src/app/dashboard/LeaveApplyForm.tsx` with leave type, from-date, and to-date fields only
- [x] T025 [US2] Ensure `LeaveApplyForm.tsx` integrates directly into `src/app/dashboard/LeaveWidget.tsx`
- [x] T026 [US2] Add accessible labels and inline validation messaging in `src/app/dashboard/LeaveApplyForm.tsx`

**Checkpoint**: The dashboard widget supports a compact leave apply experience independently.

---

## Phase 5: User Story 3 - Recent request status visibility (Priority: P3)
**Goal**: Render the status of the last 5 leave requests in a readable way
**Independent Test**: Verify the widget lists up to 5 recent leave requests with readable statuses sorted by date

### Test Tasks
- [x] T027 [T] [US3] Create a list rendering test in `tests/unit/leave-request-list.test.ts` for status badges and request sorting

### Implementation Tasks
- [x] T028 [P] [US3] Implement `src/app/dashboard/LeaveRequestList.tsx` to render request status badges and request date labels
- [x] T029 [US3] Ensure `LeaveRequestList.tsx` only renders the 5 most recent requests sorted by `createdAtUTC`
- [x] T030 [US3] Add display of request status values (`Pending`, `Approved`, `Rejected`) and a legend if needed in `src/app/dashboard/LeaveRequestList.tsx`

**Checkpoint**: Recent leave request statuses are visible and independently testable.

---

## Phase 6: Polish & Cross-Cutting Concerns
**Purpose**: Clean up, document, and verify the final leave widget experience

- [x] T031 [P] Update README or specs/001-leave documentation with leave widget usage notes
- [x] T032 [P] Add structured error logging for validation failures in `src/app/api/leave/route.ts` or `src/actions/leave.ts`
- [x] T033 [P] Refine responsive layout in `src/app/dashboard/LeaveWidget.tsx` for up to 10 leave types
- [x] T034 [P] Run the leave dashboard performance test and document results in `tests/performance/leave-dashboard-latency.test.ts`
- [x] T035 [P] Review the implementation for constitution compliance and update `specs/001-leave/plan.md` if needed

**Checkpoint**: All story work is complete, polished, and conforms to constitutional and performance requirements.

---

## Coverage Map

| FR | Task IDs |
| --- | --- |
| FR-001: display current leave balance for each leave type | T015, T016, T018 |
| FR-002: include leave application form with leave type, from-date, to-date | T015, T016, T024, T025 |
| FR-003: display last 5 leave requests with request date and status | T015, T016, T017, T029, T030 |
| FR-004: prevent submission when fields missing or invalid date order | T019, T021, T026 |
| FR-005: indicate when there are no recent leave requests | T016, T020 |
| FR-006: show leave balances and recent request statuses on dashboard without separate page | T015, T016, T024, T029 |
| NFR-001: p95 ≤ 500 ms for 10 leave types and 5 requests | T015, T016, T014, T034 |
| NFR-002: responsive and usable with up to 10 leave types | T016, T018, T033 |
| NFR-003: clear distinction of leave types, balances, and statuses | T016, T017, T018, T030 |
