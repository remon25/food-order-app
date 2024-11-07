"use client";
import HTMLFlipBook from "react-pageflip";
import imageOne from "/public/pdf/1.jpg";
import imageTwo from "/public/pdf/2.jpg";
import imageThree from "/public/pdf/3.jpg";
import imageFour from "/public/pdf/4.jpg";
import imageFive from "/public/pdf/5.jpg";
import imageSix from "/public/pdf/6.jpg";
import Image from "next/image";

export default function PDFMenuPage(props) {
  return (
    <div className="h-screen w-full container mx-auto -mt-[88px] flex justify-center items-center !overflow-hidden">
      <HTMLFlipBook width={500} height={600}>
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
    </div>
  );
}
