declare module "#auth-utils" {
  interface User {
    id: number;
    username: string;
    pub: string;
    permissions: string[];
    displayName?: string | null;
  }

  interface UserSession {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extended?: any;
    loggedInAt: number | Date;
    secure?: Record<string, unknown>;
  }
}

export {};
