import React, { useState, useRef, useEffect } from "react";
import { MdContentCopy, MdCheck } from "react-icons/md";
import { chatEndpoint, headers, POST } from "./utils/constants";
import InputBar from "./components/InputBar";
import SideBar from "./components/SideBar";
import { IoSparklesOutline } from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default function ChatApp() {
  const [userId, setUserId] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([] as Message[]);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("gpt-4o");
  const [showSidebar, setShowSidebar] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const bottomRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { sender: "user", text: input };
    const loadingMsg: Message = {
      sender: "assistant",
      text: "...",
      loading: true,
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(chatEndpoint, {
        method: POST,
        headers: headers,
        body: JSON.stringify({
          userId: userId,
          userMessage: input,
          model,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const botReply: Message = {
          sender: "assistant",
          text: data.assistantMessage,
        };
        if (data.userId) {
          setUserId(data.userId);
          localStorage.setItem("userId", data.userId);
        }
        setMessages((prev) => [...prev.slice(0, -1), botReply]);
      } else {
        console.error("Error from server:", data.error);
        const errorReply: Message = {
          sender: "assistant",
          text: "Oops! Something went wrong. Please try again.",
        };
        setMessages((prev) => [...prev.slice(0, -1), errorReply]);
      }
    } catch (error) {
      console.error("Request failed:", error);
      const errorReply: Message = {
        sender: "assistant",
        text: "Unable to connect to the server.",
      };
      setMessages((prev) => [...prev.slice(0, -1), errorReply]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#181717] text-white w-full">
      <SideBar
        model={model}
        setModel={setModel}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        setMessages={setMessages}
      />

      <div className="flex-1 flex flex-col justify-between bg-[#292929] text-white w-full">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-wrap">
              <span className="text-5xl font-bold text-center">
                Hello! Welcome to Hazel
              </span>
              <br />
              <span className="text-xl mb-4 font-thin">
                I'm Lara, How may I help you?
              </span>

              <div className="flex flex-row justify-between rounded-2xl bg-[#434343] mt-6 w-4/5">
                <input
                  className="flex-1 border p-6 rounded-2xl bg-[#434343] border-none text-white outline-none pointer-events-auto"
                  placeholder="Ask Anything"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={loading}
                />
                <button
                  onClick={handleSend}
                  disabled={loading}
                  className="bg-white text-black p-2 rounded-3xl hover:bg-gray-100 disabled:opacity-50 md:m-6 cursor-pointer -ml-10 mt-5 mr-5 mb-5"
                >
                  <IoSparklesOutline />
                </button>
              </div>
            </div>
          )}
          {messages.length > 0 && (
            <>
              <p className="text-center text-white text-sm">
                You are now speaking to <strong>Lara, </strong>Hazel's Ai
                Assistant.
              </p>
              {messages.map((msg, idx) => (
                <div key={idx} className="flex">
                  <div
                    className={`max-w-xl px-4 py-3 rounded-3xl ${
                      msg.sender === "user"
                        ? "ml-auto bg-[#434343] text-white"
                        : "mr-auto  text-white"
                    }`}
                  >
                    {msg.loading ? (
                      <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0s]" />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </span>
                    ) : (
                      <>
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                          {msg.text}
                        </ReactMarkdown>
                        <div className="mt-1 flex gap-2 text-xs text-gray-500">
                          {msg.sender === "assistant" && (
                            <button
                              onClick={() => handleCopy(msg.text, idx)}
                              className="underline"
                            >
                              {copiedIndex === idx ? (
                                <MdCheck />
                              ) : (
                                <MdContentCopy />
                              )}
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {messages.length > 0 && (
          <InputBar
            input={input}
            onChange={setInput}
            handleSend={handleSend}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
