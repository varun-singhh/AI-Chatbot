import React from "react";
import { IoSparklesOutline } from "react-icons/io5";

const InputBar = ({ input, onChange, handleSend, loading }) => {
  return (
    <div className="flex flex-row justify-between rounded-2xl bg-[#434343] m-3">
      <input
        className="flex-1 border p-4 rounded-2xl bg-[#434343] border-none text-white outline-none pointer-events-auto"
        placeholder="Ask Anything"
        value={input}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        disabled={loading}
      />
      <button
        onClick={handleSend}
        disabled={loading}
        className="bg-white text-black p-2 rounded-3xl hover:bg-gray-100 disabled:opacity-50 m-3 cursor-pointer"
      >
        <IoSparklesOutline />
      </button>
    </div>
  );
};

export default InputBar;
