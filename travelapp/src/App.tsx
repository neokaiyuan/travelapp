import { useState } from "react";
import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import "./App.css";

interface Message {
  role: string;
  content: string;
}

type Poi = { key: string; location: google.maps.LatLngLiteral };
const PoiMarkers = (props: { pois: Poi[] }) => {
  return (
    <>
      {props.pois.map((poi: Poi) => (
        <AdvancedMarker key={poi.key} position={poi.location}>
          <Pin />
        </AdvancedMarker>
      ))}
    </>
  );
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<Poi[]>([]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      const userMessage = { role: "user", content: inputMessage };

      setMessages((prev) => [...prev, userMessage]);
      setInputMessage("");
      setIsLoading(true);

      try {
        const response = await fetch(import.meta.env.VITE_SUPABASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: [...messages, userMessage] }),
        });

        const data = await response.json();
        const assistantMessage = {
          role: "assistant",
          content: data.message || "Sorry, I couldn't process that.",
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Add locations to map if assistant message contains locations
        if (data.locations) {
          console.log("Adding locations to map:", data.locations);
          setLocations(JSON.parse(data.locations).locations);
        }
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
          apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          onLoad={() => console.log("Maps API has loaded.")}
        >
          <Map
            defaultZoom={13}
            defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
            mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}
            onCameraChanged={(ev: MapCameraChangedEvent) =>
              console.log(
                "camera changed:",
                ev.detail.center,
                "zoom:",
                ev.detail.zoom
              )
            }
          >
            {locations.length > 0} ? <PoiMarkers pois={locations} />
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}

export default App;
