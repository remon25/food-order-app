"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import { FreeMode, Pagination } from "swiper/modules";

export default function App() {
  return (
    <>
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        freeMode={true}
        loop={true}
        pagination={{
          clickable: true,
        }}
        modules={[FreeMode, Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img src="banner.jpg" />
        </SwiperSlide>
        <SwiperSlide>
        </SwiperSlide>
        <SwiperSlide>
        </SwiperSlide>
        <SwiperSlide>
        </SwiperSlide>
        <SwiperSlide>
        </SwiperSlide>
        <SwiperSlide>
        </SwiperSlide>
      </Swiper>
    </>
  );
}
