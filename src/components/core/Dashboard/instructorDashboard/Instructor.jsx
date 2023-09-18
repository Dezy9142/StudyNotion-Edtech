import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getInstructorData } from "../../../../services/operations/ProfileAPI";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import { Link } from "react-router-dom";
import InstructorChart from "./InstructorChart";

const Instructor = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const [instructorData, setInstructorData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getCourseDataWithStats = async () => {
      setLoading(true);
      const instructorDataApi = await getInstructorData(token);
      const result = await fetchInstructorCourses(token);
      console.log("INSTRUCTOR API DATA", instructorDataApi);
      if (instructorDataApi.length) {
        setInstructorData(instructorDataApi);
      }
      if (result) {
        setCourses(result);
      }
      console.log("RESULT", result);
      setLoading(false);
    };
    getCourseDataWithStats();
  }, []);

  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  );

  const totalStudents = instructorData?.reduce(
    (acc, curr) => acc + curr.totalStudentsEnrolled,
    0
  );
  console.log("instructor DATA", instructorData);
  console.log("Printing Courses", courses);

  return (
    <div className="text-white">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-richblack-5">
          Hi {user?.firstName} 👋
        </h1>
        <p className="font-medium text-richblack-200">
          Let's Start something new
        </p>
      </div>
      {loading ? (
        <div className="spinner"></div>
      ) : courses.length > 0 ? (
        <div>
          <div>
            <div className="my-4 flex h-[450px] space-x-4">
              <InstructorChart courses={instructorData} />
              <div className="flex min-w-[250px] flex-col rounded-md bg-richblack-800 p-6">
                <p className="text-lg font-bold text-richblack-5">Statatics</p>
                <div>
                  <p className="text-lg text-richblack-200">Total Courses</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    {courses.length}
                  </p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Total Students</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    {totalStudents}
                  </p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Total Income</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    Rs. {totalAmount}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Render 3 courses */}
          <div className="rounded-md bg-richblack-800 p-6">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-richblack-5">Your Courses</p>
              <Link to={"/dashboard/my-courses"}>
                <p className="text-xs font-semibold text-yellow-50">View all</p>
              </Link>
            </div>
            <div className="my-4 flex items-start space-x-6">
              {courses.slice(0, 3).map((course) => (
                <div key={course._id} className="w-1/3">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-[201px] w-full rounded-md object-cover"
                  />
                  <div className="mt-3 w-full">
                    <p className="text-sm font-medium text-richblack-50">
                      {course.courseName}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      <p className="text-xs font-medium text-richblack-300">
                        {course.studentsEnrolled.length}
                      </p>
                      <p className="text-xs font-medium text-richblack-300">
                        |
                      </p>
                      <p className="text-xs font-medium text-richblack-300">
                        Rs {course.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
          <p className="text-center text-2xl font-bold text-richblack-5">
            You have not created course any yet
          </p>
          <Link to={"/dashboard/add-course"}>Create a course</Link>
        </div>
      )}
    </div>
  );
};

export default Instructor;
