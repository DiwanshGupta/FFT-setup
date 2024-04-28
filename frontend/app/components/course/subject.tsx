import Link from "next/link";
import { FC } from "react";
import { FaStar } from "react-icons/fa";
import { HiStar } from "react-icons/hi";

type Props = {
  img: string;
  subjectName: string;
  language: string;
};

const SubjectCard: FC<Props> = ({ img, subjectName, language }) => {
  return (
    <>
      <div className="relative border bg-yellow-400/50 border-yellow-500 rounded-lg shadow-lg hover:shadow-2xl mx-2 my-2">
        <div className="cursor-pointer items-center">
          <img
            src={img}
            alt="course img"
            className="h-52 w-68 rounded-lg flex m-auto"
          />
        </div>
        <div className="px-2 pt-2 pb-4">
          <h1 className="text-2xl font-bold my-2">{subjectName}</h1>
          <div className="flex items-center justify-between my-2">
            <span className="px-2 text-xl font-semibold text-black/90">
              {language}
            </span>
            <span className="px-2 text-xl text-black/90 flex items-center">
              4.5
              <HiStar />
            </span>
            <Link
              href="/pages/subjectDetail"
              className="px-2 py-2 mx-2 text-lg text-white/80 border border-yellow-600 rounded-md hover:bg-transparent bg-yellow-600 hover:shadow-lg cursor-pointer"
            >
              View details
            </Link>
          </div>
        </div>
        <span className="flex absolute items-center justify-center top-1 right-3 rounded-full px-2 py-1 bg-yellow-600">
          <FaStar />
          &nbsp;Free{" "}
        </span>
      </div>
    </>
  );
};
export default SubjectCard;
