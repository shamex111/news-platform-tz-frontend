export const env = {
  API_URL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  UPLOADS_URL:
    process.env.REACT_APP_UPLOADS_URL || "http://localhost:5000/uploads",
  SOCKET_URL: process.env.REACT_APP_SOCKET_URL || "http://localhost:5000",
  API_ROUTES: {
    USERS: {
      REGISTER: "/api/users/register",
      LOGIN: "/api/users/login",
      VERIFY: "/api/users/verify",
    },
    NEWS: {
      BASE: "/api/news",
      BY_ID: (id: string) => `/api/news/${id}`,
      PUBLISH: (id: string) => `/api/news/${id}/publish`,
    },
    UPLOAD: "/api/upload",
  },
} as const;
