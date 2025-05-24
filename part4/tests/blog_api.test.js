const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcrypt');

let token = null;

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);

  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('testpassword', 10);
  const user = new User({
    username: 'testuser',
    passwordHash,
  });

  await user.save();

  const response = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'testpassword' });

  token = response.body.token;
});

test('Blogs are returned as JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('Unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs');
  const blogs = response.body;

  blogs.forEach((blog) => {
    assert(blog.id, 'Blog should have an id property');
    assert(!blog._id, 'Blog should not have an _id property');
  });
});

test('Making an HTTP post with valid token', async () => {
  const newBlog = {
    title: 'Testing HTTP post',
    author: 'Nobody',
    url: 'http://testing.com',
    likes: 20,
  };

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  const blogs = response.body;
  const titles = blogs.map((r) => r.title);

  assert.strictEqual(blogs.length, helper.initialBlogs.length + 1);
  assert(titles.includes('Testing HTTP post'));
});

test('Adding a blog fails with status 401 if token is not provided', async () => {
  const newBlog = {
    title: 'Blog without token',
    author: 'Nobody',
    url: 'http://testing.com',
    likes: 20,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

test('Likes default to 0 if not provided', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Nobody',
    url: 'http://testing.com',
  };

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const createdBlog = response.body;

  assert.strictEqual(createdBlog.likes, 0);
});

test('Creation fails with status 400 if title is missing', async () => {
  const newBlog = {
    author: 'Nobody',
    url: 'http://testing.com',
    likes: 5,
  };

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

test('Creation fails with status 400 if url is missing', async () => {
  const newBlog = {
    title: 'Testing Blog without URL',
    author: 'Nobody',
    likes: 5,
  };

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

test('Succeeds with status code 204 if ID is valid and blog belongs to user', async () => {
  const newBlog = {
    title: 'Blog for Deletion Test',
    author: 'Test Author',
    url: 'http://test-url.com',
    likes: 0,
  };

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogToDelete = response.body;

  assert(blogToDelete, 'Blog to delete should exist');
  assert(blogToDelete.id, 'Blog to delete should have an id property');

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);

  const titles = blogsAtEnd.map((r) => r.title);
  assert(!titles.includes(blogToDelete.title));
});

test('Fails with status 401 if trying to delete a blog that does not belong to the user', async () => {
  const newBlog = {
    title: 'Blog for Unauthorized Deletion',
    author: 'Another Author',
    url: 'http://another-url.com',
    likes: 0,
  };

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogToDelete = response.body;

  await api
    .post('/api/login')
    .send({ username: 'anotheruser', password: 'anotherpassword' });

  const anotherTokenResponse = await api
    .post('/api/login')
    .send({ username: 'anotheruser', password: 'anotherpassword' });

  const anotherToken = anotherTokenResponse.body.token;

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${anotherToken}`)
    .expect(401);
});

after(async () => {
  await mongoose.connection.close();
});
