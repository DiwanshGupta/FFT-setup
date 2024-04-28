import { FC } from "react";

type props = {
  link: string;
  topic: string;
};

const DisplayVideo: FC<props> = ({ link, topic }) => {
  return (
    <>
      <div className=" mt-16 mx-10">
        <h1 className="text-3xl mb-8">You are watching : {topic}</h1>
        <div className="rounded-xl">
          <iframe
            src={link}
            width="700"
            height="400"
            title="Embedded Video"
            className=" rounded-lg border-4"
          ></iframe>
        </div>
      </div>
    </>
  );
};
export default DisplayVideo;
