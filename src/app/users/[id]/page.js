"use client";
import { useEffect, useState, useRef } from "react";
import UserForm from "../../_components/layout/UserForm";
import UserTabs from "../../_components/layout/UserTabs";
import { useProfile } from "../../_components/useProfile";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function EditUserPage() {
  const { loading: profileLoading, status, isAdmin } = useProfile();
  const [user, setUser] = useState(null); // Manage user data
  const [isLoadingUser, setIsLoadingUser] = useState(true); // Separate loading for user fetch
  const { id } = useParams();

  const hasFetched = useRef(false); // Ref to track if the user has already been fetched

  useEffect(() => {
    if (id && !hasFetched.current) {
      setIsLoadingUser(true); // Set loading state before fetching
      fetch(`/api/profile?_id=${id}`)
        .then((response) => response.json())
        .then((user) => {
          setUser(user); // Set the fetched user data
          hasFetched.current = true; // Mark that the user has been fetched
          setIsLoadingUser(false); // Stop loading when done
        })
        .catch(() => {
          setIsLoadingUser(false); // Stop loading even if there's an error
        });
    }
  }, [id, isAdmin]);

  async function handleSaveUser(ev, data) {
    ev.preventDefault();

    toast.promise(
      fetch("/api/profile/", {
        method: "PUT",
        body: JSON.stringify({ ...data, _id: id }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update profile");
        }
        return response.json();
      }),
      {
        loading: "Saving...",
        success: "Profile updated successfully!",
        error: "Failed to update profile",
      }
    );
  }

  if (profileLoading || status === "loading" || isLoadingUser) {
    return (
      <h1 className="mt-24 text-center text-primary text-4xl font-bold mb-6">
        Loading...
      </h1>
    );
  }

  if (isAdmin === null || user === null) return null; // Ensure user and admin data are available

  return (
    <section className="mt-24 max-w-2xl mx-auto">
      <UserTabs admin={isAdmin} />
      <div className="mt-8">
        <UserForm user={user} onSave={handleSaveUser} isAdmin={isAdmin} />
      </div>
    </section>
  );
}
