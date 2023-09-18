import React from "react";
import {MdPeopleAlt} from "react-icons/md"
import {TbBinaryTree} from "react-icons/tb"

function CourseCard({ cardData, setCureentCard, currentCard }) {
  return (
    <div >
      <div className={`${currentCard===cardData.heading?"bg-[#fff] drop-shadow-[12px_12px_#FFD60A] text-black" :"bg-richblack-700"} p-4 h-[280px] w-[350px]`} >
        <h2 className={`${currentCard===cardData.heading?"font-bold " :"text-richblack-25"} text-2xl w-full mt-[4%]`}>{cardData.heading}</h2>
        <p className="text-richblack-400 mt-[4%]">{cardData.description}</p>
        <div className="mt-[25%] flex justify-between border-t-2 border-dashed  border-richblack-200 ">
          <p className={`${currentCard===cardData.heading?" text-[#0F7A9D]" :" text-richblack-200"}   items-center gap-2 flex mt-[4%]`}>
            <div><MdPeopleAlt /></div>
            <div>{cardData.level}</div>
          </p>
          <p className={`${currentCard===cardData.heading?" text-[#0F7A9D]" :" text-richblack-200"}   items-center gap-2 flex mt-[4%]`}>
          <div><TbBinaryTree/></div>
            <div>{cardData.lessionNumber}</div>
            
          </p>
        </div>
      </div>
     
    </div>
  );
}

export default CourseCard;
