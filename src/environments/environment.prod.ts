export const environment = {
  production: true,
  siteUri: "https://synergy.rccbpo.com",
  apiUrl: "https://synergy.rccbpo.com/api/v1",
};

export const API = {
  TRACKERS: "/api/test/hr/trackers",
  TRACKER: (id: string) => {
    return "/api/test/hr/trackers/" + id;
  },
};
