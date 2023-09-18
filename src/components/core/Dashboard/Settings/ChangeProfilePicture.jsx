import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconBtn } from "../../../Common/IconBtn";
import { FaFileUpload } from "react-icons/fa";
import { updateDisplayPicture } from "../../../../services/operations/settingAPI";
import { useEffect } from "react";

export const ChangeProfilePicture = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);


  const dispatch = useDispatch(false);
  const [loading, setLoading] = useState(null);
  const [imageFile, setImageProfile] = useState(null);

  const [previewSource, setPreviewSource] = useState(null);

  const fileInputRef = useRef(null);

  const handleOnClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageProfile(file);
      previewFile(file);
    }
  };

  // const previewFile = (file) => {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onloadend = () => {
  //     setPreviewSource(reader.result);
  //   };
  // };
  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
        setPreviewSource(reader.result)
    }
}

  const handleFileUpload = () => {
    try {
      console.log("uploading....");
      setLoading(true);
      const formData = new FormData();
      formData.append("displayPicture", imageFile);
      dispatch(updateDisplayPicture(token, formData)).then(() => {
        setLoading(false);
        console.log("token is printing on fileupload handler", token);
      });
    } catch (error) {}
  };
  
  useEffect(() => {
    if (imageFile) {
        previewFile(imageFile)
    }
}, [imageFile])

  return (
    <>
      <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 text-richblack-5">
        <div className="flex items-center gap-x-4">
          <img
            src={previewSource || user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[78px] rounded-full object-cover"
          />
        </div>
        <div className="space-y-2">
          <p>Change Profile Picture</p>
          <div className="flex flex-row gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/gif, image/jpeg"
            />
            <button
              onClick={handleOnClick}
              disabled={loading}
              className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
            >
              select
            </button>

            <IconBtn
              text={loading ? "Uploading..." : "Upload"}
              onclick={handleFileUpload}
            >
              {!loading && (
                <FaFileUpload className="text-lg text-richblack-900" />
              )}
            </IconBtn>
          </div>
        </div>
      </div>
    </>
  );
};
