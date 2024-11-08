import PdfMenu from "@/app/_components/menu/PdfMenu";

export const metadata = {
  title:"OUR MENU",
  description:
    "Antalya in Harsefeld bietet frisches und leckeres Sushi mit schneller Lieferung. Genießen Sie hochwertige Sushi-Kreationen, bequem und frisch direkt nach Hause geliefert. Jetzt bestellen!",
  icons: {
    icon: "/logo-favi.png",
  },
  openGraph: {
    type: "website",
    url: "https://antalya-harsefeld.de/menu/pdf",
    title: "Antalya Harsefeld",
    description:
      "Antalya in Harsefeld bietet frisches und leckeres Sushi mit schneller Lieferung. Genießen Sie hochwertige Sushi-Kreationen, bequem und frisch direkt nach Hause geliefert. Jetzt bestellen!",
    images: [
      {
        url: "/pdf-og.png",
        width: 1200, 
        height: 630,  
        alt: "Antalya Harsefeld",
      },
    ],
  },
};

export default function page() {
  return <PdfMenu />;
}
