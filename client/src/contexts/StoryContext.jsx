import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const StoryContext = createContext();

export function useStory() {
  return useContext(StoryContext);
}

export function StoryProvider({ children }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/stories');
      setStories(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch stories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createStory = async (title) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/stories', { title });
      setStories([...stories, res.data]);
      setError(null);
      return res.data;
    } catch (err) {
      console.error(err);
      setError('Failed to create story. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    stories,
    loading,
    error,
    fetchStories,
    createStory,
  };

  return (
    <StoryContext.Provider value={value}>
      {children}
    </StoryContext.Provider>
  );
}