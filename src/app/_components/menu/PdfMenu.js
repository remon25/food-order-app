"use client";
import { useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import imageOne from "/public/pdf/1.jpeg";
import imageTwo from "/public/pdf/2.jpeg";
import imageThree from "/public/pdf/3.jpeg";
import imageFour from "/public/pdf/4.jpeg";
import imageFive from "/public/pdf/5.jpeg";
import imageSix from "/public/pdf/6.jpeg";
import Image from "next/image";

export default function PDFMenuPage(props) {
  const [flipBookSize, setFlipBookSize] = useState({ width: 500, height: 600 });
  const [smallScreen, setSmallScreen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.getElementById("footer").style.display = "none";
    function handleResize() {
      if (window.innerWidth <= 640) {
        // Small screens
        setFlipBookSize({ width: 300, height: 400 });
        setSmallScreen(true);
      } else if (window.innerWidth <= 1024) {
        // Medium screens
        setFlipBookSize({ width: 400, height: 500 });
        setSmallScreen(false);
      } else {
        // Large screens
        setFlipBookSize({ width: 500, height: 600 });
        setSmallScreen(false);
      }
    }

    // Set initial size
    handleResize();
    // Add resize event listener
    window.addEventListener("resize", handleResize);
    // Cleanup on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 w-screen h-screen z-40 bg-[#fcfcfc] !overflow-hidden flex justify-center items-center">
      <div className="h-screen w-full container mx-auto flex justify-center items-center !overflow-hidden">
        {smallScreen ? (
          <HTMLFlipBook width={300} height={642.39}>
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
          <HTMLFlipBook width={373} height={800} showCover={true}>
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
      </div>
    </div>
  );
}
