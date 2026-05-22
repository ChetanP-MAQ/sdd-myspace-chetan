import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LeaveRequestList from '../../src/app/dashboard/LeaveRequestList';
import LeaveBalanceRow from '../../src/app/dashboard/LeaveBalanceRow';

const balances = Array.from({ length: 10 }, (_, index) => ({
  leaveTypeId: `type-${index}`,
  leaveTypeName: `Type ${index}`,
  availableDays: 5 + index,
}));

const requests = Array.from({ length: 5 }, (_, index) => ({
  id: `request-${index}`,
  leaveTypeId: `type-${index}`,
  leaveTypeName: `Type ${index}`,
  status: index % 2 === 0 ? 'PENDING' : 'APPROVED',
  fromDateUTC: `2026-06-${String(index + 1).padStart(2, '0')}T00:00:00.000Z`,
  toDateUTC: `2026-06-${String(index + 2).padStart(2, '0')}T00:00:00.000Z`,
  createdAtUTC: `2026-05-${String(10 - index).padStart(2, '0')}T00:00:00.000Z`,
}));

describe('leave dashboard latency', () => {
  it('renders a dashboard slice within p95 target', () => {
    const start = performance.now();
    render(
      <div>
        {balances.map((balance) => (
          <LeaveBalanceRow
            key={balance.leaveTypeId}
            leaveTypeName={balance.leaveTypeName}
            availableDays={balance.availableDays}
          />
        ))}
        <LeaveRequestList requests={requests} />
      </div>
    );
    const duration = performance.now() - start;

    expect(duration).toBeLessThanOrEqual(500);
  });
});
