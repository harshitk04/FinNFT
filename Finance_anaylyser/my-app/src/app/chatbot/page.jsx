'use client'
import { useState } from "react";
import axios from "axios";
import { Send } from "lucide-react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: "user", text: input };
    setMessages([...messages, userMessage]);

    try {
      const { data } = await axios.post("http://localhost:8000/query/", { user_query: input });
      const botMessage = { role: "bot", text: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "bot", text: "Error fetching response." }]);
    }

    setInput("");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-black">Chat with MetroBoomin</h2>

        <div className="h-96 overflow-y-auto border p-5 rounded-xl mb-6 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 p-3 rounded-xl text-lg ${
                msg.role === "user" 
                  ? "bg-blue-300 text-black self-end"   // User message
                  : "bg-white text-black self-start" // Bot message
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 border px-5 py-3 rounded-l-xl focus:outline-none text-lg text-black"
          />
          <button onClick={handleSendMessage} className="bg-blue-500 text-black px-6 py-3 rounded-r-xl hover:bg-blue-600 transition-all">
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
