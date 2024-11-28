"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminTabs() {
  const path = usePathname();
  return (
    <div className="flex gap-2 tabs justify-center flex-wrap mx-auto mb-6">
      <>
        <Link className={path === "/profile" ? "active" : ""} href="/profile">
          Profil
        </Link>
        <Link
          className={path === "/categories" ? "active" : ""}
          href="/categories"
        >
          Kategorien
        </Link>
        <Link
          className={path.includes("/menu-items") ? "active" : ""}
          href="/menu-items"
        >
          Menüartikel
        </Link>
        <Link className={path.includes("/users") ? "active" : ""} href="/users">
          Benutzer
        </Link>
        <Link className={path === "/orders" ? "active" : ""} href="/orders">
          Bestellungen
        </Link>
        <Link className={path === "/delivery" ? "active" : ""} href="/delivery">
          Lieferung
        </Link>
        <Link className={path === "/times" ? "active" : ""} href="/times">
          Öffnungszeiten
        </Link>
      </>
    </div>
  );
}
