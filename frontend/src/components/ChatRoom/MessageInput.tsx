import { Button, Input } from "antd";
import { useState } from "react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const handleMessage = () => {
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  };
  return (
    <div style={{ display: "flex", marginTop: "10px", gap: "20px" }}>
      <Input
        placeholder="Enter your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onPressEnter={handleMessage}
        style={{
          background: "#262626", // Тёмный фон поля ввода
          color: "#ffffff", // Белый текст
          borderColor: "#3a3a3a"
        }}
      />
      <Button
        // type="primary"
        onClick={handleMessage}
        style={{ background: "#262626", borderColor: "#262626" }}
      >
        Send
      </Button>
    </div>
  );
};

export default MessageInput;
