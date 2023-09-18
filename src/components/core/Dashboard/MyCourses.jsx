import React from 'react'
import { CoursesTable } from './InstructorCourses/CoursesTable'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { useEffect } from 'react'
import {VscAdd} from "react-icons/vsc"
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI'
import { IconBtn } from '../../Common/IconBtn'

function MyCourses() {
    const { token } = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const [courses, setCourses] = useState([])

    useEffect(()=>{
        const fetchCourses= async() =>{
         const result=   await fetchInstructorCourses(token)
         if (result) {
            setCourses(result)
          }
      }
      fetchCourses()
    },[])
  return (
    <div>
         <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
        <IconBtn
          text="Add Course"
          onclick={() => navigate("/dashboard/add-course")}
        >
          <VscAdd />
        </IconBtn>
      </div>
      {courses && <CoursesTable courses={courses} setCourses={setCourses} />}
    </div>
  )
}

export default MyCourses