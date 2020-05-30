
export const USER_ROLES = {
  ACCOUNTING: { value: 0, name: 'Accounting' },
  MANAGEMENT: { value: 1, name: 'Management' },
  TRAINING: { value: 2, name: 'Training' },
  ADMINISTRATOR: { value: 3, name: 'Administrator' },
  HUMAN_RESOURCES: { value: 4, name: 'Human Resources' },
  OPERATIONS: { value: 5, name: 'Operations' },
  WEB_ADMINISTRATOR: { value: 9999, name: 'Web Administrator' },
};

export const DATA_TABLE = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 11,
    DEFAULT_PAGE_SIZES: [5, 10, 25, 100],
  },
};

export const IMAGE_VALUES = {
  QUALITY: {
    FULL: 1.0,
    MEDIUM: 0.5,
    LOW: 0.1,
  },
};

export const TIME_VALUES = {
  SHORT_TIME_TO_WAIT: 350,
  SEXAGESIMAL_BASE: 60,
  SECONDS_PER_HOUR: 3600,
  SECONDS_PER_MINUTE: 60,
  MINUTES_PER_HOUR: 60,
  MINUTES_PER_DAY: 1440,
  MINUTES_PER_HALF_DAY: 720,
  HOURS_PER_DAY: 24,
  OVER_ONE_DAY_HOURS: 25,
  SHORT_DEBOUNCE_TIME: 300,
  THREE_DAYS: 3,
  TWENTY_ONE_DAYS: 21,
  WEEK: {
    MONDAY: 0,
    TUESDAY: 1,
    WEDNESDAY: 2,
    THURSDAY: 3,
    FRIDAY: 4,
    SATURDAY: 5,
    SUNDAY: 6,
    AMOUNT_OF_DAYS: 7,
  },
  WEEK_NAMES: [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
  ],
  WORK: {
    REGULAR_HOURS: 45,
    AVERAGE_SYSTEM_HOURS_PER_DAY: 8,
  },
};

export const INCOME_VALUES = {
  EMPLOYEE: {
    AVERAGE_EARNING: 500,
  },
};

export const HTTP_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

export const TEMPERATURE_VALUES = {
  ZERO_KELVIN: 273.15,
  FREEZING_POINT: 32,
  DEGREE_RATIO: 1.8,
};

export const LEAVE_STATUS = {
  REFUSED: -1,
  SENT: 0,
  CERTIFIED: 1,
  SUPPORTED: 2,
  APPROVED: 3,
  FINISHED: 4,
  PROCESSED: 5,
};

export const LEAVE_STATUS_TYPES = {
  SENT: {
    name: 'SENT',
    id: 0
  },
  CERTIFIED: {
    name: 'CERTIFIED',
    id: 1
  },
  SUPPORTED: {
    name: 'SUPPORTED',
    id: 2
  },
  APPROVED: {
    name: 'APPROVED',
    id: 3
  },
  FINISHED: {
    name: 'FINISHED',
    id: 4
  },
};

export const SOCIAL = {
  FAMILY_RELATIONSHIPS : [
    {value: 'Partner', viewValue: 'Partner'},
    {value: 'Son', viewValue: 'Son'},
    {value: 'Daughter', viewValue: 'Daughter'},
    {value: 'Son-in-law', viewValue: 'Son-in-law'},
    {value: 'Daughter-in-law', viewValue: 'Daughter-in-law'},
    {value: 'Niece', viewValue: 'Niece'},
    {value: 'Nephew', viewValue: 'Nephew'},
    {value: 'Cousin', viewValue: 'Cousin'},
    {value: 'Cousin’s husband', viewValue: 'Cousin’s husband'},
    {value: 'Cousin’s wife', viewValue: 'Cousin’s wife'},
    {value: 'Wife', viewValue: 'Wife'},
    {value: 'Husband', viewValue: 'Husband'},
    {value: 'Brother', viewValue: 'Brother'},
    {value: 'Sister', viewValue: 'Sister'},
    {value: 'Brother-in-law', viewValue: 'Brother-in-law'},
    {value: 'Sister-in-law', viewValue: 'Sister-in-law'},
    {value: 'Father', viewValue: 'Father'},
    {value: 'Mother', viewValue: 'Mother'},
    {value: 'Uncle', viewValue: 'Uncle'},
    {value: 'Aunt', viewValue: 'Aunt'},
    {value: 'Great-uncle', viewValue: 'Great-uncle'},
    {value: 'Great-aunt', viewValue: 'Great-aunt'},
    {value: 'Grandmother', viewValue: 'Grandmother'},
    {value: 'Grandfather', viewValue: 'Grandfather'},
    {value: 'Friend', viewValue: 'Friend'},
  ],
  MARITAL_STATUS:[
    { value: 'Single', name: 'Single' },
    { value: 'Married', name: 'Married/Remarried' },
    { value: 'Separated', name: 'Separated' },
    { value: 'Common Law', name: 'Common Law' },
    { value: 'Divorced', name: 'Divorced' },
    { value: 'Widowed', name: 'Widowed' },
  ],
  GENDERS: [
    { value: 'male', viewValue: 'Male' },
    { value: 'female', viewValue: 'Female' },
  ]
};

