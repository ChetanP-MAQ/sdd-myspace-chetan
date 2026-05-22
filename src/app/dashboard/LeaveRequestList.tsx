import React from 'react';

type LeaveRequest = {
  id: string;
  leaveTypeName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  fromDateUTC: string;
  toDateUTC: string;
  createdAtUTC: string;
};

type LeaveRequestListProps = {
  requests: LeaveRequest[];
};

function formatStatus(status: LeaveRequest['status']) {
  switch (status) {
    case 'APPROVED':
      return 'Approved';
    case 'REJECTED':
      return 'Rejected';
    default:
      return 'Pending';
  }
}

function getStatusBadgeStyle(status: LeaveRequest['status']): React.CSSProperties {
  const baseStyle: React.CSSProperties = {
    padding: '0.25rem 0.55rem',
    borderRadius: '999px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#111827',
    whiteSpace: 'nowrap',
  };

  switch (status) {
    case 'APPROVED':
      return { ...baseStyle, backgroundColor: '#d1fae5', color: '#065f46' };
    case 'REJECTED':
      return { ...baseStyle, backgroundColor: '#fee2e2', color: '#991b1b' };
    default:
      return { ...baseStyle, backgroundColor: '#fef3c7', color: '#92400e' };
  }
}

export default function LeaveRequestList({ requests }: LeaveRequestListProps) {
  if (requests.length === 0) {
    return <p>No recent leave requests have been submitted.</p>;
  }

  return (
    <section aria-label="Recent leave requests">
      <h3>Recent Requests</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '1rem' }}>
        {requests.map((request) => (
          <li
            key={request.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              padding: '1rem',
              backgroundColor: '#fafafa',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
              <strong>{request.leaveTypeName}</strong>
              <span style={getStatusBadgeStyle(request.status)}>{formatStatus(request.status)}</span>
            </div>
            <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.35rem' }}>
              <span>From: {new Date(request.fromDateUTC).toLocaleDateString('en-US')}</span>
              <span>To: {new Date(request.toDateUTC).toLocaleDateString('en-US')}</span>
              <span>Submitted: {new Date(request.createdAtUTC).toLocaleDateString('en-US')}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
