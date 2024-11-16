import Image from "next/image";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center h-full mt-14">
      <Image src="/404.webp" alt="404" width={300} height={300} />
      <p className="text-lg">Die Seite wurde nicht gefunden.</p>
    </div>
  );
}