export const LABORAL= {
  RESTRICTIONS: [
    {value: 'student', viewValue: 'Student'},
    {value: 'out-of-village', viewValue: 'Out of Village'},
    {value: 'court', viewValue: 'Court'},
    {value: 'adventist', viewValue: 'Adventist'},
    {value: 'personal', viewValue: 'Personal'},
    {value: 'other', viewValue: 'Other', other: true },
  ],
  STATUS: [
    { value: 'active', viewValue: 'Active' },
    {
      value: 'resignation',
      viewValue: 'Resignation',
      onclick: 'openStatusDialog()',
    },
    {
      value: 'dissmisal',
      viewValue: 'Dissmisal',
      onclick: 'openStatusDialog()',
    },
    {
      value: 'termination',
      viewValue: 'Termination',
      onclick: 'openStatusDialog()',
    },
    { value: 'on-hold', viewValue: 'On-Hold' },
    { value: 'transfer', viewValue: 'Transfer' },
    //   { value: 'trainee', viewValue: 'Trainee' }
  ],
  PAYROLL:{
    CONCEPT_TYPES : [
      {
        type: 'Taxable Bonus',
        concepts: [{ concept: 'Other Bonus' }],
      },
      {
        type: 'Non-Taxable Bonus',
        concepts: [{ concept: 'Attendance Bonus (Falcon)' }],
      },
      {
        type: 'Deduction',
        concepts: [
          { concept: 'Tax' },
          { concept: 'Lost Access Token' },
          { concept: 'Magistrate Court' },
          { concept: 'Loan/Salary Advance' },
          { concept: 'Police Record' },
          { concept: 'Headset' },
          { concept: 'Uniform' },
          { concept: 'Quick Stop / AAA Loans' },
          { concept: 'Overpayment' },
          { concept: 'Early / Break Offender' },
        ],
      },
      {
        type: 'Other Payments',
        concepts: [
          { concept: 'Vacations' },
          { concept: 'Certify Sick Leave' },
          { concept: 'Compassionate Leave' },
          { concept: 'Maternity Leave' },
          { concept: 'Training Hours' },
          { concept: 'Training Stipend' },
          { concept: 'Time off System' },
          { concept: 'Time off System 1.5' },
          { concept: 'Time off System 2X' },
          { concept: 'Card (cleaners/Security)' },
          { concept: 'Card 1.5' },
          { concept: 'Card 2X' },
          { concept: 'Salary Differences (Discrepancies)' },
        ],
      },
      {
        type: 'Final Payments',
        concepts: [{ concept: 'Severance' }, { concept: 'Notice Payment' }],
      },
    ]
  }
};

export const LOCATION = {
  DISTRICTS: [
    { value: 'Corozal', name: 'Corozal' },
    { value: 'Orange Walk', name: 'Orange Walk' },
    { value: 'Belize', name: 'Belize' },
    { value: 'Belmopan', name: 'Belmopan' },
    { value: 'Cayo', name: 'Cayo' },
    { value: 'Stann Creek', name: 'Stann Creek' },
    { value: 'Toledo', name: 'Toledo' },
  ],
  TOWNS: [
    { value: 'August Pine Ridge', name: 'August Pine Ridge' },
    { value: 'Belize City', name: 'Belize City' },
    { value: 'Bella Vista', name: 'Bella Vista' },
    { value: 'Belmopan', name: 'Belmopan' },
    { value: 'Benque Viejo', name: 'Benque Viejo' },
    { value: 'Biscayne Village', name: 'Biscayne Village' },
    { value: 'Boston Village', name: 'Boston Village' },
    { value: 'Burrell Boom', name: 'Burrell Boom' },
    { value: 'Camalote', name: 'Camalote' },
    { value: 'Carmelita', name: 'Carmelita' },
    { value: 'Concepcion Village', name: 'Concepcion Village' },
    { value: 'Corozal Town', name: 'Corozal Town' },
    { value: 'Cotton Tree Village', name: 'Cotton Tree Village' },
    { value: 'Crooked Tree', name: 'Crooked Tree' },
    { value: 'Dangriga', name: 'Dangriga' },
    { value: 'Double Head Cabbage', name: 'Double Head Cabbage' },
    { value: 'Gardenia Village', name: 'Gardenia Village' },
    { value: 'Guinea Grass Village', name: 'Guinea Grass Village' },
    { value: 'Hattieville', name: 'Hattieville' },
    { value: 'Independence', name: 'Independence' },
    { value: 'Ladyville', name: 'Ladyville' },
    { value: 'Libertad Village', name: 'Libertad Village' },
    { value: 'Little belize', name: 'Little belize' },
    { value: 'Lords Bank', name: 'Lords Bank' },
    { value: 'Mahogany Heights', name: 'Mahogany Heights' },
    { value: 'Maskall Village', name: 'Maskall Village' },
    { value: 'Northern Highway', name: 'Northern Highway' },
    { value: 'Orange Walk Town', name: 'Orange Walk Town' },
    { value: 'Palmar Village', name: 'Palmar Village' },
    { value: 'Punta Gorda', name: 'Punta Gorda' },
    { value: 'Ranchito Village', name: 'Ranchito Village' },
    { value: 'Roaring Creek', name: 'Roaring Creek' },
    { value: 'San Felipe Village', name: 'San Felipe Village' },
    { value: 'San Ignacio', name: 'San Ignacio' },
    { value: 'San Jose Village', name: 'San Jose Village' },
    { value: 'San Lazaro Village', name: 'San Lazaro Village' },
    { value: 'San Narciso Village', name: 'San Narciso Village' },
    { value: 'San Pablo Village', name: 'San Pablo Village' },
    { value: 'San Pedro', name: 'San Pedro' },
    { value: 'Santa Elena', name: 'Santa Elena' },
    { value: 'Sandhill Village', name: 'Sandhill Village' },
    { value: 'Scotland Halfmoon Village', name: 'Scotland Halfmoon Village' },
    { value: 'Shipyard', name: 'Shipyard' },
    { value: 'Trial Farm', name: 'Trial Farm' },
    { value: 'Trinidad Village', name: 'Trinidad Village' },
    { value: 'Western Highway', name: 'Western Highway' },
    { value: 'Yo Creek Village', name: 'Yo Creek Village' },
  ],
  
};