import { NextResponse } from 'next/server';
import { getCurrentEmployee } from '../../../lib/auth';
import { logError, logEvent } from '../../../lib/logging';
import { prisma } from '../../../lib/prisma';
import { parseUTCDate } from '../../../lib/time';

const requiredFields = ['leaveTypeId', 'leaveTypeName', 'fromDateUTC', 'toDateUTC'];

export async function POST(request: Request) {
  const currentEmployee = getCurrentEmployee();

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  for (const field of requiredFields) {
    if (!body[field]) {
      return NextResponse.json({ error: `${field} is required.` }, { status: 400 });
    }
  }

  const leaveTypeId = String(body.leaveTypeId);
  const leaveTypeName = String(body.leaveTypeName);
  const fromDateUTC = String(body.fromDateUTC);
  const toDateUTC = String(body.toDateUTC);

  let fromDate: Date;
  let toDate: Date;

  try {
    fromDate = parseUTCDate(fromDateUTC);
    toDate = parseUTCDate(toDateUTC);
  } catch (error) {
    return NextResponse.json({ error: 'Dates must be valid ISO date strings.' }, { status: 400 });
  }

  if (toDate < fromDate) {
    return NextResponse.json(
      { error: 'To date must be the same as or after the from date.' },
      { status: 400 }
    );
  }

  try {
    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        employeeId: currentEmployee.id,
        leaveTypeId,
        leaveTypeName,
        fromDateUTC: fromDate,
        toDateUTC: toDate,
      },
    });

    logEvent({
      actor: currentEmployee.id,
      action: 'create_leave_request',
      entity_id: leaveRequest.id,
      status: 'success',
    });

    return NextResponse.json({ success: true, requestId: leaveRequest.id }, { status: 201 });
  } catch (error) {
    logError({
      actor: currentEmployee.id,
      action: 'create_leave_request',
      message: 'Leave request creation failed.',
      payload: { error: (error as Error).message },
    });
    return NextResponse.json({ error: 'Unable to create leave request.' }, { status: 500 });
  }
}
