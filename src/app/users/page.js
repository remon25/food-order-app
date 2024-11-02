"use client";
import { useEffect, useState } from "react";
import UserTabs from "../_components/layout/UserTabs";
import { useProfile } from "../_components/useProfile";
import Image from "next/image";
import Link from "next/link";

export default function UsersPage() {
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
      <h1 className="mt-24 text-center text-primary text-4xl font-bold mb-6">
        Loading...
      </h1>
    );
  }
  if (isAdmin === null) return null;

  return (
    <section className="mt-24 max-w-2xl mx-auto">
      <UserTabs admin={isAdmin} />
      <div className="mt-8">
        {users.length > 0 &&
          users.map((user) => (
            <div
              key={user._id}
              className="user_row"
            >
              <div>
                <Image
                  src={user?.image || "/avatar.png"}
                  alt={user?.name || "Anonymous"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div>
                <span>{user.name || "Anonymous"}</span>
              </div>
              <div className="mb-2 md:mb-0">
                <span>{user?.email}</span>
              </div>
              <div>
                <Link
                  href={`/users/${user._id}`}
                  className="button"
                  type="button"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
