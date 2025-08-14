import { useEffect, useRef } from "react";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";

export default function GameCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);

    // Camera
    const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 10, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Light
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // Ground
    MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, scene);

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener("resize", () => engine.resize());

    return () => {
      engine.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100vh", display: "block" }} />;
}
