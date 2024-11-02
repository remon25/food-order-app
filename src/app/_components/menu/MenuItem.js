"use client";
import { useContext, useState } from "react";
import { cartContext } from "../AppContext";
import MenuItemTile from "./MenuItemTile";
import toast from "react-hot-toast";
import Image from "next/image";
import Cart from "../icons/Cart";
import Link from "next/link";

export default function MenuItem({ menuItemInfo }) {
  const { name, description, image, price, sizes, extraIngredientPrice } =
    menuItemInfo;
  const [selectedSize, setSelectedSize] = useState(sizes?.[0] || null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const { addToCart } = useContext(cartContext);

  async function handleAddToCartButtonClick() {
    const hasOptions = sizes.length > 0 || extraIngredientPrice.length > 0;
    if (hasOptions && !showPopup) {
      setShowPopup(true);
      return;
    }
    addToCart(menuItemInfo, selectedSize, selectedExtras);
    toast.success("Added to cart successfully!");
    setShowPopup(false);
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
          className="fixed z-30 inset-0 w-full h-full bg-black/80 flex items-center justify-center"
        >
          <div
            onClick={(ev) => ev.stopPropagation()}
            className="bg-white p-8 rounded-lg flex flex-col items-center max-h-screen overflow-auto"
          >
            <Image
              alt={image}
              src={image}
              width={300}
              height={300}
              quality={50}
            />
            <h2 className="text-lg font-bold text-center mb-4">{name}</h2>
            <p className="text-gray-500 text-center text-sm mb-2">
              {description}
            </p>
            {sizes?.length > 0 && (
              <div className="p-2 w-full">
                <h3 className="mb-2 text-center text-gray-800">
                  Pick your size
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
                    {size.name} ${price + size.price}
                  </label>
                ))}
              </div>
            )}

            {extraIngredientPrice?.length > 0 && (
              <div className="p-2 w-full">
                <h3 className="mb-2 text-center text-gray-800">
                  Optional Extras
                </h3>
                {extraIngredientPrice.map((extraIngredient) => (
                  <label
                    key={extraIngredient.name}
                    className="flex items-center gap-1 p-4 border rounded-md mb-1"
                  >
                    <input
                      type="checkbox"
                      checked={selectedExtras.map(e => e._id).includes(extraIngredient._id)}
                      name={extraIngredient.name}
                      onChange={(ev) => handleExtrasClick(ev, extraIngredient)}
                    />
                    {extraIngredient.name} ${extraIngredient.price}
                  </label>
                ))}
              </div>
            )}
            <div className="w-full flex justify-center font-semibold bg-primary text-white text-sm rounded-xl px-6 py-2">
                <button type="button" onClick={handleAddToCartButtonClick}>
                  Add to cart ${selectedPrice}
                </button>
            </div>

            <button
              onClick={() => setShowPopup(false)}
              type="button"
              className="button mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* <MenuItemTile
        menuItemInfo={menuItemInfo}
        handleAddToCartButtonClick={handleAddToCartButtonClick}
      /> */}

<div className='w-full h-full bg-[#f1f2f3] flex flex-col justify-center items-center rounded-3xl rounded-br-none'>
      <div className='relative w-full h-full flex justify-center items-center bg-primary rounded-bl-[100px] rounded-br-none rounded-3xl'>
        <Link href={`/product/`}>
          <div className='relative w-64 h-64 hover:scale-110 transition-all'>
            <Image
              src={image}
              alt={name}
              quality={50}
              layout='fill'
              objectFit='contain'
              priority
            />
          </div>
        </Link>
      </div>
      <div className='w-full m-4 py-4 px-6 min-h-[170px]'>
        <span className='font-bold '>{name}</span>
        <span className='block text-gray-500 text-sm pt-3 min-h-[80px]'>
          {description}
        </span>
        <div className='flex justify-between items-center mt-3'>
          <span>${price}</span>
          <button
            className='btn-primary w-10 h-10 rounded-full !p-0 grid place-content-center'
            onClick={handleAddToCartButtonClick}
          >
            <Cart className="w-10 h-10 bg-primary text-white p-2 rounded-full" />
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
