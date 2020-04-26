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
