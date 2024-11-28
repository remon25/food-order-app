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
import Pickin from "../icons/Pickin";
import Delivery from "../icons/Delivery";

export default function MobileSidebar() {
  const { cartProducts, removeCartProduct, orderType, setOrderType } =
    useContext(cartContext);
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

          <div className="relative flex justify-between mt-4 bg-neutral-200 rounded-full py-2 px-4 shadow-lg">
            <div
              className={`absolute top-0 w-1/2 h-full bg-white rounded-full z-[1] transition-all duration-300 ease-in-out ${
                orderType == "delivery"
                  ? "left-0"
                  : "left-[100%] translate-x-[-100%]"
              } shadow-lg text-center`}
            ></div>

            <div
              onClick={() => setOrderType("delivery")}
              className="w-full flex items-center justify-center gap-1 cursor-pointer z-[2]"
            >
              <Delivery
                className={`${
                  orderType == "delivery"
                    ? "w-6 h-6 stroke-primary"
                    : "w-6 h-6 stroke-black"
                } transition-all duration-300 ease-in-out`}
              />
              <div className="tex-center flex flex-col items-center">
                <div className={`font-semibold`}>Lieferung</div>
                <div className="text-gray-500 text-xs">25-50 min</div>
              </div>
            </div>

            <div
              onClick={() => setOrderType("pickin")}
              className="w-full flex items-center justify-center gap-1 cursor-pointer z-[2]"
            >
              <Pickin
                className={`${
                  orderType == "pickin"
                    ? "w-6 h-6 fill-primary"
                    : "w-6 h-6 fill-black"
                } transition-all duration-300 ease-in-out`}
              />
              <div className="tex-center flex flex-col items-center">
                <div className={`font-semibold`}>Abholung</div>
                <div className="text-gray-500 text-xs">15 min</div>
              </div>
            </div>
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
                    {orderType == "delivery" && (
                      <div className="py-1 flex justify-end items-center">
                        <>
                          <div className="text-gray-500">
                            Lieferung : &nbsp;{" "}
                          </div>
                          <div className="font-semibold">
                            {freeDelivery
                              ? "Kostenlos"
                              : myDeliveryPrice + " €"}
                          </div>
                        </>
                      </div>
                    )}
                    <div className="py-1 flex justify-end items-center">
                      <div className="text-gray-500">Gesamt : &nbsp;</div>
                      {orderType == "delivery" && (
                        <div className="font-semibold">
                          {totalPrice + (freeDelivery ? 0 : myDeliveryPrice)} €
                        </div>
                      )}
                      {orderType == "pickin" && (
                        <div className="font-semibold">{totalPrice} €</div>
                      )}
                    </div>
                  </>
                )}
              </div>
              {(reachMinimumOreder ||
                !profileData?.city ||
                orderType == "pickin") && (
                <Link href={"/cart"}>
                  <button type="button" className="mt-6 sidebar_button button">
                    Zur Kasse gehen
                  </button>
                </Link>
              )}
              {!reachMinimumOreder &&
                profileData?.city &&
                orderType != "pickin" && (
                  <>
                    <button
                      type="button"
                      className="mt-6 sidebar_button button opacity-50 cursor-not-allowed"
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
