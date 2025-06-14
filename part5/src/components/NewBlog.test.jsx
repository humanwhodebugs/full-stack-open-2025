import { render, screen, fireEvent } from '@testing-library/react';
import NewBlog from '../components/NewBlog';
import { describe, it, expect, vi } from 'vitest';

describe('NewBlog component', () => {
  it('calls the event handler with the right details when a new blog is created', () => {
    const createBlog = vi.fn();

    render(<NewBlog createBlog={createBlog} />);

    // Select input fields and submit button
    const titleInput = screen.getByRole('textbox', { name: 'Title' });
    const authorInput = screen.getByRole('textbox', { name: 'Author' });
    const urlInput = screen.getByRole('textbox', { name: 'URL' });
    const createButton = screen.getByText('Create');

    // Simulate user input
    fireEvent.change(titleInput, { target: { value: 'Testing React forms' } });
    fireEvent.change(authorInput, { target: { value: 'Test User' } });
    fireEvent.change(urlInput, { target: { value: 'https://test.com' } });

    // Simulate form submission
    fireEvent.click(createButton);

    // Ensure the event handler was called with the right details
    expect(createBlog).toHaveBeenCalledTimes(1);
    expect(createBlog).toHaveBeenCalledWith({
      title: 'Testing React forms',
      author: 'Test User',
      url: 'https://test.com',
    });
  });
});
