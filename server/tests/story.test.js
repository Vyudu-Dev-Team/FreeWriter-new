import request from 'supertest';
import app from '../server.js';
import Story from '../models/Story.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
  const user = await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  });
  token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Story API', () => {
  beforeEach(async () => {
    await Story.deleteMany({});
  });

  test('Should create a new story', async () => {
    const res = await request(app)
      .post('/api/stories')
      .set('x-auth-token', token)
      .send({
        title: 'Test Story',
        writingMode: 'Plotter'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title', 'Test Story');
  });

  test('Should not create a story with invalid input', async () => {
    const res = await request(app)
      .post('/api/stories')
      .set('x-auth-token', token)
      .send({
        title: '',
        writingMode: 'InvalidMode'
      });
    expect(res.statusCode).toEqual(400);
  });

  // ... more tests for other story-related endpoints
});