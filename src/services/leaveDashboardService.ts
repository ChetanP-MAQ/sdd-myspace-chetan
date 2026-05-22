import { prisma } from '../lib/prisma';

export type LeaveBalanceRow = {
  leaveTypeId: string;
  leaveTypeName: string;
  availableDays: number;
};

export type LeaveRequestSummary = {
  id: string;
  leaveTypeId: string;
  leaveTypeName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  fromDateUTC: string;
  toDateUTC: string;
  createdAtUTC: string;
};

export async function getEmployeeLeaveDashboard(employeeId: string) {
  if (!prisma) {
    return {
      balances: [],
      requests: [],
    };
  }

  const balances = await prisma.leaveTypeBalance.findMany({
    where: { employeeId },
    orderBy: { leaveTypeName: 'asc' },
    take: 10,
    select: {
      leaveTypeId: true,
      leaveTypeName: true,
      availableDays: true,
    },
  });

  const requests = await prisma.leaveRequest.findMany({
    where: { employeeId },
    orderBy: { createdAtUTC: 'desc' },
    take: 5,
    select: {
      id: true,
      leaveTypeId: true,
      leaveTypeName: true,
      status: true,
      fromDateUTC: true,
      toDateUTC: true,
      createdAtUTC: true,
    },
  });

  return {
    balances: balances.map((item) => ({
      leaveTypeId: item.leaveTypeId,
      leaveTypeName: item.leaveTypeName,
      availableDays: item.availableDays,
    })),
    requests: requests.map((item) => ({
      id: item.id,
      leaveTypeId: item.leaveTypeId,
      leaveTypeName: item.leaveTypeName,
      status: item.status,
      fromDateUTC: item.fromDateUTC.toISOString(),
      toDateUTC: item.toDateUTC.toISOString(),
      createdAtUTC: item.createdAtUTC.toISOString(),
    })),
  };
}
