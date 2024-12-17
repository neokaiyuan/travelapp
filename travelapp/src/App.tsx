import { useState } from "react";
import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import "./App.css";

interface Message {
  role: string;
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      const userMessage = { role: "user", content: inputMessage };

      setMessages((prev) => [...prev, userMessage]);
      setInputMessage("");
      setIsLoading(true);

      try {
        const response = await fetch(
          "https://lmptepslcpnzbdcbkmqd.supabase.co/functions/v1/chat-completion",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ messages: [...messages, userMessage] }),
          }
        );

        const data = await response.json();
        const assistantMessage = {
          role: "assistant",
          content: data.message || "Sorry, I couldn't process that.",
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error("Error:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, there was an error processing your request.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="app-container">
      {/* Left Column - Chat Interface */}
      <div className="chat-container">
        <div className="messages-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-bubble ${
                message.role === "user" ? "user-message" : "assistant-message"
              }`}
            >
              {message.content}
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
          />
          <button type="submit" className="chat-submit">
            Send
          </button>
        </form>
      </div>

      {/* Right Column - Google Maps */}
      <div className="map-container">
        <APIProvider
          // TODO: PUT THIS API KEY IN ENV VAR
          apiKey={"AIzaSyAmAyHdcxPjsykcrat-o77--fU7n30usiM"}
          onLoad={() => console.log("Maps API has loaded.")}
        >
          <Map
            defaultZoom={13}
            defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
            onCameraChanged={(ev: MapCameraChangedEvent) =>
              console.log(
                "camera changed:",
                ev.detail.center,
                "zoom:",
                ev.detail.zoom
              )
            }
          />
        </APIProvider>
      </div>
    </div>
  );
}

export default App;
