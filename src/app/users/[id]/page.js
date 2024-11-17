"use client";
import { useEffect, useState, useRef } from "react";
import UserForm from "../../_components/layout/UserForm";
import { useProfile } from "../../_components/useProfile";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import AdminTabs from "@/app/_components/layout/AdminTabs";
import Spinner from "@/app/_components/layout/Spinner";

function EditUserPage() {
  const { loading: profileLoading, status } = useProfile(); 
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null); 
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const { id } = useParams();
  const hasFetched = useRef(false);

  useEffect(() => {
    
    const fetchAdminStatus = async () => {
      try {
        const response = await fetch("/api/check-admin"); 
        if (!response.ok) {
          throw new Error("Failed to check admin status");
        }
        const data = await response.json();
        setIsAdmin(data.isAdmin); 
      } catch (error) {
        console.error("Error fetching admin status:", error);
      }
    };

   
    if (id && !hasFetched.current) {
      setIsLoadingUser(true);
      fetch(`/api/profile?_id=${id}`)
        .then((response) => response.json())
        .then((user) => {
          setUser(user);
          hasFetched.current = true;
          setIsLoadingUser(false);
        })
        .catch(() => {
          setIsLoadingUser(false);
        });
    }

    fetchAdminStatus(); // Call the admin status fetch on component mount
  }, [id]);

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
      <div className="w-full h-screen flex items-center justify-center overflow-hidden">
        <Spinner />
      </div>
    );
  }

  if (isAdmin === null || user === null) return null; 
  return (
    <section className="mt-24 max-w-2xl mx-auto">
      <AdminTabs />
      <div className="mt-8">
        <UserForm user={user} onSave={handleSaveUser} isAdmin={isAdmin} />
      </div>
    </section>
  );
}

export default EditUserPage;
