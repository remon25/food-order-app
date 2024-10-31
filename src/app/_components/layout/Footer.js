import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-secondary p-8 text-white mt-24">
      <div className="w-full flex justify-center">
        <Image src="/logo.png" alt="logo" width={150} height={150} />
      </div>
      <div className="flex flex-col gap-2 mt-5">
        <div>
          <h4 className="uppercase font-bold">Kontakt</h4>
          <p>
            Winsener Straße 8 <br />
            21077 Hamburg
          </p>
        </div>
        <a href="tel:+49 40 78053764">+49 40 78053764</a>
      </div>

      <div className="text-center mt-5">© Nice sushi. Alle Rechte vorbehalten.</div>
    </footer>
  );
}
