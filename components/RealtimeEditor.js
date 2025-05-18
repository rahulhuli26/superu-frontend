import { useEffect, useState } from "react";
import socket from "../utils/socket";
import TiptapEditor from "./TiptapEditor";

export default function RealtimeEditor({ roomId }) {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    socket.emit("join-room", roomId);

    socket.on("load-content", (json) => {
      setContent(json);
    });

    socket.on("receive-content", (json) => {
      setContent(json);
    });

    return () => {
      socket.off("load-content");
      socket.off("receive-content");
    };
  }, [roomId]);

  const handleUpdate = (newHtml) => {
    setContent(newHtml);
    socket.emit("update-content", { roomId, json: newHtml });

    // Optional: Save to backend here or debounce
    setSaving(true);
    // call api.put(...) here
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <TiptapEditor content={content} onUpdate={handleUpdate} saving={saving} />
  );
}
