import React from "react";
import { RxHamburgerMenu } from "react-icons/rx";

const SideBar = ({
  model,
  setModel,
  showSidebar,
  setShowSidebar,
  setMessages,
}) => {
  return (
    <>
      <div className="md:hidden p-4 bg-[#434343] shadow">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="text-white text-2xl"
        >
          <RxHamburgerMenu />
        </button>
      </div>

      <div
        className={`${
          showSidebar ? "block" : "hidden"
        } md:block w-full md:w-1/4 bg-[#242424] border-r p-4 flex flex-col border-none`}
      >
        <h2 className="text-xl font-semibold mb-4">Chat Configuration</h2>
        <br />
        <label className="text-sm font-medium mb-1">Select your model</label>
        <br />
        <select
          className="p-2 border rounded-md w-full bg-[#434343] text-white border-none outline-none mt-3 mb-3"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="gpt-4o">GPT-4o</option>
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-4-turbo" default>
            GPT-4 Turbo
          </option>
          <option value="gpt-4.1">GPT-4.1</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        </select>
        <button
          className="p-3 mt-5 bg-[#434343] text-white rounded-md cursor-pointer "
          onClick={() => setMessages([])}
        >
          Clear Chat
        </button>
      </div>
    </>
  );
};

export default SideBar;
