'use client';

import React, { useState } from 'react';

type LeaveType = {
  leaveTypeId: string;
  leaveTypeName: string;
  availableDays: number;
};

type LeaveApplyFormProps = {
  leaveTypes: LeaveType[];
};

export default function LeaveApplyForm({ leaveTypes }: LeaveApplyFormProps) {
  const [leaveTypeId, setLeaveTypeId] = useState(leaveTypes[0]?.leaveTypeId ?? '');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!leaveTypeId || !fromDate || !toDate) {
      setError('Leave type, from date, and to date are all required.');
      return;
    }

    if (new Date(toDate) < new Date(fromDate)) {
      setError('To date must be the same as or after the from date.');
      return;
    }

    setSubmitting(true);

    try {
      const leaveType = leaveTypes.find((type) => type.leaveTypeId === leaveTypeId);
      const response = await fetch('/api/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaveTypeId,
          leaveTypeName: leaveType?.leaveTypeName,
          fromDateUTC: fromDate,
          toDateUTC: toDate,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result?.error ?? 'Unable to submit leave request.');
      } else {
        setSuccess('Leave request submitted successfully.');
        setFromDate('');
        setToDate('');
      }
    } catch (caught) {
      setError('Unable to submit leave request at this time.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form aria-label="Apply for leave" onSubmit={handleSubmit}>
      <h3>Apply for leave</h3>
      <label>
        Leave type
        <select value={leaveTypeId} onChange={(event) => setLeaveTypeId(event.target.value)}>
          {leaveTypes.map((type) => (
            <option key={type.leaveTypeId} value={type.leaveTypeId}>
              {type.leaveTypeName}
            </option>
          ))}
        </select>
      </label>

      <label>
        From date
        <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
      </label>

      <label>
        To date
        <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
      </label>

      {error && <div role="alert">{error}</div>}
      {success && <div role="status">{success}</div>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit request'}
      </button>
    </form>
  );
}
