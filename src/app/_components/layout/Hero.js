"use client";

// import Image from "next/image";
// import heroImg from "/public/hero.png";
import heroOne from "/public/hero-one.jpg";
import heroTwo from "/public/hero-two.jpg";
import Right from "../icons/Right";

// export default function Hero() {
//   return (
//     <section className="hero">
//       <div className="py-12">
//         <h1 className="text-4xl font-semibold leading-normal">
//           Frisches <span className="text-primary">Sushi</span> Schnell Geliefert
//         </h1>
//         <p className="my-6 text-gray-500">
//           Leckere Sushi-Kreationen direkt zu Ihnen nach Hause geliefert.
//         </p>
//         <div className="flex gap-6 text-sm">
//           <button className="flex gap-2 items-center uppercase bg-primary text-white px-4 py-2 rounded-full">
//             Bestelle jetzt
//             <Right />
//           </button>
//           <button className="flex items-center gap-2 text-gray-600 font-semibold py-2 rounded-full">
//             Erfahre mehr <Right />
//           </button>
//         </div>
//       </div>

//       <div className="relative">
//         <Image src={heroImg} layout="fill" objectFit="contain" alt="sushi" />
//       </div>
//     </section>
//   );
// }

import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    appenDots: (dots) => (
      <div>
        <ul>{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div className="w-3 h-3 border bg-white rounded-full mt-10"></div>
    ),
  };

  return (
    <div className="h-screen w-full container mx-auto -mt-[88px]">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="relative h-full w-full">
          <Image
            src={heroOne}
            alt=""
            layout="fill"
            priority
            objectFit="cover"
          />
        </div>
      </div>
      <Slider {...settings}>
        <div>
          <div className="mt-48  text-gray-900 flex flex-col items-center gap-y-10">
            <h1 className="text-6xl text-center font-semibold">
              Fast Food Restaurant
            </h1>
            <p className="text-sm text-center sm:w-2/5 w-full">
              Das Restaurant Delizia Express bietet eine ideale Kombination aus
              schneller Lieferung und hochwertigem Essen. Innerhalb kürzester
              Zeit wird die Bestellung frisch zubereitet und heiß direkt bis an
              die Haustür geliefert. Mit einem abwechslungsreichen Menü, das von
              saftigen Burgern bis zu gesunden Salaten reicht, setzt das
              Restaurant auf beste Zutaten und höchste Qualität.
            </p>
            <button className="flex items-center gap-2 bg-primary p-4 text-white font-semibold rounded-md">
              Erfahre mehr <Right />
            </button>
          </div>
        </div>
        <div>
          <div className="mt-48  text-gray-900 flex flex-col items-center gap-y-10">
            <h1 className="text-6xl text-center font-semibold">
              Fast Food Restaurant
            </h1>
            <p className="text-sm text-center sm:w-2/5 w-full">
              Das Restaurant Delizia Express bietet eine ideale Kombination aus
              schneller Lieferung und hochwertigem Essen. Innerhalb kürzester
              Zeit wird die Bestellung frisch zubereitet und heiß direkt bis an
              die Haustür geliefert. Mit einem abwechslungsreichen Menü, das von
              saftigen Burgern bis zu gesunden Salaten reicht, setzt das
              Restaurant auf beste Zutaten und höchste Qualität.
            </p>
            <button className="flex items-center gap-2 bg-primary p-4 text-white font-semibold rounded-md">
              Erfahre mehr <Right />
            </button>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;
