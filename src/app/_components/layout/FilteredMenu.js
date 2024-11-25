"use client";
import { useState, useRef, useEffect } from "react";
import MenuItem from "../menu/MenuItem";
import SearchBar from "./SearchBar";
import ChevronRight from "../icons/ChevronRight";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import { FreeMode, Pagination } from "swiper/modules";

export default function FilteredMenu({ menu, categories }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const categoryRefs = useRef({});
  const categoryNavRef = useRef(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const filteredMenu = menu.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const reorderedCategories = categories?.length
    ? categories.sort((a, b) => {
        if (a.name.toLowerCase() === "angebote") return -1;
        if (b.name.toLowerCase() === "angebote") return 1;
        return 0;
      })
    : [];

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - categoryNavRef.current.offsetLeft;
    scrollLeft.current = categoryNavRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const x = e.pageX - categoryNavRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Adjust scroll sensitivity
    categoryNavRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e) => {
    isDragging.current = true;
    startX.current = e.touches[0].pageX - categoryNavRef.current.offsetLeft;
    scrollLeft.current = categoryNavRef.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const x = e.touches[0].pageX - categoryNavRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Adjust scroll sensitivity
    categoryNavRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const nav = categoryNavRef.current;

    nav.addEventListener("mousedown", handleMouseDown);
    nav.addEventListener("mousemove", handleMouseMove);
    nav.addEventListener("mouseup", handleMouseUp);
    nav.addEventListener("mouseleave", handleMouseUp);
    nav.addEventListener("touchstart", handleTouchStart);
    nav.addEventListener("touchmove", handleTouchMove);
    nav.addEventListener("touchend", handleTouchEnd);

    return () => {
      nav.removeEventListener("mousedown", handleMouseDown);
      nav.removeEventListener("mousemove", handleMouseMove);
      nav.removeEventListener("mouseup", handleMouseUp);
      nav.removeEventListener("mouseleave", handleMouseUp);
      nav.removeEventListener("touchstart", handleTouchStart);
      nav.removeEventListener("touchmove", handleTouchMove);
      nav.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const scrollToCategory = (categoryId) => {
    const categoryElement = categoryRefs.current[categoryId];

    if (categoryElement) {
      window.scrollTo({
        top: categoryElement.offsetTop - 85, // Adjust for sticky header height
        behavior: "smooth",
      });

      setActiveCategory(categoryId); // Sync active category
    }
  };

  const scrollCategoryNav = (direction) => {
    const nav = categoryNavRef.current;
    const scrollAmount = 200;
    nav.scrollLeft += direction === "right" ? scrollAmount : -scrollAmount;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (searchQuery.trim() !== "") return;

      let currentCategory = "";

      for (const [id, ref] of Object.entries(categoryRefs.current)) {
        if (!ref) continue;
        const rect = ref.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 100) {
          currentCategory = id;
          break;
        }
      }

      if (currentCategory !== activeCategory) {
        setActiveCategory(currentCategory);

        const nav = categoryNavRef.current;
        const activeButton = nav?.querySelector(
          `button[data-id="${currentCategory}"]`
        );
        if (nav && activeButton) {
          const navLeft = nav.getBoundingClientRect().left;
          const buttonLeft = activeButton.getBoundingClientRect().left;
          const offset = buttonLeft - navLeft;

          nav.scrollLeft += offset;
        }
      }

      const nav = categoryNavRef.current;
      if (nav) {
        setCanScrollLeft(nav.scrollLeft > 0); 
        setCanScrollRight(
          nav.scrollLeft + nav.clientWidth < nav.scrollWidth 
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [searchQuery, activeCategory]);

  return (
    <section className="home-menu pr-[330px]">
      <h1 className="text-[#222] text-center font-bold text-2xl md:text-3xl mb-10 p-2">
        🍕 Antalya Speisekarte 🍕
      </h1>

      {/* Sticky SearchBar */}
      <div className="sticky top-0 z-20 bg-white border-b">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Sticky Category Navigation */}
      {searchQuery.trim() === "" && (
        <div className="sticky top-[73px] z-10 border-b bg-white px-10 pt-2 flex items-center">
          <button
            className={`absolute rotate-180 left-[5px] top-[50%] translate-y-[-50%] bg-gray-100 p-1 rounded-full ${
              !canScrollLeft ? "hidden" : ""
            }`}
            onClick={() => scrollCategoryNav("left")}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            className={`absolute right-[5px] top-[50%] translate-y-[-50%] bg-gray-100 p-1 rounded-full ${
              !canScrollRight ? "hidden" : ""
            }`}
            onClick={() => scrollCategoryNav("right")}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div
            ref={categoryNavRef}
            className="category-nav overflow-x-auto whitespace-nowrap py-3 px-4"
          >
            {reorderedCategories.map((c) => (
              <button
                key={c._id}
                data-id={c._id}
                className={`px-4 py-2 mr-2 text-[0.7rem] md:text-xs font-bold ${
                  activeCategory === c._id
                    ? "text-white bg-slate-950"
                    : "text-gray-700 bg-none"
                } rounded-full transition`}
                onClick={() => scrollToCategory(c._id)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Render categories */}
      {reorderedCategories.length > 0 &&
        reorderedCategories.map((c) => {
          const isOffersCategory = c.name.toLowerCase() === "angebote";

          const categoryItems = filteredMenu.filter(
            (item) => item.category === c._id
          );

          if (categoryItems.length === 0) {
            return null;
          }

          return (
            <div
              key={c._id}
              ref={(el) => (categoryRefs.current[c._id] = el)}
              className={`${
                isOffersCategory ? "offers-category" : ""
              } overflow-hidden`}
            >
              <div
                className={`pl-7 ${
                  isOffersCategory ? "custom-offers-header" : ""
                }`}
              >
                <h2 className="text-primary font-bold text-[1rem] md:text-2xl mt-14 mb-4">
                  {c.name}
                </h2>
              </div>
              <div
                className={`grid md:grid-cols-1 md:justify-center gap-6 mt-6 mb-12 px-5 ${
                  isOffersCategory ? "custom-offers-grid" : ""
                }`}
              >
                {!isOffersCategory &&
                  categoryItems.map((item) => (
                    <MenuItem
                      key={item._id}
                      menuItemInfo={item}
                      isOffersCategory={isOffersCategory}
                    />
                  ))}
                {isOffersCategory && (
                  <Swiper
                  breakpoints={{
                    767: {
                      slidesPerView: 3, 
                    },
                    0: {
                      slidesPerView: 1.5,
                    },
                  }}
                    spaceBetween={10}
                    freeMode={true}
                    loop={true}
                    pagination={{
                      clickable: true,
                    }}
                    modules={[FreeMode, Pagination]}
                    className="mySwiper"
                  >
                    {categoryItems.map((item) => (
                      <>
                        <SwiperSlide>
                          <MenuItem
                            key={item._id}
                            menuItemInfo={item}
                            isOffersCategory={isOffersCategory}
                          />
                        </SwiperSlide>
                      </>
                    ))}
                  </Swiper>
                )}
              </div>
            </div>
          );
        })}
    </section>
  );
}
