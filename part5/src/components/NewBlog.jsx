import { useState } from 'react';

const NewBlog = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: title,
      author: author,
      url: url,
    });

    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div>
      <h2>Create New</h2>
      <form onSubmit={addBlog}>
        <div>
          Title
          <input
            type='text'
            value={title}
            name='Title'
            onChange={({ target }) => setTitle(target.value)}
            aria-label='Title'
          />
        </div>
        <div>
          Author
          <input
            type='text'
            value={author}
            name='Author'
            onChange={({ target }) => setAuthor(target.value)}
            aria-label='Author'
          />
        </div>
        <div>
          URL
          <input
            type='url'
            value={url}
            name='URL'
            onChange={({ target }) => setUrl(target.value)}
            aria-label='URL'
          />
        </div>
        <button type='submit'>Create</button>
      </form>
    </div>
  );
};

export default NewBlog;
