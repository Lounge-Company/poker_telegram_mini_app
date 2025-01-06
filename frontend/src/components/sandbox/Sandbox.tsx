import ChatRoom from "../ChatRoom/ChatRoom";

const Sandbox = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        alignItems: "center",
        display: "flex"
      }}
    >
      <div
        style={{
          width: "400px",
          height: "500px",
          margin: "0 auto"
        }}
      >
        <ChatRoom />
      </div>
    </div>
  );
};

export default Sandbox;
