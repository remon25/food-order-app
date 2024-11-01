"use client";
import Image from "next/image";
import UserTabs from "../../_components/layout/UserTabs";
import { useProfile } from "../../_components/useProfile";
import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import Left from "../../_components/icons/Left";
import MenuItemForm from "../../_components/layout/MenuItemForm";

export default function NewMenuItemsPage() {
  const { isAdmin, loading, status } = useProfile();
  async function handleFormSubmit(e, data) {
    e.preventDefault();

    try {
      await toast.promise(
        fetch("/api/menu-items", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Failed to save");
          }
        }),
        {
          loading: "Saving...",
          success: "Saved!",
          error: "Failed to save!",
        }
      );
      setImage(null);
      setName("");
      setPrice("");
      setDescription("");
    } catch (error) {
      console.error("Error saving menu item:", error);
    }
  }

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
      <div className="max-w-md mx-auto mt-8">
        <Link
          href={"/menu-items"}
          className="button w-full  flex justify-center gap-2"
        >
          <Left />
          <span>Show all menu items</span>
        </Link>
      </div>
      <MenuItemForm menuItem={null} handleFormSubmit={handleFormSubmit} />
    </section>
  );
}
