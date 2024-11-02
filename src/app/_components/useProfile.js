"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react"; 

export function useProfile() {
  const [isAdmin, setIsAdmin] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(false);
  const router = useRouter();
  const { status } = useSession(); 

  useEffect(() => {
    if (status === "authenticated") {
      setLoading(true);
      const fetchProfile = async () => {
        try {
          const response = await fetch("/api/profile");
          const data = await response.json();

          setData(data);

          if (!data.admin) {
            toast.error("You do not have permission!", { id: "no-permission" });
            setIsAdmin(false);
            setLoading(false);
            router.push("/");
          } else {
            setIsAdmin(true);
            setLoading(false);
          }
        } catch (error) {
          toast.error("Error fetching profile", { id: "fetch-error" });
          setLoading(false);
          router.push("/");
        }
      };

      fetchProfile();
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return { isAdmin, loading, status, data };
}
