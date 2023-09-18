import React from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
// Import required modules
import { Pagination ,FreeMode} from 'swiper/modules';

import { Course_Card } from './Course_Card'

export const CourseSlider = ({Courses}) => {
  return (
    <div>
        {
            Courses.length?
            ( <Swiper
                slidesPerView={1}
                spaceBetween={25}
                loop={true}
                modules={[FreeMode, Pagination]}
                breakpoints={{
                  1024: {
                    slidesPerView: 3,
                  },
                }}
                className="max-h-[30rem]"
              >
                {Courses?.map((course, i) => (
                  <SwiperSlide key={i}>
                    <Course_Card course={course} Height={"h-[250px]"} />
                  </SwiperSlide>
                ))}
              </Swiper>

            ):(   <p className="text-xl text-richblack-5">No Course Found</p>)
        }
    </div>
  )
}
