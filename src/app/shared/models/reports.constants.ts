export const WORKFORCE_REPORTS = [
  {
    name: 'Contact Info Report',
    tooltip: `employeeId, firstName, lastName, actualClient, actualCampaign, celNumber,
    telNumber, email, address, town, district`,
    projection: 'contact',
    options: [],
  },
  {
    name: 'Leave Report',
    tooltip: `employeeId, firstName, lastName, actualClient, actualCampaign, excuseTimeFrom, excuseTimeTo, reason, description, isSupported, isCertified`,
    projection: 'leaves',
    options: [],
    extras: [],
    extraFilters: [],
  },
  {
    name: 'Leads Report',
    tooltip: `
    employeeId,
    firstName,
    lastName,
    actualClient,
    actualCampaign,
    manager,
    shiftManager,
    supervisor,
    trainer
    `,
    projection: 'leads',
    options: [],
  },
  {
    name: 'Hire Report',
    tooltip: `
     employeeId,
    firstName,
    lastName,
    actualClient,
    actualCampaign,
    hireDate
    `,
    projection: 'hire',
    options: [],
  },
  {
    name: 'Emergency Contact Report',
    tooltip: ` employeeId, firstName, lastName, actualClient, actualCampaign,
              celNumber, telNumber, email, address, town, district, family
              `,
    projection: 'emergency',
    options: [],
  },
  {
    name: 'Weekly Shift Report',
    tooltip: `
     employeeId,
    firstName,
    lastName,
    actualClient,
    actualCampaign,
    celNumber,
    telNumber,
    email,
    address,
    town,
    district,
    restriction,
    shift
    `,
    projection: 'shift',
    options: [],
  },
  {
    name: 'Hours Existence Report',
    tooltip: `
     employeeId,
    firstName,
    lastName,
    actualClient,
    actualCampaign,
    last-15-days-hours
    `,
    projection: 'hours',
    options: [],
  },
];
export const OPERATIONS_REPORTS = [
  {
    name: 'Latest Position Report',
    tooltip: `
    employeeId,
    firstName,
    lastName,
    actualClient,
    actualCampaign,
    manager,
    shiftManager,
    supervisor,
    trainer,
    billable,
    position
    `,
    projection: 'position',
    options: [
      {
        $unwind: {
          path: '$position',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          position: '$position.name',
          department: '$position.department',
          positionClient: '$position.client',
          positionCampaign: '$position.campaign',
          positionId: '$position.positionId',
          startDate: { $dateToString: { date: '$position.startDate', format: '%m/%d/%Y' } },
          endDate: { $dateToString: { date: '$position.endDate', format: '%m/%d/%Y' } },
        },
      },
    ],
  },
];
export const HR_REPORTS = [
  {
    name: 'Attrition Report',
    tooltip: `
     employeeId,
    firstName,
    lastName,
    actualClient,
    actualCampaign,
    terminationDate
    `,
    projection: 'attrition',
    options: [
      {
        $unwind: {
          path: '$attrition',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          reason1: '$attrition.reason1',
          reason2: '$attrition.reason2',
          comment: '$attrition.comment',
          submittedBy: { $concat: ['$attrition.submittedBy.firstName', ' ', '$attrition.submittedBy.lastName'] },
          commentDate: { $dateToString: { date: '$attrition.commentDate', format: '%m/%d/%Y' } },
        },
      },
    ],
  },
];
export const PAYROLL_REPORTS = [
  {
    name: 'Termination Report',
    tooltip: `
     employeeId,
    firstName,
    middleName,
    lastName,
    emailAddress,
    actualClient,
    actualCampaign,
    hireDate,
    socialSecurity,
    attritionReason,
    bankAccount,
    hourlyRate,
    terminationDate,
    last 3 positions,
    `,
    projection: 'termination',
    options: [],
  },
  {
    name: 'New Hires Report',
    tooltip: `
     employeeId,
    firstName,
    middleName,
    lastName,
    emailAddress,
    actualClient,
    actualCampaign,
    hireDate,
    socialSecurity,
    attritionReason,
    bankAccount,
    hourlyRate,
    terminationDate,
    `,
    projection: 'payrollHires',
    options: [],
  },
  {
    name: 'Billing Report',
    tooltip: `
     employeeId,
    firstName,
    lastName,
    actualClient,
    actualCampaign,
    billable,
    systemHours,
    tosHours,
    trainingHours,
    breakAndLunchHours,
    scheduledHours,
    `,
    projection: 'billing',
    options: [],
  },
];
export const PROJECTIONS = {
  contact: {
    _id: 0,
    employeeId: 1,
    status: 1,
    firstName: 1,
    lastName: 1,
    actualClient: '$company.client',
    actualCampaign: '$company.campaign',
    celNumber: '$personal.celNumber',
    telNumber: '$personal.telNumber',
    email: '$personal.emailAddress',
    address: '$personal.address',
    town: '$personal.town',
    district: '$personal.district',
  },
  leaves: {
    _id: 0,
    employeeId: 1,
    status: 1,
    firstName: 1,
    lastName: 1,
    actualClient: '$company.client',
    actualCampaign: '$company.campaign',
    leaves: 1
  },
  emergency: {
    _id: 0,
    employeeId: 1,
    status: 1,
    firstName: 1,
    lastName: 1,
    actualClient: '$company.client',
    actualCampaign: '$company.campaign',
    celNumber: '$personal.celNumber',
    telNumber: '$personal.telNumber',
    email: '$personal.emailAddress',
    address: '$personal.address',
    town: '$personal.town',
    district: '$personal.district',
    family: 1,
  },
  shift: {
    _id: 0,
    employeeId: 1,
    status: 1,
    firstName: 1,
    lastName: 1,
    actualClient: '$company.client',
    actualCampaign: '$company.campaign',
    celNumber: '$personal.celNumber',
    telNumber: '$personal.telNumber',
    email: '$personal.emailAddress',
    address: '$personal.address',
    town: '$personal.town',
    district: '$personal.district',
    restriction: '$personal.restriction',
    shift: 1,
  },
  hours: {
    _id: 0,
    employeeId: 1,
    status: 1,
    firstName: 1,
    lastName: 1,
    actualClient: '$company.client',
    actualCampaign: '$company.campaign',
    billable: '$payroll.billable',
    hours: 1,
  },
  position: {
    _id: 0,
    employeeId: 1,
    status: 1,
    firstName: 1,
    lastName: 1,
    actualClient: '$company.client',
    actualCampaign: '$company.campaign',
    manager: '$company.manager.name',
    shiftManager: '$company.shiftManager.name',
    supervisor: '$company.supervisor.name',
    trainer: '$company.trainer.name',
    billable: '$payroll.billable',
    position: { $arrayElemAt: ['$position', 0] },
  },
  leads: {
    _id: 0,
    employeeId: 1,
    status: 1,
    firstName: 1,
    lastName: 1,
    actualClient: '$company.client',
    actualCampaign: '$company.campaign',
    manager: '$company.manager.name',
    shiftManager: '$company.shiftManager.name',
    supervisor: '$company.supervisor.name',
    trainer: '$company.trainer.name',
  },
  hire: {
    _id: 0,
    employeeId: 1,
    status: 1,
    firstName: 1,
    lastName: 1,
    actualClient: '$company.client',
    actualCampaign: '$company.campaign',
    hireDate: { $dateToString: { date: '$company.hireDate', format: '%m/%d/%Y' } },
  },
  attrition: {
    _id: 0,
    employeeId: 1,
    status: 1,
    firstName: 1,
    lastName: 1,
    actualClient: '$company.client',
    actualCampaign: '$company.campaign',
    terminationDate: { $dateToString: { date: '$company.terminationDate', format: '%m/%d/%Y' } },
    attrition: 1,
  },
  billing: {
    _id: 0,
    employeeId: 1,
    status: 1,
    firstName: 1,
    lastName: 1,
    actualClient: '$company.client',
    actualCampaign: '$company.campaign',
    hireDate: { $dateToString: { date: '$company.hireDate', format: '%m/%d/%Y' } },
    billing: 1,
  },
};
