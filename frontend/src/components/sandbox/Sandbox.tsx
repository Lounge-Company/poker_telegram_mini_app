import PokerRoom from "../PokerRoom/PokerRoom";

const Sandbox = () => {
  return (
    <div
      className={
        "flex w-full h-full max-w-full max-h-full items-center justify-center"
      }
      style={{
        height: "100vh"
      }}
    >
      <div
        style={{
          width: "500px",
          height: "700px",
          margin: "0 auto"
          // border: "1px solid #ccc"
        }}
      >
        {<PokerRoom />}
      </div>
    </div>
  );
};

export default Sandbox;
