import React, { useEffect, useRef, useState } from "react";
import { Layout, ConfigProvider } from "antd";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Client, Room } from "colyseus.js";
const { Content } = Layout;

interface Message {
  username: string;
  message: string;
}

const ChatRoom = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const [room, setRoom] = useState<Room | null>(null);

  // // Инициализация сообщений
  // useEffect(() => {
  //   setMessages([
  //     { username: "Nataly", message: "How are you doing guys?" },
  //     { username: "Kertis", message: "Nothing special babe<3" },
  //     { username: "Clay", message: "Hey stop flirting here!" }
  //   ]);
  // }, []);

  // Прокрутка вниз при добавлении нового сообщения
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createMessage = (username: string, message: string): Message => {
    const newMessage: Message = { username, message };
    return newMessage;
  };

  useEffect(() => {
    const connectToRoom = async () => {
      const client = new Client("ws://localhost:2567");

      try {
        const joinedRoom = await client.joinOrCreate("my_room");
        setRoom(joinedRoom);

        // Listen for messages from the server
        joinedRoom.onMessage("message", (message) => {
          const transformedMessage = createMessage(
            message.playerName,
            message.message
          );

          setMessages((prevMessages) => [...prevMessages, transformedMessage]);
          console.log("Received message:", transformedMessage);
        });

        console.log("Joined room successfully:", joinedRoom);
      } catch (error) {
        console.error("Failed to join room:", error);
      }
    };

    connectToRoom();

    // Cleanup on component unmount
    return () => {
      if (room) {
        room.leave();
      }
    };
  }, []);

  const handleMessageSend = (newMessage: string) => {
    room?.send("message", newMessage);
    // setMessages([...messages, { username: "Anonymous", message: newMessage }]);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgBase: "#1f1f1f",
          colorTextBase: "#ffffff",
          colorPrimary: "#1890ff",
          borderRadius: 8
        }
      }}
    >
      <Layout
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          border: "1px solid #3a3a3a",
          borderRadius: "8px",
          overflow: "hidden",
          background: "#1f1f1f" // Тёмный фон
        }}
      >
        {/* Контент с прокруткой для сообщений */}
        <Content
          style={{
            flex: 1,
            overflowY: "scroll",
            padding: "16px",
            background: "#141414" // Тёмный фон контента
          }}
        >
          <MessageList messages={messages} />
          <div ref={messageEndRef} />
        </Content>

        {/* Ввод сообщения */}
        <div
          style={{
            padding: "16px",
            background: "#1f1f1f", // Тёмный фон нижней панели
            borderTop: "1px solid #3a3a3a"
          }}
        >
          <MessageInput onSendMessage={handleMessageSend} />
        </div>
      </Layout>
    </ConfigProvider>
  );
};

export default ChatRoom;
