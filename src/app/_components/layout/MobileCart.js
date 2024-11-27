"use client";
import React, { useContext, useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";
import CartProduct from "../menu/CartProduct";
import { cartContext, cartProductPrice } from "../AppContext";
import Cart from "../icons/Cart";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Xmark from "../icons/Xmark";
import ShoppingCart from "../icons/Cart";
import { useProfile } from "../useProfile";

export default function MobileSidebar() {
  const { cartProducts, removeCartProduct } = useContext(cartContext);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showCartButton, setShowCartButton] = useState(true);
  const [deliveryPrices, setDeliveryPrices] = useState([]);
  const [myDeliveryPrice, setMyDeliveryPrice] = useState(undefined);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [loadingDeliveryPrices, setLoadingDeliveryPrices] = useState(true);
  const [reachMinimumOreder, setReachMinimumOreder] = useState(false);
  const [minimumOrder, setMinimumOrder] = useState(undefined);


  let totalPrice = 0;

  const pathname = usePathname();
  const { data: profileData, loading: profileLoading } = useProfile();
  for (const p of cartProducts) {
    totalPrice += cartProductPrice(p);
  }

  useEffect(() => {
    if (showCartButton && cartProducts.length > 0) {
      document.getElementById("footer").classList.add("mobile");
    } else {
      document.getElementById("footer").classList.remove("mobile");
    }
  }, [showCartButton, cartProducts?.length]);

  useEffect(() => {
    if (showMobileSidebar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showMobileSidebar]);

  useEffect(() => {
    if (pathname === "/" || pathname === "/menu") {
      setShowCartButton(true);
    } else {
      setShowMobileSidebar(false);
      setShowCartButton(false);
    }
  }, [pathname]);

  useEffect(() => {
    const fetchDeliveryPrices = async () => {
      try {
        const response = await fetch("/api/delivery-prices");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();

        const prices = {};
        data.forEach((price) => (prices[price.name] = price.price));
        setDeliveryPrices(data);

        if (profileData?.city) {
          const deliveryPrice = prices[profileData.city];
          const isFree = data.find(
            (price) => price.name === profileData.city
          )?.isFreeDelivery;

          setMyDeliveryPrice(deliveryPrice);
          setFreeDelivery(isFree || false);
        }
      } catch (error) {
        console.error("Error fetching delivery prices", error);
      } finally {
        setLoadingDeliveryPrices(false);
      }
    };

    if (profileData?.city) {
      fetchDeliveryPrices();
    }
  }, [profileData?.city]);

  useEffect(() => {
    const cityData = deliveryPrices.find((c) => c.name === profileData?.city);
    setMinimumOrder(cityData?.minimumOrder);
  }, [deliveryPrices, profileData?.city]);
  
  useEffect(() => {
    if (totalPrice >= minimumOrder) {
      setReachMinimumOreder(true);
    } else {
      setReachMinimumOreder(false);
    }
  }, [minimumOrder, totalPrice]);

  return (
    <div className="mobile-sidebar hidden">
      {!showMobileSidebar && showCartButton && cartProducts.length > 0 && (
        <div className="mobile-cart-button hidden fixed bottom-0 right-0 left-0 w-full z-[999] bg-white p-4">
          <button
            onClick={() => setShowMobileSidebar(true)}
            type="button"
            className="button sidebar_button flex justify-center gap-2 !p-3"
          >
            <Link href={"/cart"} className="relative">
              <ShoppingCart />
              {cartProducts?.length > 0 && (
                <span className="absolute w-[20px] h-[20px] -top-2 right-[1rem] bg-black text-white text-xs py-1 px-1 rounded-[50%] leading-3">
                  {cartProducts.length}
                </span>
              )}
            </Link>
            <span className="text-lg">Zur Kasse ({totalPrice} &euro;)</span>
          </button>
        </div>
      )}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-[999] min-h-full overflow-y-auto overflow-x-hidden transition bg-white p-4">
          <button
            onClick={() => setShowMobileSidebar(false)}
            className="absolute top-2 right-2 cursor-pointer"
          >
            <Xmark className="w-8 h-8" />
          </button>
          <div className="text-center">
            <SectionHeader subtitle={"Warenkorb"} />
          </div>

          {cartProducts?.length !== 0 ? (
            <div className="grid md:grid-cols-1 gap-4 mt-8 overflow-auto pb-[84px]">
              <div>
                {cartProducts?.length > 0 &&
                  cartProducts.map((product, index) => (
                    <CartProduct
                      key={`${product._id}-${index}`}
                      product={product}
                      onRemove={removeCartProduct}
                      index={index}
                    />
                  ))}
                <div className="py-1 flex justify-end items-center">
                  <div className="text-gray-500">Zwischensumme : &nbsp;</div>
                  <div className="font-semibold">{totalPrice} &euro;</div>
                </div>
                {myDeliveryPrice !== undefined && (
                  <>
                    <div className="py-1 flex justify-end items-center">
                      <div className="text-gray-500">Lieferung : &nbsp;</div>
                      <div className="font-semibold">
                        {freeDelivery ? "Kostenlos" : `${myDeliveryPrice} €`}
                      </div>
                    </div>
                    <div className="py-1 flex justify-end items-center">
                      <div className="text-gray-500">Gesamt : &nbsp;</div>
                      <div className="font-semibold">
                        {totalPrice + (freeDelivery ? 0 : myDeliveryPrice)} €
                      </div>
                    </div>
                  </>
                )}
              </div>
              {(reachMinimumOreder || !profileData?.city) && (
                <Link href={"/cart"}>
                  <button
                    type="button"
                    className="button sidebar_button flex justify-center gap-2 !p-3"
                  >
                    Zur Kasse gehen
                  </button>
                </Link>
              )}
              {!reachMinimumOreder && profileData?.city && (
                <>
                  <button
                    type="button"
                    className="button sidebar_button flex justify-center gap-2 !p-3 cursor-not-allowed"
                    disabled
                  >
                    Zur Kasse gehen
                  </button>
                  <p className="text-center text-sm text-gray-800 bg-orange-100 rounded-[5px] p-2 mt-4">
                    Mindestbestellwert für Ihre Stadt beträgt <br />
                    <span className="font-semibold">{minimumOrder} €</span>
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="text-center grow flex flex-col items-center justify-center mt-[30%]">
              <Cart className="text-gray-900 w-10 h-10" />
              <h3 className="text-3xl text-gray-800 font-semibold">
                Fülle deinen Warenkorb
              </h3>
              <p className="text-gray-700 text-lg"> Dein Warenkorb ist leer</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
