import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Temple Run FPS</h1>
      <Link to="/game">Start Game</Link>
      <br />
      <Link to="/leaderboard">Leaderboard</Link>
    </div>
  );
}
