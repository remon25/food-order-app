import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "./_components/layout/Header";
import Footer from "./_components/layout/Footer";
import AppProvider from "./_components/AppContext";
import { Toaster } from "react-hot-toast";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata = {
  title: {
    template: "%s | Antalya",
    default: "Antalya",
  },
  description:
    "Antalya in Hamburg bietet frisches und leckeres Sushi mit schneller Lieferung. Genießen Sie hochwertige Sushi-Kreationen, bequem und frisch direkt nach Hause geliefert. Jetzt bestellen!",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.className}`}>
        <main className="max-w-6xl mx-auto p-4">
          <AppProvider>
            <Toaster />
            <Header />
            {children}
          </AppProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}
