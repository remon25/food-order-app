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
            <div key={user._id} className="user_row">
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

export default withAdminAuth(UsersPage);
