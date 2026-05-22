import React from 'react';

type LeaveBalanceRowProps = {
  leaveTypeName: string;
  availableDays: number;
};

export default function LeaveBalanceRow({ leaveTypeName, availableDays }: LeaveBalanceRowProps) {
  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '5rem',
    padding: '0.35rem 0.65rem',
    borderRadius: '999px',
    backgroundColor: availableDays === 0 ? '#fef2f2' : '#ecfdf5',
    color: availableDays === 0 ? '#991b1b' : '#065f46',
    fontWeight: 600,
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', backgroundColor: '#fff' }}>
      <span>{leaveTypeName}</span>
      <span style={badgeStyle}>{availableDays.toFixed(1)} days</span>
    </div>
  );
}
