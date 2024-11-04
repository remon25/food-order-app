"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminTabs() {
  const path = usePathname();
  return (
    <div className="flex gap-2 tabs justify-center flex-wrap mx-auto mb-6">
      <>
        <Link className={path === "/profile" ? "active" : ""} href="/profile">
          Profile
        </Link>
        <Link
          className={path === "/categories" ? "active" : ""}
          href="/categories"
        >
          Categories
        </Link>
        <Link
          className={path.includes("/menu-items") ? "active" : ""}
          href="/menu-items"
        >
          Menu Items
        </Link>
        <Link className={path.includes("/users") ? "active" : ""} href="/users">
          Users
        </Link>
        <Link className={path === "/orders" ? "active" : ""} href="/orders">
          Orders
        </Link>
      </>
    </div>
  );
}
