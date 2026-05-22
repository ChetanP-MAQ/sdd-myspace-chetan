# Feature Specification: Leave Balance + Apply Leave Widget

## Context
The MySpace portal dashboard must support self-service leave management for employees in Module M02 Leave Management. Employees should be able to view their current leave balance by type and apply for leave without leaving the dashboard. The widget must also make recent leave activity visible so employees understand the status of past requests. Performance is constrained so the primary data read must be fast for typical employee usage.

## User Stories

### User Story 1 - Dashboard leave overview and apply flow (Priority: P1)
As a P1 employee, I want to see my current leave balance per leave type and apply for leave from the same dashboard widget so I can manage my time-off without switching contexts.

**Why this priority**: This delivers immediate self-service value and reduces the need for employees to navigate to a separate leave page.

**Independent Test**: Validate that the dashboard shows balances, the three-field apply form is available, and the latest leave requests are visible in one widget.

**Acceptance Scenarios**:
1. **Given** I am an authenticated employee on the dashboard, **When** the widget loads, **Then** I see each leave type with the available balance and the last 5 leave requests with status.
2. **Given** I have no previous leave requests, **When** the widget loads, **Then** I see my leave balances and a message that no recent requests exist.
3. **Given** I enter a `to-date` that is before the `from-date`, **When** I try to submit the form, **Then** the request is not submitted and I see a validation error.
4. **Given** one of my balances is zero, **When** the dashboard widget displays balances, **Then** the zero balance is shown clearly and I can still view recent requests.

---

### User Story 2 - Compact leave application input (Priority: P2)
As a P2 employee, I want a compact form with leave type, from-date, and to-date fields so I can apply for leave quickly with minimal interaction.

**Why this priority**: The widget should make leave application fast and intuitive without requiring a full leave request page.

**Independent Test**: Confirm the form appears with exactly three fields and that it is usable on the dashboard.

**Acceptance Scenarios**:
1. **Given** the dashboard widget is visible, **When** I open the leave application area, **Then** I see a form with only leave type, from-date, and to-date.

---

### User Story 3 - Recent request status visibility (Priority: P3)
As a P3 employee, I want to see the status of my last 5 leave requests so I can quickly check whether my requests are pending, approved, or rejected.

**Why this priority**: This gives employees confidence about their recent leave activity without extra navigation.

**Independent Test**: Verify the widget lists up to 5 recent requests with readable status labels.

**Acceptance Scenarios**:
1. **Given** I have more than 5 leave requests, **When** the widget loads, **Then** I see exactly the 5 most recent requests sorted by date.

## Functional Requirements

- **FR-001**: The widget MUST display current leave balance for each leave type available to the employee.
- **FR-002**: The widget MUST include a leave application form with exactly these fields: leave type, from-date, and to-date.
- **FR-003**: The widget MUST display the employee’s last 5 leave requests with request date and status.
- **FR-004**: The leave application form MUST prevent submission when required fields are missing or when `to-date` is earlier than `from-date`.
- **FR-005**: The widget MUST indicate when there are no recent leave requests to show.
- **FR-006**: The widget MUST show leave balances and recent request statuses on the dashboard without requiring a separate page.

## Non-functional Requirements

- **NFR-001**: The primary dashboard read for leave balances and recent requests MUST complete with p95 ≤ 500 ms for an employee profile with up to 10 leave types and 5 recent leave requests.
- **NFR-002**: The widget MUST remain responsive and usable on the dashboard when the employee has up to 10 leave types.
- **NFR-003**: The dashboard presentation MUST clearly distinguish leave types, available balance, and the status of recent leave requests.
- **Dataset Assumption**: The performance target assumes up to 10 leave type categories and at most 5 recent leave requests per employee.

## Acceptance Criteria

### P1 Happy Path
1. **Given** I am an employee on the dashboard, **When** the leave widget loads successfully, **Then** I see each leave type with available balance and the last 5 leave requests with status.

### P1 Edge Case 1: No recent requests
2. **Given** I have not submitted any leave requests, **When** the widget loads, **Then** I see my leave balances and a clear message that no recent leave requests are available.

### P1 Edge Case 2: Invalid date range
3. **Given** I enter a `from-date` and a `to-date` where `to-date` is before `from-date`, **When** I click submit, **Then** the widget blocks submission and displays a validation error.

### P1 Edge Case 3: Zero balance type
4. **Given** one leave type balance is zero, **When** the widget renders, **Then** the zero balance is shown clearly and the apply form still remains available for other leave types.

## Open Questions

- Should the widget support partial-day leave types or only full-day leave requests in this iteration?
  - Answer: Only full-day leave requests in this iteration.
  - Rationale: Keeping the widget focused on the core three-field form avoids adding partial-day scheduling complexity in this scope.

- Should the leave type names shown in the widget be exactly the employee’s entitlement categories, or can they be consolidated for display?
  - Answer: Use the employee’s entitlement categories as shown.
  - Rationale: Displaying exact entitlement categories keeps balances transparent and reduces confusion about available leave.

- Is the dashboard widget expected to show a live summary of applied dates when the form is being filled?
  - Answer: No, that is not expected in this iteration.
  - Rationale: A live summary would introduce additional UI behavior beyond the current dashboard widget scope.

### Remaining Open Questions

- None.

## Out of Scope

- Approval workflows, manager review screens, and leave request decision actions.
- Detailed request history beyond the last 5 leave requests.
- Automated entitlement calculation rules and leave policy management.
- Any database schema, API route, or framework-specific implementation details.
