import Game from "./components/Game/Game";
import { useState } from "react";
import HighScore from "./components/HighScore/HighScore";

export default function App() {
  const [isGameOver, setIsGameOver] = useState(false);

  function onDie(score) {
    setIsGameOver(true);
  }

  return (
    <>
      <Game onDie={onDie} />
      {isGameOver && <HighScore />}
    </>
  );
}
