"use client";
import { useEffect, useState, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import imageOne from "/public/pdf/1.jpeg";
import imageTwo from "/public/pdf/2.jpeg";
import imageThree from "/public/pdf/3.jpeg";
import imageFour from "/public/pdf/4.jpeg";
import imageFive from "/public/pdf/5.jpeg";
import imageSix from "/public/pdf/6.jpeg";
import Image from "next/image";

export default function PDFMenuPage(props) {
  const [smallScreen, setSmallScreen] = useState(false);
  const flipBookRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.getElementById("footer").style.display = "none";
    function handleResize() {
      if (window.innerWidth <= 640) {
        setSmallScreen(true);
      } else if (window.innerWidth <= 1024) {
        setSmallScreen(false);
      } else {
        setSmallScreen(false);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Functions to handle page flipping
  const goToNextPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  const goToPrevPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };

  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 w-screen h-screen z-40 bg-[#fcfcfc] !overflow-hidden flex justify-center items-center">
      <div className="h-screen w-full container mx-auto flex justify-center items-center !overflow-hidden relative">
        {smallScreen ? (
          <HTMLFlipBook
            ref={flipBookRef}
            flippingTime={100}
            width={280.2}
            height={600}
          >
            <div className="demoPage">
              <Image src={imageOne} className="w-full h-full" alt="" />
            </div>
            <div className="demoPage">
              <Image src={imageTwo} className="w-full h-full" alt="" />
            </div>
            <div className="demoPage">
              <Image src={imageThree} className="w-full h-full" alt="" />
            </div>
            <div className="demoPage">
              <Image src={imageFour} className="w-full h-full" alt="" />
            </div>
            <div className="demoPage">
              <Image src={imageFive} className="w-full h-full" alt="" />
            </div>
            <div className="demoPage">
              <Image src={imageSix} className="w-full h-full" alt="" />
            </div>
          </HTMLFlipBook>
        ) : (
          <HTMLFlipBook ref={flipBookRef} width={373} height={800} showCover={true}>
            <div className="demoPage">
              <Image src={imageOne} className="w-full h-full" alt="menu page" />
            </div>
            <div className="demoPage">
              <Image src={imageTwo} className="w-full h-full" alt="menu page" />
            </div>
            <div className="demoPage">
              <Image src={imageThree} className="w-full h-full" alt="menu page" />
            </div>
            <div className="demoPage">
              <Image src={imageFour} className="w-full h-full" alt="menu page" />
            </div>
            <div className="demoPage">
              <Image src={imageFive} className="w-full h-full" alt="menu page" />
            </div>
            <div className="demoPage">
              <Image src={imageSix} className="w-full h-full" alt="menu page" />
            </div>
          </HTMLFlipBook>
        )}

        {/* Left and Right Arrows for navigation */}
        <button
          onClick={goToPrevPage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded-full"
        >
          &#8592;
        </button>
        <button
          onClick={goToNextPage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded-full"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}
