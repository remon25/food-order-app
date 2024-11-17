import MenuItemPriceProps from "../layout/MenuItemPriceProps";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function MenuItemForm({ handleFormSubmit, menuItem }) {
  const [image, setImage] = useState(menuItem?.image || null);
  const [name, setName] = useState(menuItem?.name || "");
  const [price, setPrice] = useState(menuItem?.price || "");
  const [description, setDescription] = useState(menuItem?.description || "");
  const [sizes, setSizes] = useState(menuItem?.sizes || []);
  const [category, setCategory] = useState(menuItem?.category || "");
  const [extraIngredientPrice, setExtraIngredientPrice] = useState(
    menuItem?.extraIngredientPrice || []
  );

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    if (menuItem) {
      setImage(menuItem.image || null);
      setName(menuItem.name || "");
      setPrice(menuItem.price || "");
      setDescription(menuItem.description || "");
    }
  }, [menuItem]);

  useEffect(() => {
    fetch("/api/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        if (!category && data.length > 0) {
          setCategory(data[0]._id);
        }
      });
  }, [category]);

  return (
    <form
      className="mt-8 p-4"
      onSubmit={(e) =>
        handleFormSubmit(e, {
          image,
          name,
          price,
          description,
          category,
          sizes,
          extraIngredientPrice,
        })
      }
    >
      <div className="flex flex-col md:flex-row gap-2 items-center md:items-start">
        <div className="w-full flex items-start gap-2 md:w-auto justify-center">
          <div className="p-2 rounded-lg flex flex-col items-center">
            <Image
              className="rounded-lg"
              src={image || "/default-menu.png"}
              alt="menu item"
              width={120}
              height={120}
            />
            <CldUploadWidget
              options={{
                sources: ["local"],
                maxFiles: 1,
                resourceType: "image",
              }}
              onSuccess={(results) => setImage(results?.info?.secure_url)}
              signatureEndpoint="/api/upload"
            >
              {({ open }) => (
                <button
                  type="button"
                  className="block border border-gray-300 mt-2 cursor-pointer rounded-lg p-2 text-[0.7rem] text-center"
                  onClick={() => open()}
                >
                  Lade ein Bild hoch
                </button>
              )}
            </CldUploadWidget>
          </div>
        </div>
        <div className="grow pb-4 w-full md:w-auto">
          <label htmlFor="menuItemName">Artikelname</label>
          <input
            id="menuItemName"
            type="text"
            placeholder="Name des Menüartikels"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="description">Artikelbeschreibung</label>
          <input
            id="description"
            type="text"
            placeholder="Beschreibung"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label htmlFor="category">Kategorie</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
          <label htmlFor="price">Grundpreis</label>
          <input
            id="price"
            type="number"
            placeholder="Preis"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <MenuItemPriceProps
            addLabel={"Größe des Artikels hinzufügen"}
            name={"Größen"}
            props={sizes}
            setProps={setSizes}
          />
          <MenuItemPriceProps
            addLabel={"Zusätzliche Zutat hinzufügen"}
            name={"Zusätzliche Zutat"}
            props={extraIngredientPrice}
            setProps={setExtraIngredientPrice}
          />

          <button className="rounded-xl p-2" type="submit">
            Speichern
          </button>
        </div>
      </div>
    </form>
  );
}
