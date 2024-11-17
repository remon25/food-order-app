"use client";
import { useEffect, useState } from "react";
import { useProfile } from "../_components/useProfile";
import Image from "next/image";
import Link from "next/link";
import withAdminAuth from "../_components/withAdminAuth";
import AdminTabs from "../_components/layout/AdminTabs";
import Spinner from "../_components/layout/Spinner";

function UsersPage() {
  const { loading, status, isAdmin } = useProfile();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users").then((response) =>
      response.json().then((users) => {
        setUsers(users);
      })
    );
  }, []);

  if (loading || status === "loading") {
    return (
      <div className="w-full h-screen flex items-center justify-center overflow-hidden">
        <Spinner />
      </div>
    );
  }
  if (isAdmin === null) return null;

  return (
    <section className="mt-24 max-w-2xl mx-auto">
      <AdminTabs />
      <div className="mt-8 p-4">
        {users.length > 0 &&
          users.map((user) => (
            <div
              key={user._id}
              className="user_row flex items-center gap-4 p-2 border-b"
            >
              <div className="relative">
                <Image
                  src={user?.image || "/avatar.png"}
                  alt={user?.name || "Anonymous"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                {user?.verified && (
                  <Image
                    className="absolute top-[67%] right-0"
                    src="/verification-badge.svg"
                    alt="verified"
                    width={20}
                    height={20}
                  />
                )}
              </div>
              <div className="flex-1">
                <span className="font-medium">{user.name || "Anonymous"}</span>
              </div>
              <div className="flex-1">
                <span>{user?.email}</span>
              </div>
              <div>
                <Link
                  href={`/users/${user._id}`}
                  className="button px-4 py-2 rounded"
                >
                  Bearbeiten
                </Link>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}

export default withAdminAuth(UsersPage);
