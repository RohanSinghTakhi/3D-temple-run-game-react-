import React from 'react';

const Leaderboard = () => {
    const scores = [
        { player: 'Player1', score: 1000 },
        { player: 'Player2', score: 800 },
        { player: 'Player3', score: 600 },
        { player: 'Player4', score: 400 },
        { player: 'Player5', score: 200 },
    ];

    return (
        <div>
            <h1>Leaderboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {scores.map((entry, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{entry.player}</td>
                            <td>{entry.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;