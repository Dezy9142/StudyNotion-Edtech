import React from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import HighLightText from "../components/core/HomePage/HighLightText";
import CTAbutton from "../components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4";
import Codeblocks from "../components/core/HomePage/Codeblocks";
import LearningLangSection from "../components/core/HomePage/LearningLangSection";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import ExploreMore from "../components/core/HomePage/ExploreMore";
import { Footer } from "../components/Common/Footer";
import ReviewSlider from "../components/Common/ReviewSlider";

function Home() {
  return (
    <div>
      {/* section 1 */}
      <div
        className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center 
      text-white justify-between"
      >
        <Link to={"/signUP"}>
          <div
            className="group mt-16 p-1 max-auto rounded-full bg-richblack-800 font-bold text-richblack-100
                transition-all duration-200 hover:scale-95 w-fit drop-shadow-[0_3px_#2C333F] "
          >
            <div
              className="flex items-center gap-2 rounded-full px-10 py-[5px] 
                transition-all duration-200 group-hover:bg-richblack-900 "
            >
              <p>Become an Instructor</p>
              <AiOutlineArrowRight />
            </div>
          </div>
        </Link>
        <div className=" text-center font-semibold text-3xl mt-9">
          Empower Your Future with
          <HighLightText text={"Coding Skills"} />
        </div>
        <div className="text-center text-richblack-300 mt-4 w-[90%]">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a <br /> wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>
        <div className="flex mt-8 gap-7">
          <CTAbutton active={true} linkto={"/signUP"}>
            Learn More
          </CTAbutton>
          <CTAbutton active={false} linkto={"/login"}>
            Book a Demo
          </CTAbutton>
        </div>
        <div className="mx-3 my-12   shadow-[-11px_-25px_23px_#162F41]">
          <video
            muted
            loop
            autoPlay
            className="drop-shadow-[20px_20px_rgb(255,255,255)]"
          >
            <source src={Banner} type="video/mp4" />
          </video>
        </div>
        {/* Code Section 1 */}
        <div>
          <Codeblocks
            position={"lg:flex-row"}
            heading={
              <div className=" text-4xl font-semibold">
                Unlock your <HighLightText text={"coding potentials"} />
                with our online courses
              </div>
            }
            subHeading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabtn1={{
              btnText: "Try it yourself",
              linkto: "/signUP",
              active: true,
            }}
            ctabtn2={{ btnText: "Learn More", linkto: "/login", active: false }}
            codeblock={`<!DOCTYPE html>\n<html> \n head><>Example</   \ntitle><linkrel="stylesheet"href="styles.css"\n/head>\nbody>\nh1><a href="/">Header</a>> \n/h1>\nnav><ahref="one/">One</a>\n nav><ahref="one/">One</a><ahref="two/">Two</a>\n<nav/>`}
            codeColor={"text-yellow-200"}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
          />
        </div>
        {/* Code Section 2 */}
        <div>
          <Codeblocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className=" text-4xl font-semibold">
                Start <HighLightText text={"coding in seconds"} />
              </div>
            }
            subHeading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              btnText: "Continue Lession",
              linkto: "/signUP",
              active: true,
            }}
            ctabtn2={{ btnText: "Learn More", linkto: "/login", active: false }}
            codeblock={`<!DOCTYPE html>\n<html> \n head><>Example</   \ntitle><linkrel="stylesheet"href="styles.css"\n/head>\nbody>\nh1><a href="/">Header</a>> \n/h1>\nnav><ahref="one/">One</a>\n nav><ahref="one/">One</a><ahref="two/">Two</a>\n<nav/>`}
            codeColor={"text-blue-200"}
            backgroundGradient={<div className="codeblock2 absolute"></div>}
            
          />
        </div>

        <ExploreMore />
      </div>
      {/* section 2 */}
      <div className="bg-pure-greys-5 text-richblack-700">
        <div className="homepage_bg flex h-[333px]">
          <div className="w-11/12 max-w-maxContent flex flex-col items-center gap-5 mx-auto ">
            <div className="h-[150px]"></div>
            <div className="flex gap-7 text-white">
              <CTAbutton active={true} linkto={"/signUP"}>
                <div className="flex items-center gap-2">
                  Explore full Catalog
                  <AiOutlineArrowRight />
                </div>
              </CTAbutton>
              <CTAbutton active={false} linkto={"/signUP"}>
                {" "}
                Learn More
              </CTAbutton>
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 ">
          <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
            <div className="text-4xl font-semibold lg:w-[45%] ">
              Get the skills you need for a
              <HighLightText text={"job that is in demand."} />
            </div>
            <div className="flex flex-col items-start gap-10 lg:w-[40%]">
              <div className="text-[16px]">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <CTAbutton active={true} linkto={"/signUP"}>
                <div>Learn More</div>
              </CTAbutton>
            </div>
          </div>
          <TimelineSection />
          <LearningLangSection />
        </div>
      </div>
      {/* section 3 */}
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
            {/* Become a instructor section */}
            <InstructorSection />

            {/* Reviws from Other Learner */}
            <h1 className="text-center text-4xl font-semibold mt-8">
            Reviews from other learners
            </h1>
            <ReviewSlider />
        </div>
      {/* Footer */}
      <Footer />
    </div>
    
  );
}

export default Home;
