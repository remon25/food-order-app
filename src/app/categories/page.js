"use client";
import toast from "react-hot-toast";
import { useProfile } from "../_components/useProfile";
import { useEffect, useState } from "react";
import DeleteButton from "../_components/DeleteButton";
import withAdminAuth from "../_components/withAdminAuth";
import AdminTabs from "../_components/layout/AdminTabs";
import Spinner from "../_components/layout/Spinner";

function CategoriesPage() {
  const { isAdmin, loading, status } = useProfile();
  const [CategoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    fetch("/api/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      });
  }
  async function handleCategorySubmit(e) {
    e.preventDefault();
    const creatingPromise = new Promise(async (resolve, reject) => {
      const data = {
        name: CategoryName,
      };
      if (editCategory) {
        data._id = editCategory._id;
      }
      try {
        const response = await fetch("/api/categories", {
          method: editCategory ? "PUT" : "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          setCategoryName("");
          setEditCategory(null);
          fetchCategories();
          resolve();
        } else {
          reject("Fehler beim Aktualisieren/Erstellen der Kategorie");
        }
      } catch (error) {
        reject(error);
      }
    });

    await toast.promise(creatingPromise, {
      loading: editCategory ? "Kategorie wird aktualisiert..." : "Kategorie wird erstellt...",
      success: editCategory
        ? "Kategorie erfolgreich aktualisiert"
        : "Kategorie erfolgreich erstellt",
      error: editCategory
        ? "Kategorie konnte nicht aktualisiert werden"
        : "Kategorie konnte nicht erstellt werden",
    });
  }

  async function handleCategoryDelete(_id) {
    try {
      await toast.promise(
        fetch("/api/categories/?_id=" + _id, {
          method: "DELETE",
        }),
        {
          loading: "Kategorie wird gelöscht...",
          success: "Kategorie erfolgreich gelöscht!",
          error: "Fehler beim Löschen der Kategorie!",
        }
      );
    } catch (error) {
      console.error("Fehler beim Löschen der Kategorie:", error);
    }
    fetchCategories();
  }

  if (loading || status === "loading") {
    return (
      <div className="w-full h-screen flex items-center justify-center overflow-hidden">
        <Spinner />
      </div>
    );
  }

  if (isAdmin === null) return null; // Return nothing if isAdmin is not set yet

  return (
    <section className="mt-24 max-w-2xl mx-auto">
      <AdminTabs/>
      <form className="mt-8" onSubmit={handleCategorySubmit}>
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <div className="grow md:pb-4">
            <label htmlFor="categoryName">
              {editCategory ? "Kategorie bearbeiten" : "Neue Kategorie"}
              {editCategory ? `: ${editCategory.name}` : ""}
            </label>
            <input
              type="text"
              id="categoryName"
              name="categoryName"
              placeholder="Kategoriename"
              value={CategoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <div className="pb-2 flex gap-2">
            <button className="button rounded-xl p-2" type="submit">
              {!editCategory ? "Erstellen" : "Aktualisieren"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditCategory(null);
                setCategoryName("");
              }}
              className="button rounded-xl p-2"
            >
              Abbrechen
            </button>
          </div>
        </div>
      </form>
      <div className="p-4">
        <h2 className="mt-8 text-sm text-gray-500">Bestehende Kategorien:</h2>
        {categories &&
          categories.map((category) => (
            <div
              key={category._id}
              className="w-full flex flex-col items-center sm:flex-row    gap-1 bg-gray-100 rounded-xl py-2 px-4 mt-1 mb-2"
            >
              <div className="grow font-semibold">{category.name}</div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditCategory(category);
                    setCategoryName(category.name);
                  }}
                  className="button"
                  type="button"
                >
                  Bearbeiten
                </button>
                <DeleteButton
                  label="Löschen"
                  onDelete={() => handleCategoryDelete(category._id)}
                />
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}

export default withAdminAuth(CategoriesPage);
