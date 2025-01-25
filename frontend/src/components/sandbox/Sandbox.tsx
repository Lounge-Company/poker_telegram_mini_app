import PokerRoom from "../PokerRoom/PokerRoom";
import Seat from "../PokerRoom/Seat";

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
