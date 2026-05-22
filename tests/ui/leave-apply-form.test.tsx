import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LeaveApplyForm from '../../src/app/dashboard/LeaveApplyForm';

describe('LeaveApplyForm UI', () => {
  it('renders exactly three form fields', () => {
    render(
      <LeaveApplyForm
        leaveTypes={[
          { leaveTypeId: 'vacation', leaveTypeName: 'Vacation', availableDays: 10 },
          { leaveTypeId: 'sick', leaveTypeName: 'Sick', availableDays: 0 },
        ]}
      />
    );

    expect(screen.getByLabelText(/leave type/i)).toBeDefined();
    expect(screen.getByLabelText(/from date/i)).toBeDefined();
    expect(screen.getByLabelText(/to date/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /submit request/i })).toBeInTheDocument();
  });
});
