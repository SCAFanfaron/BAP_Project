document.addEventListener('DOMContentLoaded', () => {
    displayLeaderboard();
});

function displayLeaderboard() {
    const users = JSON.parse(localStorage.getItem('tetris_users')) || [];
    const scores = [];
    
    // Collect all scores
    users.forEach(user => {
        user.scores.forEach(score => {
            scores.push({
                username: user.username,
                score: score.score,
                date: score.date
            });
        });
    });
    
    // Sort by score (descending)
    scores.sort((a, b) => b.score - a.score);
    
    // Display top scores
    const leaderboard = document.querySelector('#leaderboard tbody');
    leaderboard.innerHTML = scores.slice(0, 10).map((entry, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${entry.username}</td>
            <td>${entry.score}</td>
            <td>${new Date(entry.date).toLocaleDateString()}</td>
        </tr>
    `).join('');
}