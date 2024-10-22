import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TextEditor = ({ initialContent, onContentChange }) => {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleChange = (value) => {
    setContent(value);
    setSaving(true);
    debouncedSave(value);
  };

  const debouncedSave = debounce((value) => {
    onContentChange(value);
    setSaving(false);
  }, 1000);

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