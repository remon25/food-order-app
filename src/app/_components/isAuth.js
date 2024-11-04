"use client";
import { isAuthenticated } from "../_utilis/isAuthenticated";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function isAuth(Component) {
  return function IsAuth(props) {
    const [loading, setLoading] = useState(true);
    const [auth, setAuth] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const authenticated = await isAuthenticated();
        setAuth(authenticated);
        setLoading(false);

        if (!authenticated) {
          // Redirect if not authenticated
          router.push("/login"); 
        }
      };

      checkAuth();
    }, [router]);

    if (loading) {
      return <div>Loading...</div>; 
    }

    if (!auth) {
      return null;
    }

    return <Component {...props} />;
  };
}
