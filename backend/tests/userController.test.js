import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js'; 
import User from '../models/User.js';
import Profile from '../models/Profile.js';

let server; // Declare the server variable

describe('User Controller', () => {
  beforeAll(async () => {
    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    server = app.listen(5000); // Initialize the server
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Close MongoDB connection
    await server.close(); // Close the server
  });

  beforeEach(async () => {
    // Clear the database before each test
    await User.deleteMany({});
    await Profile.deleteMany({});
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          username: 'laban',
          email: 'labantheegreat@gmail.com',
          password: 'password123',
          writingMode: 'plotter'
        });
  
      expect(res.statusCode).toBe(201);
      expect(res.body.data.user.username).toBe('laban');
      expect(res.body.data.user.email).toBe('labantheegreat@gmail.com');
      expect(res.body.token).toBeDefined();
  
      const user = await User.findOne({ email: 'labantheegreat@gmail.com' });
      expect(user).toBeTruthy();
  
      const profile = await Profile.findOne({ user: user._id });
      expect(profile).toBeTruthy();
    });
  
    it('should not register a user with existing email', async () => {
      await User.create({
        username: 'laban',
        email: 'labantheegreat@gmail.com',
        password: 'password123'
      });
  
      const res = await request(app)
        .post('/api/users/register')
        .send({
          username: 'newuser',
          email: 'labantheegreat@gmail.com',
          password: 'password123'
        });
  
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Email or username already exists');
    });
  });
  
  describe('loginUser', () => {
    it('should login a user with correct credentials', async () => {
      await User.create({
        username: 'laban',
        email: 'labantheegreat@gmail.com',
        password: 'password123'
      });
  
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'labantheegreat@gmail.com',
          password: 'password123'
        });
  
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.data.user.email).toBe('labantheegreat@gmail.com');
    });
  
    it('should not login with incorrect password', async () => {
      await User.create({
        username: 'laban',
        email: 'labantheegreat@gmail.com',
        password: 'password123'
      });
  
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'labantheegreat@gmail.com',
          password: 'wrongpassword'
        });
  
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Incorrect email or password');
    });
  });

  // describe('getUserProfile', () => {
  //   it('should get user profile for authenticated user', async () => {
  //     const user = await User.create({
  //       username: 'profileuser',
  //       email: 'profile@example.com',
  //       password: 'password123'
  //     });
  //     await Profile.create({ user: user._id });

  //     const token = user.generateAuthToken(); // Assuming you have this method in your User model

  //     const res = await request(app)
  //       .get('/api/users/profile')
  //       .set('Authorization', `Bearer ${token}`);

  //     expect(res.statusCode).toBe(200);
  //     expect(res.body.data.user.username).toBe('profileuser');
  //     expect(res.body.data.profile).toBeDefined();
  //   });
  // });

  // describe('updateUserProfile', () => {
  //   it('should update user profile', async () => {
  //     const user = await User.create({
  //       username: 'updateuser',
  //       email: 'update@example.com',
  //       password: 'password123'
  //     });
  //     await Profile.create({ user: user._id });

  //     const token = user.generateAuthToken();

  //     const res = await request(app)
  //       .put('/api/users/profile')
  //       .set('Authorization', `Bearer ${token}`)
  //       .send({
  //         username: 'updateduser',
  //         bio: 'Updated bio'
  //       });

  //     expect(res.statusCode).toBe(200);
  //     expect(res.body.data.user.username).toBe('updateduser');
  //     expect(res.body.data.profile.bio).toBe('Updated bio');
  //   });
  // });

  // describe('updatePreferences', () => {
  //   it('should update user preferences', async () => {
  //     const user = await User.create({
  //       username: 'prefuser',
  //       email: 'pref@example.com',
  //       password: 'password123'
  //     });

  //     const token = user.generateAuthToken();

  //     const res = await request(app)
  //       .put('/api/users/preferences')
  //       .set('Authorization', `Bearer ${token}`)
  //       .send({
  //         preferences: { theme: 'dark', fontSize: 14 }
  //       });

  //     expect(res.statusCode).toBe(200);
  //     expect(res.body.status).toBe('success');
  //     expect(res.body.message).toBe('Preferences updated successfully');
  //     expect(res.body.data.preferences).toEqual({ theme: 'dark', fontSize: 14 });
  //   });
  // });

  // describe('getPreferences', () => {
  //   it('should get user preferences', async () => {
  //     const user = await User.create({
  //       username: 'getprefuser',
  //       email: 'getpref@example.com',
  //       password: 'password123',
  //       preferences: { theme: 'light', fontSize: 12 }
  //     });

  //     const token = user.generateAuthToken();

  //     const res = await request(app)
  //       .get('/api/users/preferences')
  //       .set('Authorization', `Bearer ${token}`);

  //     expect(res.statusCode).toBe(200);
  //     expect(res.body.status).toBe('success');
  //     expect(res.body.data.preferences).toEqual({ theme: 'light', fontSize: 12 });
  //   });
  // });
});