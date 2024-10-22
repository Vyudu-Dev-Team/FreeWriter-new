import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const TextEditor = ({ storyId }) => {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [storyId]);

  const fetchContent = async () => {
    try {
      const response = await axios.get(`/api/stories/${storyId}/content`);
      setContent(response.data.content);
    } catch (error) {
      console.error('Error fetching story content:', error);
    }
  };

  const handleChange = (value) => {
    setContent(value);
    // Implement debounce for autosave
    debouncedSave(value);
  };

  const debouncedSave = debounce((value) => {
    saveContent(value);
  }, 1000);

  const saveContent = async (value) => {
    setSaving(true);
    try {
      await axios.put(`/api/stories/${storyId}/content`, { content: value });
    } catch (error) {
      console.error('Error saving story content:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={handleChange}
        style={{ flexGrow: 1 }}
      />
      <Typography variant="caption" align="right" sx={{ mt: 1 }}>
        {saving ? 'Saving...' : 'All changes saved'}
      </Typography>
    </Box>
  );
};

export default TextEditor;

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}