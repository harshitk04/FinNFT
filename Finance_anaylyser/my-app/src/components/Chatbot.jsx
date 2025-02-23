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
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-2xl font-semibold text-center mb-4">Chat with MetroBoomin</h2>

        <div className="h-96 overflow-y-auto border p-4 rounded-lg mb-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 p-2 rounded-lg ${msg.role === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black self-start"}`}>
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
            className="flex-1 border px-4 py-2 rounded-l-lg focus:outline-none"
          />
          <button onClick={handleSendMessage} className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
