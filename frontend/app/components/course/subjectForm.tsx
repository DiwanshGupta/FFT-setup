import { FC, useState } from "react";

type Props = {};

const subjectform: FC<Props> = (Props) => {
  const [showAddSubjectForm, setShowAddSubjectForm] = useState(false);
  const handleCreateSubject = () => {};

  return (
    <section className="w-full h-screen">
      <div className="w-full h-screen relative bg-gray-900 border "></div>
      <div className=" absolute top-0 right-0.5 left-0.5 flex item-center justify-center my-64 border max-w-2xl mx-auto rounded-md bg-gray-300/90">
        <div className="py-4 opacity-100">
          <span className="text-4xl underline underline-offset-4">
            Add New subject
          </span>
          <form className="mt-8">
            <label>
              <span className="text-xl">
                Subject Name
                <br />
              </span>
              <input type="text" className="px-1 py-1 my-1 w-full rounded-md" />
            </label>
            <label>
              <span className="text-xl">
                Total Units
                <br />
              </span>
              <input
                type="number"
                className="px-1 py-1 my-1 w-full rounded-md"
              />
            </label>
            <label>
              <span className="text-xl">
                Language
                <br />
              </span>
              <input type="text" className="px-1 py-1 my-1 w-full rounded-md" />
            </label>
            <label>
              <span className="text-xl">
                Image
                <br />
              </span>
              <input type="file" className="px-1 py-1 my-1 w-full rounded-md" />
            </label>
            <div className="flex items-center mt-8">
              <button
                className="border border-yellow-600 px-2 py-1 mx-1 rounded-md bg-[#FEAF05] hover:bg-transparent hover:text-black shadow-xl"
                onClick={handleCreateSubject}
              >
                Create
              </button>
              <button
                className="border border-yellow-600 px-2 py-1 mx-1 rounded-md bg-[#FEAF05] hover:bg-transparent hover:text-black shadow-xl"
                onClick={() => {
                  setShowAddSubjectForm(false);
                }}
              >
                Cancle
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default subjectform;
