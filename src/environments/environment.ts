// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  siteUri: 'http://localhost:3000',
  apiUrl: 'http://localhost:3000/api/v1',
};

export const API = {
  TRACKERS: environment.siteUri + '/api/test/hr/trackers',
  TRACKER: (id: string) => {
    return environment.siteUri + '/api/test/hr/trackers/' + id;
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
