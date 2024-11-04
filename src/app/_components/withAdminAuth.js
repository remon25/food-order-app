"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function withAdminAuth(Component) {
  return function AdminAuth(props) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const checkAdmin = async () => {
        if (status === "loading") return;

        // If the user is not authenticated, redirect to login
        if (status === "unauthenticated") {
          router.push("/login");
          return;
        }

        // If the user is authenticated, check admin status
        try {
          const res = await fetch('/api/check-admin');
          if (!res.ok) {
            throw new Error("Not an admin");
          }

          setLoading(false);
        } catch (error) {
          console.error(error);
          toast.error("You don't have permission to access this page.");
          router.push("/profile"); // Redirect non-admins to profile
        }
      };

      checkAdmin();
    }, [session, status, router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };
}
