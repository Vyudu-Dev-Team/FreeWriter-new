import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import { DEFAULT_PREFERENCES } from '../services/preferencesService.js';

let server;

describe('User Controller', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    server = app.listen(0); // Use a random available port
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Profile.deleteMany({});
  });

  describe('User Registration and Authentication', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          writingMode: 'plotter'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toBe('User created. Please check your email to verify your account.');
      
      const user = await User.findOne({ email: 'test@example.com' });
      expect(user).toBeTruthy();
      expect(user.emailVerified).toBe(false);

      const profile = await Profile.findOne({ user: user._id });
      expect(profile).toBeTruthy();
    });

    it('should not register a user with existing email', async () => {
      await User.create({
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123'
      });

      const res = await request(app)
        .post('/api/users/register')
        .send({
          username: 'newuser',
          email: 'existing@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Email or username already exists');
    });

    it('should login a user with correct credentials', async () => {
      const user = await User.create({
        username: 'loginuser',
        email: 'login@example.com',
        password: 'password123',
        emailVerified: true
      });

      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.data.user.email).toBe('login@example.com');
    });

    it('should not login with incorrect password', async () => {
      await User.create({
        username: 'wrongpassuser',
        email: 'wrong@example.com',
        password: 'password123',
        emailVerified: true
      });

      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Incorrect email or password');
    });

    it('should not login if email is not verified', async () => {
      await User.create({
        username: 'unverifieduser',
        email: 'unverified@example.com',
        password: 'password123',
        emailVerified: false
      });

      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'unverified@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Please verify your email before logging in');
    });
  });

  describe('User Profile Management', () => {
    let user, token;

    beforeEach(async () => {
      user = await User.create({
        username: 'profileuser',
        email: 'profile@example.com',
        password: 'password123',
        emailVerified: true
      });
      await Profile.create({ user: user._id });
      token = user.generateAuthToken();
    });

    it('should get user profile for authenticated user', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.user.username).toBe('profileuser');
      expect(res.body.data.profile).toBeDefined();
    });

    it('should update user profile', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          username: 'updateduser',
          bio: 'Updated bio',
          writingMode: 'pantser',
          goals: ['finish_novel', 'improve_skills']
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.user.username).toBe('updateduser');
      expect(res.body.data.user.writingMode).toBe('pantser');
      expect(res.body.data.user.goals).toEqual(['finish_novel', 'improve_skills']);
      expect(res.body.data.profile.bio).toBe('Updated bio');
    });

    it('should not update profile with invalid data', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          username: 'a', // Too short
          writingMode: 'invalid_mode',
          goals: ['invalid_goal']
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('User Preferences Management', () => {
    let user, token;

    beforeEach(async () => {
      user = await User.create({
        username: 'prefuser',
        email: 'pref@example.com',
        password: 'password123',
        emailVerified: true
      });
      token = user.generateAuthToken();
    });

    it('should get default user preferences', async () => {
      const res = await request(app)
        .get('/api/users/preferences')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.preferences).toEqual(DEFAULT_PREFERENCES);
    });

    it('should update user preferences', async () => {
      const newPreferences = {
        interface: { theme: 'dark', fontSize: 18 },
        writing: { autoSave: false }
      };

      const res = await request(app)
        .put('/api/users/preferences')
        .set('Authorization', `Bearer ${token}`)
        .send({ preferences: newPreferences });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.preferences.interface.theme).toBe('dark');
      expect(res.body.data.preferences.interface.fontSize).toBe(18);
      expect(res.body.data.preferences.writing.autoSave).toBe(false);
      // Check that other preferences remain default
      expect(res.body.data.preferences.writing.spellCheck).toBe(DEFAULT_PREFERENCES.writing.spellCheck);
    });

    it('should reset user preferences', async () => {
      // First, update preferences
      await request(app)
        .put('/api/users/preferences')
        .set('Authorization', `Bearer ${token}`)
        .send({
          preferences: {
            interface: { theme: 'dark' },
            writing: { autoSave: false }
          }
        });

      // Then reset
      const res = await request(app)
        .post('/api/users/preferences/reset')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toBe('Preferences reset to default');
      expect(res.body.data.preferences).toEqual(DEFAULT_PREFERENCES);
    });

    it('should not update preferences with invalid data', async () => {
      const res = await request(app)
        .put('/api/users/preferences')
        .set('Authorization', `Bearer ${token}`)
        .send({
          preferences: {
            interface: { theme: 'invalid_theme' },
            writing: { autoSave: 'not_a_boolean' }
          }
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Invalid preferences data');
    });
  });

  describe('Password Reset', () => {
    it('should send password reset email', async () => {
      await User.create({
        username: 'resetuser',
        email: 'reset@example.com',
        password: 'password123',
        emailVerified: true
      });

      const res = await request(app)
        .post('/api/users/forgotPassword')
        .send({ email: 'reset@example.com' });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toBe('Token sent to email!');
    });

    // Note: Testing actual password reset would require mocking email sending and token generation
  });
});