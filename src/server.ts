import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cors from 'cors';
import { OAuth2Client } from 'google-auth-library';

enum UserRole {
  Admin = 'admin',
  DevOps = 'devops',
  Developer = 'developer',
}

class User {
  constructor(public id: number, public name: string, public surname: string, public role: UserRole, public username: String, public password: String) {}
}
const mockUsers: User[] = [
  new User(1, 'Krzysztof', 'Kowalski', UserRole.Admin,'krzysztof','password1'),
  new User(2, 'Anna', 'Nowak', UserRole.Developer,'anna','password2'),
  new User(3, 'Jan', 'Zieliński', UserRole.DevOps,'jan','password3'),
];


const app = express();

app.use(bodyParser.json());
app.use(cors());
const JWT_SECRET = 'your_jwt_secret';
const JWT_EXPIRATION = '15m';
const REFRESH_TOKEN_SECRET = 'your_refresh_token_secret';
const REFRESH_TOKEN_EXPIRATION = '7d';
const client = new OAuth2Client('354880993064-ha62ceb9l4l6kqppg6ff0mr51l6inbq6.apps.googleusercontent.com');
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = mockUsers.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  const refreshToken = jwt.sign({ id: user.id, username: user.username }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });

  res.json({ token, refreshToken });
});

app.post('/api/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { id: number, username: string };

    const newToken = jwt.sign({ id: payload.id, username: payload.username }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});
app.post('/api/google-login', async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: '354880993064-ha62ceb9l4l6kqppg6ff0mr51l6inbq6.apps.googleusercontent.com',
    });
    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({ message: 'Invalid Google token' });
    }

    const { sub, email, name } = payload;
    let user = mockUsers.find((u) => u.username === email);

    if (!user) {
      user = new User(mockUsers.length + 1, name || '', '', UserRole.Developer, '', '');
      mockUsers.push(user);
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    const refreshToken = jwt.sign({ id: user.id, username: user.username }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });

    res.json({ token, refreshToken, username: user.username });
  } catch (error) {
    res.status(401).json({ message: 'Invalid Google token' });
  }
});
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

