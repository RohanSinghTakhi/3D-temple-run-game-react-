import { useEffect, useRef, useState } from "react";
import {
  Engine,
  Scene,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  UniversalCamera,
  StandardMaterial,
  Color3
} from "@babylonjs/core";

export default function GameCanvas({ onScoreChange }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);

    // Light
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // Camera (player)
    const camera = new UniversalCamera("camera", new Vector3(0, 2, 0), scene);
    camera.attachControl(canvas, true);
    camera.speed = 0; // We control movement manually
    camera.applyGravity = false;

    // Lane variables
    let lane = 0; // -1 = left, 0 = center, 1 = right
    const laneX = [-3, 0, 3];

    // Jump/slide variables
    let verticalVelocity = 0;
    let isSliding = false;
    let slideTimer = 0;

    // Ground
    const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 2000 }, scene);
    const groundMat = new StandardMaterial("groundMat", scene);
    groundMat.diffuseColor = Color3.Green();
    ground.material = groundMat;
    ground.position.z = 1000;

    // Obstacles
    const obstacleMat = new StandardMaterial("obsMat", scene);
    obstacleMat.diffuseColor = Color3.Red();
    const obstacles = [];

    for (let i = 0; i < 50; i++) {
      const box = MeshBuilder.CreateBox("box" + i, { size: 2 }, scene);
      box.position.set(laneX[Math.floor(Math.random() * 3)], 1, i * 40 + 50);
      box.material = obstacleMat;
      obstacles.push(box);
    }

    // Input handling
    window.addEventListener("keydown", (e) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        lane = Math.max(-1, lane - 1);
      }
      if (e.code === "ArrowRight" || e.code === "KeyD") {
        lane = Math.min(1, lane + 1);
      }
      if (e.code === "Space" && camera.position.y <= 2.05) {
        verticalVelocity = 0.4; // Jump
      }
      if (e.code === "ShiftLeft" && !isSliding) {
        isSliding = true;
        slideTimer = 30; // frames
        camera.position.y = 1.2; // lower camera
      }
    });

    // Game loop
    scene.onBeforeRenderObservable.add(() => {
      // Move forward
      camera.position.z += 0.5;

      // Smooth lane move
      camera.position.x += (laneX[lane] - camera.position.x) * 0.2;

      // Jump physics
      if (verticalVelocity !== 0 || camera.position.y > 2) {
        camera.position.y += verticalVelocity;
        verticalVelocity -= 0.02; // gravity
        if (camera.position.y < 2) {
          camera.position.y = 2;
          verticalVelocity = 0;
        }
      }

      // Slide logic
      if (isSliding) {
        slideTimer--;
        if (slideTimer <= 0) {
          isSliding = false;
          camera.position.y = 2; // reset height
        }
      }

      // Collision check
      for (let obs of obstacles) {
        if (
          Math.abs(camera.position.x - obs.position.x) < 1.5 &&
          Math.abs(camera.position.z - obs.position.z) < 1.5 &&
          (!isSliding && camera.position.y <= 2.1)
        ) {
          console.log("💥 GAME OVER");
          engine.stopRenderLoop();
        }
      }

      // Score
      setScore((prev) => {
        const newScore = prev + 1;
        onScoreChange?.(newScore);
        return newScore;
      });
    });

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener("resize", () => engine.resize());

    return () => {
      engine.dispose();
    };
  }, []);

  return (
    <>
      <div style={{
        position: "absolute",
        top: 20,
        left: 20,
        color: "white",
        fontSize: "24px",
        fontFamily: "Arial"
      }}>
        Score: {score}
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100vh", display: "block" }} />
    </>
  );
}
