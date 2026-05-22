import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../src/services/leaveDashboardService', () => ({
  getEmployeeLeaveDashboard: async () => ({
    balances: [
      { leaveTypeId: 'vacation', leaveTypeName: 'Vacation', availableDays: 10 },
      { leaveTypeId: 'sick', leaveTypeName: 'Sick', availableDays: 0 },
    ],
    requests: [
      {
        id: 'req-1',
        leaveTypeId: 'vacation',
        leaveTypeName: 'Vacation',
        status: 'PENDING',
        fromDateUTC: '2026-06-01T00:00:00.000Z',
        toDateUTC: '2026-06-02T00:00:00.000Z',
        createdAtUTC: '2026-05-01T00:00:00.000Z',
      },
    ],
  }),
}));

vi.mock('../../src/lib/auth', () => ({
  getCurrentEmployee: () => ({ id: 'employee-1', displayName: 'Test User' }),
}));

const LeaveWidget = (await import('../../src/app/dashboard/LeaveWidget')).default;

describe('Leave dashboard integration', () => {
  it('renders balances, recent requests, and apply form', async () => {
    const { container } = render(await LeaveWidget());

    expect(container).toHaveTextContent('Leave balances');
    expect(container).toHaveTextContent('Vacation');
    expect(container).toHaveTextContent('Sick');
    expect(container).toHaveTextContent('Recent Requests');
    expect(screen.getByRole('combobox', { name: /leave type/i })).toBeDefined();

    const fromDate = screen.getByLabelText(/from date/i);
    const toDate = screen.getByLabelText(/to date/i);
    const submitButton = screen.getByRole('button', { name: /submit request/i });

    fireEvent.change(fromDate, { target: { value: '2026-06-10' } });
    fireEvent.change(toDate, { target: { value: '2026-06-09' } });
    fireEvent.click(submitButton);

    expect(screen.getByRole('alert')).toHaveTextContent(/to date must be the same as or after the from date/i);
  });
});
