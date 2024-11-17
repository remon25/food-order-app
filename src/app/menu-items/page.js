"use client";
import { useProfile } from "../_components/useProfile";
import Link from "next/link";
import Right from "../_components/icons/Right";
import { useEffect, useState } from "react";
import Image from "next/image";
import withAdminAuth from "../_components/withAdminAuth";
import AdminTabs from "../_components/layout/AdminTabs";
import Spinner from "../_components/layout/Spinner";

function MenuItemPage() {
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
        <Link
          className="button flex items-center justify-center gap-2"
          href="/menu-items/new"
        >
          Add new
          <Right />
        </Link>
      </div>
      <div className="p-4">
        <h2 className="text-sm text-gray-500 mt-8">Edit menu item:</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 md:justify-center gap-6 mt-10 mb-12 px-5">
          {menuItems?.length > 0 &&
            menuItems.map((item, index) => (
              <Link
                key={`${item._id}-${index}`}
                href={"/menu-items/edit/" + item._id}
                className="flex flex-col justify-center items-center bg-gray-200 rounded-lg p-4"
              >
                <div className="relative flex justify-center">
                  <Image
                    className="rounded-md"
                    src={item?.image || "/default-menu.png"}
                    alt={"menu-item-image"}
                    width={200}
                    height={200}
                  />
                </div>
                <div className="text-center">{item?.name}</div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}

export default withAdminAuth(MenuItemPage);
