import React from "react";
import HighLightText from "./HighLightText";
import knowYourProgressImage from "../../../assets/Images/Know_your_progress.png"
import compareWithOthers from "../../../assets/Images/Compare_with_others.png"
import planYourLessons from "../../../assets/Images/Plan_your_lessons.png"
import CTAbutton from "./Button"

function LearningLangSection() {
  return (
    <div>
        <div className="text-4xl font-semibold text-center my-10">
            Your swiss knife for
            <HighLightText text={"learning any language"} />
            <div className="text-center text-richblack-700 font-medium lg:w-[75%] mx-auto leading-6 text-base mt-3">
              Using spin making learning multiple languages easy. with 20+
              languages realistic voice-over, progress tracking, custom schedule
              and more.
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-center mt-8 lg:mt-0">
              <img
                src={ knowYourProgressImage}
                alt=""
                className="object-contain  lg:-mr-32 "
              />
              <img
                src={compareWithOthers}
                alt=""
                className="object-contain lg:-mb-10 lg:-mt-0 -mt-12"
              />
              <img
                src={planYourLessons}
                alt=""
                className="object-contain  lg:-ml-36 lg:-mt-5 -mt-16"
              />
            </div>
          </div>

          <div className="w-fit mx-auto lg:mb-20 mb-8 -mt-5">
            <CTAbutton active={true} linkto={"/signup"}>
              <div className="">Learn More</div>
            </CTAbutton>
          </div>
    </div>
  );
}

export default LearningLangSection;
