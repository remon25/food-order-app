"use client";
import { useState, useRef, useEffect } from "react";
import MenuItem from "../menu/MenuItem";
import SearchBar from "./SearchBar";
import ChevronRight from "../icons/ChevronRight";

export default function FilteredMenu({ menu, categories }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const categoryRefs = useRef({});
  const categoryNavRef = useRef(null);

  const filteredMenu = menu.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const reorderedCategories = categories?.length
    ? categories.sort((a, b) => {
        if (a.name.toLowerCase() === "offers") return -1;
        if (b.name.toLowerCase() === "offers") return 1;
        return 0;
      })
    : [];

  const scrollToCategory = (categoryId) => {
    const categoryElement = categoryRefs.current[categoryId];

    if (categoryElement) {
      window.scrollTo({
        top: categoryElement.offsetTop - 100, // Adjust for sticky header height
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
        setCanScrollLeft(nav.scrollLeft > 0); // Only true if scrollLeft > 0
        setCanScrollRight(
          nav.scrollLeft + nav.clientWidth < nav.scrollWidth // Only true if there's content to scroll to on the right
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
          const isOffersCategory = c.name.toLowerCase() === "offers";

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
              className={`${isOffersCategory ? "offers-category" : ""} overflow-hidden`}
            >
              <div
                className={`pl-7 ${
                  isOffersCategory ? "custom-offers-header" : ""
                }`}
              >
                <h2 className="text-gray-800 font-bold text-[1rem] md:text-2xl mt-14 mb-4">
                  {c.name}
                </h2>
              </div>
              <div
                className={`grid md:grid-cols-1 md:justify-center gap-6 mt-6 mb-12 px-5 ${
                  isOffersCategory ? "custom-offers-grid" : ""
                }`}
              >
                {categoryItems.map((item) => (
                  <MenuItem
                    key={item._id}
                    menuItemInfo={item}
                    isOffersCategory={isOffersCategory}
                  />
                ))}
              </div>
            </div>
          );
        })}
    </section>
  );
}
