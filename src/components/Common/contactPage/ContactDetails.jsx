import React from "react";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { BsGlobeCentralSouthAsia } from "react-icons/bs";
import { FaPhone } from "react-icons/fa";

export const ContactDetails = () => {
  const contactDetails = [
    {
      id: 1,
      icon: <HiChatBubbleLeftRight />,
      heading: "Chat on us",
      description: "Our friendly team is here to help ",
      details: "dezykumari8969@gmail.com | email address",
    },
    {
      id: 2,
      icon: <BsGlobeCentralSouthAsia />,
      heading: "Visit us",
      description: "Come and say hello at our office HQ.",
      details: "Bhagalpur ,Bihar | address",
    },
    {
      id: 3,
      icon: <FaPhone />,
      heading: "Call us",
      description: "Mon - Fri From 8am to 5pm",
      details: "+123 456 7890",
    },
  ];

  return (
    <div className="flex flex-col gap-6 rounded-xl bg-richblack-800 p-4 lg:p-6">
      {contactDetails.map((element) => {
        return (
          <div className="flex flex-col gap-[2px] p-3 text-sm text-richblack-200 mb-2">
            <div key={element.id} className="flex flex-row items-center gap-3">
              <div >{element.icon}</div>
              <div className="text-lg font-semibold text-richblack-5 w-[70%]">{element.heading}</div>
            </div>
            <p className="font-medium">{element.description}</p>
            <p className="font-semibold">{element.details}</p>
          </div>
        );
      })}
    </div>
  );
};
