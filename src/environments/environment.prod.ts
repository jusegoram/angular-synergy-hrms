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
};
