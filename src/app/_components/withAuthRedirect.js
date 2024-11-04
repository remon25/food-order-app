"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function withAuthRedirect(Component) {
  return function AuthRedirectWrapper(props) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "authenticated") {
        router.replace("/profile");
      }
    }, [status, router]);

    // Prevent flash by only rendering if status is "unauthenticated" or "loading"
    if (status === "loading" || status === "authenticated") return null;

    // If not authenticated, render the component
    return <Component {...props} />;
  };
}
