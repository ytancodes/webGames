import React, { useEffect, useState } from "react";
import "./SnakeGame.css";

const gridSize = 20;
const snakeSpeed = 200;

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState("right");
  const [gameRunning, setGameRunning] = useState(false);

  useEffect(() => {
    if (!gameRunning) return;

    const handleKeyPress = (event) => {
      switch (event.key) {
        case "ArrowUp":
          setDirection("up");
          break;
        case "ArrowDown":
          setDirection("down");
          break;
        case "ArrowLeft":
          setDirection("left");
          break;
        case "ArrowRight":
          setDirection("right");
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    const gameInterval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        let head = { ...newSnake[0] };

        switch (direction) {
          case "up":
            head.y -= 1;
            break;
          case "down":
            head.y += 1;
            break;
          case "left":
            head.x -= 1;
            break;
          case "right":
            head.x += 1;
            break;
        }

        if (head.x < 0) head.x = 19;
        if (head.x > 19) head.x = 0;
        if (head.y < 0) head.y = 19;
        if (head.y > 19) head.y = 0;

        for (let i = 1; i < newSnake.length; i++) {
          if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
            clearInterval(gameInterval);
            alert("Game over!");
            setGameRunning(false);
            return prevSnake;
          }
        }

        newSnake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 20),
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, snakeSpeed);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      clearInterval(gameInterval);
    };
  }, [gameRunning, direction, food]);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection("right");
    setGameRunning(true);
  };

  return (
    <div className="game-container">
      <h1>Snake Game</h1>
      <div className="game-board">
        {snake.map((segment, index) => (
          <div
            key={index}
            className="snake-segment"
            style={{ left: segment.x * gridSize, top: segment.y * gridSize }}
          ></div>
        ))}
        <div
          className="food"
          style={{ left: food.x * gridSize, top: food.y * gridSize }}
        ></div>
      </div>
      <button onClick={startGame}>Reset Game</button>
    </div>
  );
};

export default SnakeGame;
