import Message from "./Message";

interface Message {
  username: string;
  message: string;
}
interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div>
      {messages.map((msg, indx) => (
        <Message key={indx} username={msg.username} message={msg.message} />
      ))}
    </div>
  );
};

export default MessageList;
