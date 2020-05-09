import { Chance } from './chance.model';

interface Absenteeism {
  firstChance: Chance;
  secondChance: Chance;
  thirdChance: Chance;
}

export interface Tracker {
  statusChange?: {
    absenteeism: Absenteeism;
    newStatus: string;
    effectiveDate: Date;
    supervisorSignature: string;
    managerSignature: string;
    employeeSignature?: string;
    reason?: string;
  };

  transfer?: {
    effectiveDate: Date;
    oldClient: string;
    oldCampaign: string;
    newClient: string;
    newCampaign: string;
    reason: string;
    managerSignature: string;
  };

  certifyTraining?: {
    certificationDate: Date;
    client: string;
    campaign: string;
    reason: string;
    managerSignature: string;
  };

  infoChangeRequest?: {
    mainInfo: boolean;
    companyInfo: boolean;
    personalInfo: boolean;
    positionInfo: boolean;
    reason: string;
  };
}
