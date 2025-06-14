const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body;
  const user = request.user;

  if (!title || !url) {
    return response.status(400).json({ error: 'Title and URL are required' });
  }

  if (!user) {
    return response.status(401).json({ error: 'User not authenticated' });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body;

  if (likes === undefined || typeof likes !== 'number') {
    return response.status(400).json({ error: 'Likes must be a number' });
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    { new: true }
  );

  if (updatedBlog) {
    response.json(updatedBlog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1,
  });

  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const user = request.user;

  if (!user) {
    return response.status(401).json({ error: 'User not authenticated' });
  }

  const blog = await Blog.findById(id);

  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' });
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response
      .status(403)
      .json({ error: 'Forbidden: only the creator can delete the blog' });
  }

  await Blog.findByIdAndDelete(id);
  response.status(204).end();
});

module.exports = blogsRouter;
