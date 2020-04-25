export const environment = {
  production: true,
  siteUri: 'https://beta.rccbpo.com',
  apiUrl: 'https://beta.rccbpo.com/api/v1',
};

export const API = {
  TRACKERS: '/api/test/hr/trackers',
  TRACKER: (id: string) => {
    return '/api/test/hr/trackers/' + id;
  },
  LEAVES: environment.siteUri + '/api/test/employee/leave-request',
  LEAVE: (id: string) => {
    return environment.siteUri + '/api/test/employee/leave-request/' + id;
  },
  LEAVE_DOCUMENT: (id: string) => {
    return environment.siteUri + '/api/test/employee/leave-request/' + id + '/document';
  },
};

export const TRACKER_STATUS = {
  PENDING: 0,
  IN_PROGRESS: 1,
  DONE: 2,
};

export const TRACKER_STATUS_LABELS = ['Pending', 'In progress', 'Done'];
