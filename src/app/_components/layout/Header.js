"use client";
import { useState, useEffect, useContext } from "react";
import { cartContext } from "../AppContext";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Bars2 from "../icons/Bars2";

function AuthLinks({ status, userName, image, mobile = false }) {
  if (status === "authenticated") {
    return (
      <>
        <Link href={"/profile"} className="whitespace-nowrap">
          <div className="flex flex-col gap-1 items-center justify-center">
            {!mobile && (
              <Image
                src={image || "/avatar.svg"}
                alt={userName}
                className="rounded-full"
                width={40}
                height={40}
              />
            )}
          </div>
        </Link>
        <button
          onClick={() => signOut()}
          className="bg-primary rounded-full text-white px-8 py-2"
        >
          Abmelden
        </button>
      </>
    );
  }
  if (status === "unauthenticated") {
    return (
      <>
        <Link href={"/login"}>Anmelden</Link>
        <Link
          href={"/register"}
          className="bg-primary rounded-full text-white px-8 py-2"
        >
          Registrieren
        </Link>
      </>
    );
  }
}

export default function Header() {
  const session = useSession();
  const status = session?.status;
  const userData = session.data?.user;
  let userName = userData?.name || userData?.email;
  const { cartProducts } = useContext(cartContext);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [allDeliveryFree, setAllDeliveryFree] = useState(false);

  if (userName && userName.includes(" ")) {
    userName = userName.split(" ")[0];
  }

  useEffect(() => {
    // Fetch delivery prices
    async function fetchDeliveryPrices() {
      try {
        const response = await fetch("/api/delivery-prices"); // Update the endpoint if necessary
        if (!response.ok) throw new Error("Failed to fetch delivery prices");
        const prices = await response.json();
        const allFree = prices.every((price) => price.price === 0);
        setAllDeliveryFree(allFree);
      } catch (error) {
        console.error("Error fetching delivery prices:", error);
      }
    }

    fetchDeliveryPrices();
  }, []);

  return (
    <header
      id="header"
      className="absolute top-0 left-0 bg-gray-950 right-0 w-full z-20"
    >
      {allDeliveryFree && (
        <div className="flex justify-center text-center items-center w-full h-[50px] text-gray-950 p-2 delivery-promo">
          Nur heute! Genießen Sie kostenlosen Versand auf alle Bestellungen! 🎉
        </div>
      )}
      <div className="flex items-center md:hidden justify-between px-8 py-2">
        <Link className="text-primary font-semibold text-2xl" href={"/"}>
          <Image
            className="nav-logo"
            src="/antalya.png"
            width={75}
            height={75}
            alt="Antalya Restaurant-Logo"
          />
        </Link>
        <div className="flex gap-8 items-center">
          <Link href={"/profile"}>
            <Image
              src={userData?.image || "/avatar.svg"}
              alt={userName}
              className="rounded-full"
              width={40}
              height={40}
            />
          </Link>

          <button
            className="p-1 border"
            onClick={() => setMobileNavOpen((prev) => !prev)}
          >
            <Bars2 />
          </button>
        </div>
      </div>
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="md:hidden top-0 p-4 bg-gray-950 text-white rounded-lg mt-2 flex flex-col gap-2 text-center"
        >
          <Link href={"/"}>Startseite</Link>
          <Link href={"/menu/pdf"}>Speisekarte</Link>
          <Link href={"/#about"}>Über uns</Link>
          <Link href={"/#contact"}>Kontakt</Link>
          <AuthLinks status={status} userName={userName} mobile={true} />
        </div>
      )}
      <div className="hidden md:flex items-center justify-between px-8 py-2">
        <nav className="flex items-center gap-8 text-white font-semibold">
          <Link className="text-primary font-semibold text-2xl" href={"/"}>
            <Image
              src="/antalya.png"
              width={80}
              height={80}
              alt="Antalya Restaurant-Logo"
            />
          </Link>
          <Link href={"/"}>Startseite</Link>
          <Link href={"/menu/pdf"}>Speisekarte</Link>
          <Link href={"/#about"}>Über uns</Link>
          <Link href={"/#contact"}>Kontakt</Link>
        </nav>
        <nav className="flex items-center gap-4 text-white font-semibold">
          <AuthLinks
            status={status}
            userName={userName}
            image={userData?.image}
          />
        </nav>
      </div>
    </header>
  );
}
