const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

const User = require('../models/user');
const helper = require('./test_helper');

beforeEach(async () => {
  await User.deleteMany({});
});

test('Creation fails with proper status code and message if password is too short', async () => {
  const newUser = {
    username: 'testuser',
    name: 'Test',
    password: 'ra',
  };

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(
    result.body.error,
    'Password must be at least 8 characters long'
  );

  const usersAtEnd = await helper.usersInDb();
  assert.strictEqual(usersAtEnd.length, 0);
});

test('Creation fails with proper status code and message if username is not unique', async () => {
  const newUser = {
    username: 'testuser',
    name: 'test',
    password: 'validpassword',
  };

  // First user creation
  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  // Second user creation with the same username
  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(result.body.error, 'expected `username` to be unique');

  const usersAtEnd = await helper.usersInDb();
  assert.strictEqual(usersAtEnd.length, 1);
});

after(async () => {
  await mongoose.connection.close();
});
