import React, { useEffect, useRef, useState } from "react";
import clouds from "../../assets/clouds.png";
import mario from "../../assets/mario.gif";
import marioDead from "../../assets/game-over.png";
import pipe from "../../assets/pipe.png";
import "./Game.css";

export default function Game(props) {
  const [isJumping, setIsJumping] = useState(false);
  const [isDead, setIsDead] = useState(false);

  const marioRef = useRef(null);
  const pipeRef = useRef(null);

  document.body.onkeydown = () => {
    if (isDead) {
      return;
    }

    setIsJumping(true);

    setTimeout(() => {
      setIsJumping(false);
    }, 700);
  };

  // Check if pipe position is at the same value as mario
  const isMarioAtPipe = () => {
    const mario = marioRef.current;
    const pipe = pipeRef.current;

    if (!mario) {
      return;
    }

    if (!pipe) {
      return;
    }

    return (
      mario.offsetTop + mario.offsetHeight > pipe.offsetTop &&
      pipe.offsetLeft > mario.offsetLeft &&
      pipe.offsetLeft < mario.offsetLeft + mario.offsetWidth
    );
  };

  function die() {
    if (isDead) {
      return;
    }

    const score = 90;
    props.onDie(score);

    setIsDead(true);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (isMarioAtPipe()) {
        marioRef.current.style.top = marioRef.current.offsetTop + "px";
        die();
      }
    }, 10);

    return () => clearInterval(interval);
  }, []);

  const marioImage = isDead ? marioDead : mario;

  const marioClass = "mario" + (isJumping ? " mario--jump" : "");

  const stopAnimation = isDead ? "stop-animation" : "";

  return (
    <div className="game">
      <img className="clouds" src={clouds} alt="Clouds" />

      <img
        ref={marioRef}
        className={`${marioClass} ${stopAnimation}`}
        src={marioImage}
        alt="Mario"
      />

      <div className="floor" />

      <img
        ref={pipeRef}
        className={`pipe ${stopAnimation}`}
        src={pipe}
        alt="Pipe"
      />
    </div>
  );
}
