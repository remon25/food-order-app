import { getSession } from "next-auth/react";

export const isAuthenticated = async () => {
  const session = await getSession();

  return !!session;
};
