"use client";
import { useSession } from "next-auth/react";
import UserTabs from "../_components/layout/UserTabs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import UserForm from "../_components/layout/UserForm";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setAdmin(data?.admin);
          setProfileFetched(true);
        });
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  async function handleNameChange(e, data) {
    e.preventDefault();
    const savingPromise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/profile", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        resolve();
      } else {
        reject();
      }
    });

    await toast.promise(savingPromise, {
      loading: "Saving...",
      success: "Profile saved successfully",
      error: "Could not save profile",
    });
  }

  if (status === "loading" || !profileFetched) {
    return (
      <h1 className="mt-24 text-center text-primary text-4xl font-bold mb-6">
        Loading...
      </h1>
    );
  }

  return (
    <section className="mt-24">
      <UserTabs admin={admin} />
      <UserForm user={user} onSave={handleNameChange} />
    </section>
  );
}
