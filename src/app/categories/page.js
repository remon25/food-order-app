"use client";
import toast from "react-hot-toast";
import { useProfile } from "../_components/useProfile";
import { useEffect, useState } from "react";
import DeleteButton from "../_components/DeleteButton";
import withAdminAuth from "../_components/withAdminAuth";
import AdminTabs from "../_components/layout/AdminTabs";

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
          reject("Failed to update/create category");
        }
      } catch (error) {
        reject(error);
      }
    });

    await toast.promise(creatingPromise, {
      loading: editCategory ? "Updating category..." : "Creating category...",
      success: editCategory
        ? "Category updated successfully"
        : "Category created successfully",
      error: editCategory
        ? "Could not update category"
        : "Could not create category",
    });
  }

  async function handleCategoryDelete(_id) {
    try {
      await toast.promise(
        fetch("/api/categories/?_id=" + _id, {
          method: "DELETE",
        }),
        {
          loading: "Deleting category...",
          success: "Category deleted successfully!",
          error: "Error deleting category!",
        }
      );
    } catch (error) {
      console.error("Error deleting category:", error);
    }
    fetchCategories();
  }

  if (loading || status === "loading") {
    return (
      <h1 className="mt-24 text-center text-primary text-4xl font-bold mb-6">
        Loading...
      </h1>
    );
  }

  if (isAdmin === null) return null; // Return nothing if isAdmin is not set yet

  return (
    <section className="mt-24 max-w-lg mx-auto">
      <AdminTabs/>
      <form className="mt-8" onSubmit={handleCategorySubmit}>
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <div className="grow md:pb-4">
            <label htmlFor="categoryName">
              {editCategory ? "Edit category" : "New category"}
              {editCategory ? `: ${editCategory.name}` : ""}
            </label>
            <input
              type="text"
              id="categoryName"
              name="categoryName"
              placeholder="Category name"
              value={CategoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <div className="pb-2 flex gap-2">
            <button className="button rounded-xl p-2" type="submit">
              {!editCategory ? "Create" : "Update"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditCategory(null);
                setCategoryName("");
              }}
              className="button rounded-xl p-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
      <div>
        <h2 className="mt-8 text-sm text-gray-500">Existing categories:</h2>
        {categories &&
          categories.map((category) => (
            <div
              key={category._id}
              className="w-full flex items-center gap-1 bg-gray-100 rounded-xl py-2 px-4 mt-1 mb-2"
            >
              <div className="grow">{category.name}</div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditCategory(category);
                    setCategoryName(category.name);
                  }}
                  className="button"
                  type="button"
                >
                  Edit
                </button>
                <DeleteButton
                  label="Delete"
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
