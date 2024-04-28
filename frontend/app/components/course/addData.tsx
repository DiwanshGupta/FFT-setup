export const AddTopicForm = () => {
  return (
    <>
      <div className="py-4">
        <span className="text-3xl font-bold">Add New Topic</span>
        <form className="mt-8">
          <label>
            <span className="text-xl">
              Topic Name
              <br />
            </span>
            <input type="text" className="px-1 py-1 my-1 w-full rounded-md" />
          </label>
          <label>
            <span className="text-xl">
              videoLink
              <br />
            </span>
            <input type="text" className="px-1 py-1 my-1 w-full rounded-md" />
          </label>
          <label>
            <span className="text-xl">
              Notes
              <br />
            </span>
            <input type="file" className="px-1 py-1 my-1 w-full rounded-md" />
          </label>
          <label>
            <span className="text-xl">
              mustDo
              <br />
            </span>
            <input type="text" className="px-1 py-1 my-1 w-full rounded-md" />
          </label>
          <label>
            <span className="text-xl">
              mostRepeated
              <br />
            </span>
            <input type="text" className="px-1 py-1 my-1 w-full rounded-md" />
          </label>
        </form>
      </div>
    </>
  );
};
