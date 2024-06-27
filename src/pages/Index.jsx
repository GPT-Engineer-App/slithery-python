import React, { useState, useEffect, useRef } from "react";

const canvasWidth = 600;
const canvasHeight = 400;
const snakeSize = 10;
const initialSnake = [
  { x: 50, y: 50 },
  { x: 40, y: 50 },
  { x: 30, y: 50 },
];
const initialFood = { x: 80, y: 50 };

const Index = () => {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(initialFood);
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        switch (direction) {
          case "UP":
            head.y -= snakeSize;
            break;
          case "DOWN":
            head.y += snakeSize;
            break;
          case "LEFT":
            head.x -= snakeSize;
            break;
          case "RIGHT":
            head.x += snakeSize;
            break;
          default:
            break;
        }

        newSnake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
          setFood({
            x: Math.floor((Math.random() * canvasWidth) / snakeSize) * snakeSize,
            y: Math.floor((Math.random() * canvasHeight) / snakeSize) * snakeSize,
          });
        } else {
          newSnake.pop();
        }

        if (
          head.x < 0 ||
          head.x >= canvasWidth ||
          head.y < 0 ||
          head.y >= canvasHeight ||
          newSnake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
        ) {
          setGameOver(true);
          clearInterval(interval);
        }

        return newSnake;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = "green";
    snake.forEach((segment) => {
      ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
    });

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
  }, [snake, food]);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div>
        <h1 className="text-3xl text-center">Snake Game</h1>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="border border-black"
        />
        {gameOver && <p className="text-center text-red-500">Game Over</p>}
      </div>
    </div>
  );
};

export default Index;