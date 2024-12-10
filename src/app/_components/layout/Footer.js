import Image from "next/image";
import Facebook from "../icons/Facebook";
import Instagram from "../icons/Instagram";
import Whatsapp from "../icons/Whatsapp";
import Link from "next/link";
import OpenHours from "./OpenHours";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="relative bg-[#747969] p-3 text-white mt-24 z-[3] overflow-hidden"
    >
      <div className="flex flex-col-reverse sm:flex-row">
        <div className="flex flex-col gap-2 mt-6">
          <OpenHours />
          <div>
            <h4 className="uppercase font-bold">Kontakt</h4>
            <p>Friedrich-Huth-Strasse 15 - 21698 Harsefeld</p>
          </div>
          <a className="text-nowrap" href="tel:04164 909 55 22">
            04164 909 55 22
          </a>
        </div>
        <div className="relative sm:absolute w-full flex justify-center">
          <div className="flex flex-col items-center">
            <Image src="/antalya.png" alt="logo" width={70} height={70} />
            <div className="h-full flex items-center justify-between gap-4 mt-2">
              <Facebook className="w-4 h-4" />
              <Instagram className="w-4 h-4" />
              <Whatsapp className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex gap-4 justify-center text-[14px]  text-center  mt-8 pb-2">
        <Link href={"/terms-and-conditions"} className="font-semibold">
          AGB
        </Link>
        <Link href={"/privacy-policy"} className="font-semibold">
          Datenschutzerklärung
        </Link>
      </div>
      <div className="w-full text-center">
        © Antalya Harsefeld. Alle Rechte vorbehalten.
      </div>
      <div className="w-full text-[15px] italic text-center mt-1 pb-2">
        Entworfen und entwickelt von{" "}
        <Link
          className="font-semibold"
          href="https://ooomedia.de/"
          target="_blank"
        >
          ooomedia
        </Link>
      </div>
    </footer>
  );
}
