import React, { useEffect, useMemo, useRef } from 'react';
import clouds from './clouds.png';
import mario from './mario.gif';
import marioDead from './game-over.png';
import pipe from './pipe.png';
import './App.css';

export default function App() {
  const [isJumping, setIsJumping] = React.useState(false);
  const [isDead, setIsDead] = React.useState(false);

  const marioRef = useRef<HTMLImageElement>(null);
  const pipeRef = useRef<HTMLImageElement>(null);

  document.body.onkeydown = () => {
    if (isDead) {
      window.location.reload();

      return;
    }

    setIsJumping(true);

    setTimeout(() => {
      setIsJumping(false);
    }, 700);
  };

  // Check if app__pipe position is at the same value as mario
  const isMarioAtPipe = () => {
    const mario = marioRef.current;
    const pipe = pipeRef.current;

    if (!mario) {
      return;
    }

    if (!pipe) {
      return;
    }

    return mario.offsetTop + mario.offsetHeight > pipe.offsetTop
      && pipe.offsetLeft > mario.offsetLeft
      && pipe.offsetLeft < mario.offsetLeft + mario.offsetWidth;
  };

  useEffect(() => {
    setInterval(() => {
      if (isMarioAtPipe()) {
        marioRef.current!.style.top = marioRef.current!.offsetTop + 'px';
        setIsDead(true);
      }
    }, 10);
  }, []);

  const marioImage = useMemo(() => {
    return isDead ? marioDead : mario;
  }, [isDead]);

  const marioClass = 'app__mario' + (isJumping ? ' app__mario--jump' : '');

  const stopAnimation = useMemo(() => {
    return isDead ? 'stop-animation' : '';
  }, [isDead]);

  return (
    <div className="app">
      <img className="app__clouds" src={ clouds } alt="Clouds"/>

      <img ref={ marioRef } className={ `${ marioClass } ${ stopAnimation }` } src={ marioImage } alt="Mario"/>

      <div className="app__floor"/>

      <img ref={ pipeRef } className={ `app__pipe ${ stopAnimation }` } src={ pipe } alt="Pipe"/>
    </div>
  );
}
