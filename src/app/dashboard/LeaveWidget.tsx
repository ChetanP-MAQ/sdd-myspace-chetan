import React from 'react';
import LeaveApplyForm from './LeaveApplyForm';
import LeaveBalanceRow from './LeaveBalanceRow';
import LeaveRequestList from './LeaveRequestList';
import { getCurrentEmployee } from '../../lib/auth';
import { getEmployeeLeaveDashboard } from '../../services/leaveDashboardService';

const widgetGridStyle: React.CSSProperties = {
  display: 'grid',
  gap: '1.5rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
};

const balancesGridStyle: React.CSSProperties = {
  display: 'grid',
  gap: '0.75rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
};

const sectionBoxStyle: React.CSSProperties = {
  padding: '1rem',
  border: '1px solid #d1d5db',
  borderRadius: '0.75rem',
  backgroundColor: '#ffffff',
};

export default async function LeaveWidget() {
  const currentEmployee = getCurrentEmployee();
  const { balances, requests } = await getEmployeeLeaveDashboard(currentEmployee.id);

  return (
    <section aria-label="Leave dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header>
        <h2>Leave dashboard</h2>
        <p>Manage your balances and recent requests without leaving the dashboard.</p>
      </header>

      <div style={widgetGridStyle}>
        <section aria-label="Leave balances" style={sectionBoxStyle}>
          <h3>Leave balances</h3>
          {balances.length > 0 ? (
            <div style={balancesGridStyle}>
              {balances.map((balance) => (
                <LeaveBalanceRow
                  key={balance.leaveTypeId}
                  leaveTypeName={balance.leaveTypeName}
                  availableDays={balance.availableDays}
                />
              ))}
            </div>
          ) : (
            <p>No leave balances are available.</p>
          )}
        </section>

        <section aria-label="Apply for leave" style={sectionBoxStyle}>
          <LeaveApplyForm leaveTypes={balances} />
        </section>

        <section aria-label="Recent leave requests" style={sectionBoxStyle}>
          <LeaveRequestList requests={requests} />
        </section>
      </div>
    </section>
  );
}
