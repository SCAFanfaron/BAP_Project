// User management
const users = JSON.parse(localStorage.getItem('tetris_users')) || [];

function register(username, password) {
    if (users.some(u => u.username === username)) {
        return false;
    }
    users.push({ username, password, scores: [] });
    localStorage.setItem('tetris_users', JSON.stringify(users));
    return true;
}

function login(username, password) {
    const user = users.find(u => u.username === username && u.password === password);
    return user ? { username: user.username } : null;
}

function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('current_user'));
}

function logout() {
    sessionStorage.removeItem('current_user');
}

// Save score for current user
function saveScore(score) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const users = JSON.parse(localStorage.getItem('tetris_users'));
    const userIndex = users.findIndex(u => u.username === user.username);
    
    if (userIndex !== -1) {
        users[userIndex].scores.push({
            score,
            date: new Date().toISOString()
        });
        localStorage.setItem('tetris_users', JSON.stringify(users));
        return true;
    }
    return false;
}