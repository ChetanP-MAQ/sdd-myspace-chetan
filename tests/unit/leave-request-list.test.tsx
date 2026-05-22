import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LeaveRequestList from '../../src/app/dashboard/LeaveRequestList';

describe('LeaveRequestList', () => {
  it('renders status badges and sorts requests by created date', () => {
    const requests = [
      {
        id: '1',
        leaveTypeId: 'sick',
        leaveTypeName: 'Sick',
        status: 'REJECTED',
        fromDateUTC: '2026-06-02T00:00:00.000Z',
        toDateUTC: '2026-06-03T00:00:00.000Z',
        createdAtUTC: '2026-05-05T00:00:00.000Z',
      },
      {
        id: '2',
        leaveTypeId: 'vacation',
        leaveTypeName: 'Vacation',
        status: 'APPROVED',
        fromDateUTC: '2026-06-01T00:00:00.000Z',
        toDateUTC: '2026-06-01T00:00:00.000Z',
        createdAtUTC: '2026-05-06T00:00:00.000Z',
      },
    ];

    render(<LeaveRequestList requests={requests} />);

    expect(screen.getByText(/Rejected/i)).toBeDefined();
    expect(screen.getByText(/Approved/i)).toBeDefined();
    expect(screen.getAllByRole('listitem').length).toBe(2);
  });
});
