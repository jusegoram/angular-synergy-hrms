import { Chance } from "./chance";

interface Absenteeism {
  firstChance: Chance;
  secondChance: Chance;
  thirdChance: Chance;
}

interface SupervisorSignature {
  type: string;
  data: number[];
}

interface ManagerSignature {
  type: string;
  data: number[];
}

interface EmployeeSignature {
  type: string;
  data: number[];
}

export interface Tracker {
  absenteeism: Absenteeism;
  newStatus: string;
  effectiveDate: Date;
  supervisorSignature: SupervisorSignature;
  managerSignature: ManagerSignature;
  employeeSignature: EmployeeSignature;
}
