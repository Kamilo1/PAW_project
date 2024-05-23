import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import { mockUsers } from './main';

const app = express();
app.use(bodyParser.json());

const JWT_SECRET = 'your_jwt_secret';
const JWT_EXPIRATION = '15m';
const REFRESH_TOKEN_SECRET = 'your_refresh_token_secret';
const REFRESH_TOKEN_EXPIRATION = '7d';

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

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
