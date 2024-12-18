"use client";
import React, { useContext, useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";
import CartProduct from "../menu/CartProduct";
import { cartContext, cartProductPrice } from "../AppContext";
import Cart from "../icons/Cart";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Spinner from "./Spinner";
import { useProfile } from "../useProfile";
import Delivery from "../icons/Delivery";
import Pickup from "../icons/Pickup";

export default function Sidebar() {
  const { cartProducts, removeCartProduct, orderType, setOrderType } =
    useContext(cartContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [loading, setLoading] = useState(true);
  const [deliveryPrices, setDeliveryPrices] = useState([]);
  const [myDeliveryPrice, setMyDeliveryPrice] = useState(undefined);
  const [loadingDeliveryPrices, setLoadingDeliveryPrices] = useState(true);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [reachMinimumOreder, setReachMinimumOreder] = useState(false);
  let totalPrice = 0;
  let minimumOrder;

  const pathname = usePathname();
  const {
    data: profileData = null,
    loading: profileLoading,
    error: profileError,
  } = useProfile();

  for (const p of cartProducts) {
    totalPrice += cartProductPrice(p);
  }

  useEffect(() => {
    if (pathname !== "/" && pathname !== "/menu") {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
  }, [pathname]);

  useEffect(() => {
    const headerHeight = document.getElementById("header").scrollHeight;
    setIsScrolled(window.scrollY > headerHeight);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > headerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (cartProducts !== undefined) {
      setLoading(false);
    }
  }, [cartProducts]);

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
    } else {
      setLoadingDeliveryPrices(false);
    }
  }, [profileData?.city]);

  minimumOrder = deliveryPrices.find(
    (c) => c.name === profileData?.city
  )?.minimumOrder;

  useEffect(() => {
    if (
      totalPrice >=
      deliveryPrices.find((c) => c.name === profileData?.city)?.minimumOrder
    ) {
      setReachMinimumOreder(true);
    } else {
      setReachMinimumOreder(false);
    }
  }, [profileData?.city, deliveryPrices, totalPrice]);

  if (loading || loadingDeliveryPrices) {
    return (
      <aside
        id="sidebar"
        className={`sidebar ${
          showSidebar ? "translate-x-0" : "translate-x-full"
        } fixed top-0 bottom-0 right-0 h-screen w-[330px] z-10 px-6 ${
          isScrolled ? "pt-1" : "pt-20"
        } flex flex-col justify-center items-center bg-white transition-all`}
      >
        <Spinner />
      </aside>
    );
  }
  return (
    <aside
      id="sidebar"
      className={`sidebar ${
        showSidebar ? "translate-x-0" : "translate-x-full"
      } fixed top-0 bottom-0 right-0 h-screen w-[330px] z-10 px-6 ${
        isScrolled ? "pt-1" : "pt-[11rem]"
      } flex flex-col bg-white transition-all`}
    >
      <div className="text-center">
        <SectionHeader subtitle={"Warenkorb"} />
      </div>

      <div className="relative flex justify-between mt-4 bg-neutral-200 rounded-full py-2 px-4 shadow-lg">
        <div
          className={`absolute top-0 w-1/2 h-full bg-white rounded-full z-[1] transition-all duration-300 ease-in-out ${
            orderType == "delivery"
              ? "left-0"
              : "left-[100%] translate-x-[-100%]"
          } shadow-lg`}
        ></div>

        <div
          onClick={() => setOrderType("delivery")}
          className="flex items-center gap-1 cursor-pointer z-[2]"
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
          onClick={() => setOrderType("pickup")}
          className="flex items-center gap-1 cursor-pointer z-[2]"
        >
          <Pickup
            className={`${
              orderType == "pickup"
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
        <div className="relative grid md:grid-cols-1 gap-4 mt-8 overflow-auto">
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
            <div className="flex flex-col items-start">
              <div className="py-1 flex justify-end items-center">
                <div className="text-gray-500">Zwischensumme : &nbsp; </div>
                <div className="font-semibold"> {totalPrice} €</div>
              </div>
              {myDeliveryPrice !== undefined && (
                <>
                  {orderType == "delivery" && (
                    <div className="py-1 flex justify-end items-center">
                      <>
                        <div className="text-gray-500">Lieferung : &nbsp; </div>
                        <div className="font-semibold">
                          {freeDelivery ? "Kostenlos" : myDeliveryPrice + " €"}
                        </div>
                      </>
                    </div>
                  )}
                  <div className="py-1 flex justify-end items-center">
                    <div className="text-gray-500">Gesamt : &nbsp; </div>
                    {orderType == "delivery" && (
                      <div className="font-semibold">
                        {totalPrice + (freeDelivery ? 0 : myDeliveryPrice)} €
                      </div>
                    )}
                    {orderType == "pickup" && (
                      <div className="font-semibold">{totalPrice} €</div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {(reachMinimumOreder ||
            !profileData?.city ||
            orderType == "pickup") && (
            <Link href={"/cart"}>
              <button type="button" className="mt-6 sidebar_button button">
                Zur Kasse gehen
              </button>
            </Link>
          )}
          {!reachMinimumOreder &&
            profileData?.city &&
            orderType != "pickup" && (
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
        <div className="text-center grow flex flex-col items-center justify-center">
          <Cart className="text-gray-900 w-10 h-10" />
          <h3 className="text-2xl text-gray-800 font-semibold">
            Fülle deinen Warenkorb
          </h3>
          <p className="text-gray-700 text-lg"> Dein Warenkorb ist leer</p>
        </div>
      )}
    </aside>
  );
}
