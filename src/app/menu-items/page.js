"use client";
import { useProfile } from "../_components/useProfile";
import UserTabs from "../_components/layout/UserTabs";
import Link from "next/link";
import Right from "../_components/icons/Right";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function MenuItemPage() {
  const { loading, status, isAdmin } = useProfile();
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (status === "unauthenticated") {
        window.location.href = "/login";
        return;
      }
  
      try {
        const response = await fetch("/api/menu-items");
        if (!response.ok) {
          throw new Error("Failed to fetch menu items");
        }
  
        const data = await response.json(); 
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
  
    fetchMenuItems();
  
    return () => {
      setMenuItems([]); 
    };
  }, [status]);
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
        <Link
          className="button flex items-center justify-center gap-2"
          href="/menu-items/new"
        >
          Add new
          <Right />
        </Link>
      </div>
      <div>
        <h2 className="text-sm text-gray-500 mt-8">Edit menu item:</h2>
        <div className="grid grid-cols-3 gap-2">
          {menuItems?.length > 0 && menuItems.map(item => (
            <Link
              key={item._id}
              href={'/menu-items/edit/'+item._id}
              className="bg-gray-200 rounded-lg p-4"
            >
              <div className="relative">
                <Image
                  className="rounded-md"
                  src={item?.image || '/default-menu.png'} alt={'menu-item-image'} width={200} height={200} />
              </div>
              <div className="text-center">
                {item?.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
