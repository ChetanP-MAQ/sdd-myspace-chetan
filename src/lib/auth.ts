export type EmployeeIdentity = {
  id: string;
  displayName: string;
};

export function getCurrentEmployee() {
  return {
    id: process.env.TEST_EMPLOYEE_ID ?? 'employee-1',
    displayName: 'Dashboard Employee',
  } as EmployeeIdentity;
}
