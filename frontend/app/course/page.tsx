"use client";
// import AddSubjectForm from "@/app/components/AddDataForm";
import { FC, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { useSelector } from "react-redux";
import SubjectCard from "../components/course/subject";
import userAuth from "../hooks/userAuth";
import {
  useGetCourseQuery,
  useGetfreeCourseQuery,
} from "@/redux/features/courses/courseApi";
import Link from "next/link";

type Props = {};

const Subject: FC<Props> = (Props) => {
  const isloggedIn = userAuth();
  const { data, error } = useGetfreeCourseQuery({});
  console.log(data);
  return (
    <>
      <section className="py-8 w-full  mt-[11vh] md:mt-[106px] lg:mt-[90px]">
        {/**up */}
        <div className="flex items-center justify-center max-w-3xl mx-auto my-4 pb-12">
          <h1 className="text-4xl text-yellow-500">
            What Would You Like To Learn Today?
          </h1>
        </div>
        {/* <div className="flex max-w-6xl mx-auto ">
          <div className="flex flex-col md:flex-row items-center justify-between w-full mb-8">
            <div className="flex flex-col md:flex-row">
              <div className=" mx-2 my-2">
                <h1 className="text-xl text-yellow-500">Categories</h1>
                <input type="text" className="rounded-md py-1 px-4" />
              </div>
              <div className="mx-2 my-2">
                <h1 className="text-xl text-yellow-500">Language</h1>
                <input type="text" className="rounded-md py-1 px-4" />
              </div>
              <button className=" h-10 px-2 mx-2 my-2 md:mt-8 border rounded-lg text-xl text-yellow-500">
                Search
              </button>
            </div>
          </div>
        </div> */}
        {/**down */}
        <div className="flex items-center justify-center my-4">
          <div>
            {/**Cards */}
            {isloggedIn ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 items-center justify-between">
                {data?.course?.map((course: any, index: number) => (
                  <Link href={`/course/${course._id}`}>
                    <SubjectCard
                      key={index}
                      img={course.thumbnail}
                      subjectName={course.name}
                      language={"English"} // Assuming language is constant for all subjects
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid blur-md grid-cols-1 md:grid-cols-3 lg:grid-cols-4 items-center justify-between">
                <SubjectCard
                  img={"sad.png"}
                  subjectName={"No subject for you"}
                  language={"Please log in"}
                />
                <SubjectCard
                  img={"sad.png"}
                  subjectName={"No subject for you"}
                  language={"Please log in"}
                />{" "}
                <SubjectCard
                  img={"sad.png"}
                  subjectName={"No subject for you"}
                  language={"Please log in"}
                />{" "}
                <SubjectCard
                  img={"sad.png"}
                  subjectName={"No subject for you"}
                  language={"Please log in"}
                />{" "}
                <SubjectCard
                  img={"sad.png"}
                  subjectName={"No subject for you"}
                  language={"Please log in"}
                />{" "}
                <SubjectCard
                  img={"sad.png"}
                  subjectName={"No subject for you"}
                  language={"Please log in"}
                />{" "}
                <SubjectCard
                  img={"sad.png"}
                  subjectName={"No subject for you"}
                  language={"Please log in"}
                />{" "}
                <SubjectCard
                  img={"sad.png"}
                  subjectName={"No subject for you"}
                  language={"Please log in"}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
export default Subject;
