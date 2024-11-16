import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "./_components/layout/Header";
import Footer from "./_components/layout/Footer";
import AppProvider from "./_components/AppContext";
import { Toaster } from "react-hot-toast";
import Sidebar from "./_components/layout/Sidebar";
import MobileCart from "./_components/layout/MobileCart";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata = {
  title: {
    template: "%s | Antalya Harsefeld",
    default: "Antalya Harsefeld",
  },
  description:
    "Antalya in Harsefeld bietet frisches und leckeres Sushi mit schneller Lieferung. Genießen Sie hochwertige Sushi-Kreationen, bequem und frisch direkt nach Hause geliefert. Jetzt bestellen!",
  icons: {
    icon: "/logo-favi.png",
  },
  openGraph: {
    type: "website",
    url: "https://antalya-harsefeld.de",
    title: "Antalya Harsefeld",
    description:
      "Antalya in Harsefeld bietet frisches und leckeres Sushi mit schneller Lieferung. Genießen Sie hochwertige Sushi-Kreationen, bequem und frisch direkt nach Hause geliefert. Jetzt bestellen!",
    images: [
      {
        url: "/logo-og.jpg",
        width: 1200,
        height: 630,
        alt: "Antalya Harsefeld",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className}`}
        style={{ backgroundColor: "#FcFcFc" }}
      >
        <AppProvider>
          <main
            style={{ minHeight: "100vh", paddingTop: "130px" }}
            className=""
          >
            <Toaster />
            <Header />
            <MobileCart />
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
