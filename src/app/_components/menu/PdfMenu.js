"use client";
import { useEffect, useState, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import Image from "next/image";
import ChevronRight from "../icons/ChevronRight";
import imageOne from "/public/pdf/1.jpeg";
import imageTwo from "/public/pdf/2.jpeg";
import imageThree from "/public/pdf/3.jpeg";
import imageFour from "/public/pdf/4.jpeg";
import imageFive from "/public/pdf/5.jpeg";
import imageSix from "/public/pdf/6.jpeg";

export default function PDFMenuPage(props) {
  const [smallScreen, setSmallScreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const flipBookRef = useRef(null);

  const pages = [
    imageOne,
    imageTwo,
    imageThree,
    imageFour,
    imageFive,
    imageSix,
  ];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.getElementById("footer").style.display = "none";

    function handleResize() {
      setSmallScreen(window.innerWidth <= 640);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onFlip = (e) => {
    setCurrentPage(e.data);
  };

  const onInit = () => {
    // Calculate total pages based on child elements passed to HTMLFlipBook
    setTotalPages(pages.length);
  };

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
    <div className="h-[100svh] absolute top-0 left-0 bottom-0 right-0 w-screen z-40 bg-[#fcfcfc] !overflow-hidden flex justify-center items-center">
      <div className="h-full w-full container mx-auto flex justify-center items-center !overflow-hidden relative">
        <HTMLFlipBook
          ref={flipBookRef}
          width={smallScreen ? 280.2 : 373}
          height={smallScreen ? 600 : 800}
          showCover={!smallScreen}
          onFlip={onFlip}
          onInit={onInit} // Ensures totalPages is set correctly
        >
          {pages.map((image, index) => (
            <div key={index} className="demoPage">
              <Image
                src={image}
                className="w-full h-full"
                alt={`Page ${index + 1}`}
              />
            </div>
          ))}
        </HTMLFlipBook>

        <div className="flex items-center gap-4 absolute bottom-[0px]">
          <button
            onClick={goToPrevPage}
            className={`transform rotate-180 bg-gray-500 text-white p-1 rounded-full ${
              currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="text-lg font-bold text-gray-700">
            {currentPage + 1} / {totalPages}
          </div>
          <button
            onClick={goToNextPage}
            className={`bg-gray-500 text-white p-1 rounded-full ${
              currentPage === totalPages - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={currentPage === totalPages - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
