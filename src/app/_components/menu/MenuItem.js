"use client";
import { useContext, useState } from "react";
import { cartContext } from "../AppContext";
import toast from "react-hot-toast";
import Image from "next/image";
import Cart from "../icons/Cart";

export default function MenuItem({ menuItemInfo, isOffersCategory }) {
  const { name, description, image, price, sizes, extraIngredientPrice } =
    menuItemInfo;
  const [selectedSize, setSelectedSize] = useState(sizes?.[0] || null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const { addToCart } = useContext(cartContext);

  function handlePopupToggle() {
    if (!showPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    setShowPopup((prev) => !prev);
  }

  function handleCancel() {
    setShowPopup(false);
    document.body.style.overflow = "auto";
  }

  async function handleAddToCartButtonClick() {
    const hasOptions = sizes.length > 0 || extraIngredientPrice.length > 0;
    if (hasOptions && !showPopup) {
      setShowPopup(true);
      return;
    }
    addToCart(menuItemInfo, selectedSize, selectedExtras);
    await new Promise((resolve) => setTimeout(resolve, 100));
    setShowPopup(false);
    toast.success(`Added ${name} to cart`);
  }

  function handleExtrasClick(ev, extraThing) {
    const checked = ev.target.checked;
    if (checked) {
      setSelectedExtras((prev) => [...prev, extraThing]);
    } else {
      setSelectedExtras((prev) => {
        return prev.filter((e) => e.name !== extraThing.name);
      });
    }
  }

  let selectedPrice = price;

  if (selectedSize) {
    selectedPrice += selectedSize.price;
  }
  if (selectedExtras?.length > 0) {
    for (const extra of selectedExtras) {
      selectedPrice += extra.price;
    }
  }

  return (
    <>
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed z-30 top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center"
        >
          <div
            onClick={(ev) => ev.stopPropagation()}
            className="bg-white p-8 rounded-lg flex flex-col items-center overflow-auto -webkit-overflow-scrolling: touch;"
            style={{ maxHeight: "80vh" }}
          >
            <Image
              alt={image}
              src={image || "/default-menu.png"}
              width={200}
              height={200}
              quality={50}
            />
            <h2 className="text-lg font-bold text-center mb-4">{name}</h2>
            <p className="text-gray-500 text-center text-sm mb-2">
              {description}
            </p>
            {sizes?.length > 0 && (
              <div className="p-2 w-full">
                <h3 className="mb-2 text-center text-gray-800">
                  Wählen Sie Ihre Größe
                </h3>
                {sizes.map((size) => (
                  <label
                    key={size.name}
                    className="flex items-center gap-1 p-4 border rounded-md mb-1"
                  >
                    <input
                      type="radio"
                      onChange={() => setSelectedSize(size)}
                      checked={selectedSize?.name === size.name}
                      name="size"
                    />
                    {size.name} {price + size.price}&euro;
                  </label>
                ))}
              </div>
            )}

            {extraIngredientPrice?.length > 0 && (
              <div className="p-2 w-full">
                <h3 className="mb-2 text-center text-gray-800">
                  Optionale Extras
                </h3>
                {extraIngredientPrice.map((extraIngredient) => (
                  <label
                    key={extraIngredient.name}
                    className="flex items-center gap-1 p-4 border rounded-md mb-1"
                  >
                    <input
                      type="checkbox"
                      checked={selectedExtras
                        .map((e) => e._id)
                        .includes(extraIngredient._id)}
                      name={extraIngredient.name}
                      onChange={(ev) => handleExtrasClick(ev, extraIngredient)}
                    />
                    {extraIngredient.name} {extraIngredient.price}&euro;
                  </label>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={handleAddToCartButtonClick}
              className="w-full flex justify-center font-semibold bg-primary text-white text-sm rounded-xl px-6 py-2"
            >
              In den Warenkorb legen {selectedPrice}&euro;
            </button>

            <button
              onClick={handleCancel}
              type="button"
              className="button mt-2"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {!isOffersCategory ? (
        <div
          onClick={handleAddToCartButtonClick}
          className={`menu-item-container w-full h-full cursor-pointer bg-[#ffff] border flex flex-row-reverse justify-center items-center rounded-3xl rounded-br-none hover:bg-[#f5f5f5] transition-all`}
        >
          <div className="menu-item-image flex-[1] relative w-full h-full flex justify-center items-center bg-accent rounded-bl-[100px] rounded-br-none rounded-3xl overflow-hidden">
            <div className="image-holder relative w-[120px] h-[120px] hover:scale-110 transition-all">
              <Image
                src={image || "/default-menu.png"}
                alt={name}
                quality={50}
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>
          </div>
          <div
            className={`"w-full flex-[2] m-4 px-6" ${
              isOffersCategory && "hidden"
            }`}
          >
            <h2 className="text-[16px] md:text-[18px] text-slate-900 font-bold ">
              {name}
            </h2>
            <span className="block text-[#242e30] text-[13px] md:text-[16px] pt-3">
              {description}
            </span>
            <div className="flex justify-between items-center mt-3">
              <span className="text-[16px] text-slate-900 font-bold">
                {price} &euro;
              </span>
              <button className="btn-primary bg-primary w-10 h-10 rounded-full !p-0 grid place-content-center">
                <Cart className="w-[38px] h-[30px] fill-white p-1 rounded-full" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div onClick={handleAddToCartButtonClick}>
          <div className="image-holder transition-all cursor-pointer">
            <Image
              src={image || "/default-menu.png"}
              alt={name}
              quality={50}
              width={400}
              height={220}
              className="rounded-[10px]"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
