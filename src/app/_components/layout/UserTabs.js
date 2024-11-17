"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UserTabs() {
  const path = usePathname();
  return (
    <div className="flex gap-2 tabs justify-center flex-wrap mx-auto mb-6">
      <>
        <Link className={path === "/profile" ? "active" : ""} href="/profile">
          Profil
        </Link>
        <Link className={path === "/orders" ? "active" : ""} href="/orders">
          Bestellungen
        </Link>
      </>
    </div>
  );
}
