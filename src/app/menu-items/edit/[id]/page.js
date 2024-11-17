"use client";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import MenutItemForm from "../../../_components/layout/MenuItemForm";
import { useProfile } from "../../../_components/useProfile";
import { useEffect, useState } from "react";
import DeleteButton from "../../../_components/DeleteButton";
import toast from "react-hot-toast";
import Link from "next/link";
import Left from "../../../_components/icons/Left";
import withAdminAuth from "@/app/_components/withAdminAuth";
import AdminTabs from "@/app/_components/layout/AdminTabs";
import Spinner from "@/app/_components/layout/Spinner";

function MenuItemPage() {
  const params = useParams();
  const { isAdmin, loading: profileLoading, status } = useProfile();
  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true); // Set loading state to true when fetching starts
    fetch(`/api/menu-items/`)
      .then((response) => response.json())
      .then((items) => {
        const item = items.find((i) => i._id === params.id);
        if (item) {
          setMenuItem(item);
        }
        setLoading(false); // Set loading to false after fetching is done
      })
      .catch(() => setLoading(false)); // Ensure loading state is updated even if an error occurs
  }, [params.id]);

  async function handleFormSubmit(e, data) {
    e.preventDefault();
    data = { ...data, _id: params.id };
    try {
      await toast.promise(
        fetch("/api/menu-items", {
          method: "PUT",
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
          loading: "Speichern...",
          success: "Gespeichert!",
          error: "Speichern fehlgeschlagen!",
        }
      );
    } catch (error) {
      console.error("Error saving menu item:", error);
    }
  }

  async function handleDelete(_id) {
    try {
      await toast.promise(
        fetch("/api/menu-items/?_id=" + _id, {
          method: "DELETE",
        }),
        {
          loading: "Menüpunkt wird gelöscht...",
          success: "Menüpunkt erfolgreich gelöscht!",
          error: "Fehler beim Löschen des Menüpunkts!",
        }
      );

      router.push("/menu-items");
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  }

  if (profileLoading || status === "loading" || loading) {
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
      <div className="max-w-md mx-auto mt-8 p-4">
        <Link
          href={"/menu-items"}
          className="button w-full flex justify-center gap-2"
        >
          <Left />
          <span>
            <span>Alle Menüeinträge anzeigen</span>
          </span>
        </Link>
      </div>
      {menuItem ? (
        <MenutItemForm
          handleFormSubmit={handleFormSubmit}
          menuItem={menuItem}
        />
      ) : (
        <p>Kein Menüeintrag gefunden</p>
      )}
      <div className="md:max-w-2xl mx-auto px-4">
        <div className="md:max-w-[31rem] ml-auto">
          <DeleteButton
            label="Löschen"
            onDelete={() => handleDelete(menuItem._id)}
          />
        </div>
      </div>
    </section>
  );
}

export default withAdminAuth(MenuItemPage);
