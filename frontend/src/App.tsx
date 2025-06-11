import "./App.css";

import Sandbox from "./components/sandbox/Sandbox";
import Modal from "react-modal";

Modal.setAppElement("#root");

function App() {
  return (
    <>
      <Sandbox />
    </>
  );
}

export default App;
