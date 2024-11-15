import Image from "next/image";
import Facebook from "../icons/Facebook";
import Instagram from "../icons/Instagram";
import Whatsapp from "../icons/Whatsapp";

export default function Footer() {
  return (
    <footer id="footer" className="relative bg-[#747969] p-3 text-white mt-24 z-[3] overflow-hidden">
      <div className="flex flex-col-reverse sm:flex-row">
        <div className="flex flex-col gap-2 mt-2">
          <div>
            <h4 className="uppercase font-bold">Kontakt</h4>
            <p>
              Harsefeld <br />
              21077
            </p>
          </div>
          <a className="text-nowrap" href="tel:+04164 909 55 22">
            04164 909 55 22
          </a>
        </div>
        <div className="relative sm:absolute w-full flex justify-center">
          <div className="flex flex-col items-center">
            <Image src="/antalya.png" alt="logo" width={70} height={70} />
            <div className="h-full flex items-center justify-between gap-4 mt-2">
              <Facebook />
              <Instagram />
              <Whatsapp />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full text-center mt-2">
        © Antalya Harsefeld. Alle Rechte vorbehalten.
      </div>
    </footer>
  );
}
