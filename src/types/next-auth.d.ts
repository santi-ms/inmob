import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    aiQueriesUsed?: number;
  }

  interface Session {
    user: User & {
      id: string;
      role: string;
      aiQueriesUsed: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    aiQueriesUsed?: number;
  }
}
