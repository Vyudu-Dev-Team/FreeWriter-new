import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const Outline = ({ writingMode }) => {
  const [outlineItems, setOutlineItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    fetchOutlineItems();
  }, []);

  const fetchOutlineItems = async () => {
    try {
      const response = await axios.get('/api/outline');
      setOutlineItems(response.data);
    } catch (error) {
      console.error('Error fetching outline items:', error);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.trim()) return;
    try {
      const response = await axios.post('/api/outline', { content: newItem });
      setOutlineItems([...outlineItems, response.data]);
      setNewItem('');
    } catch (error) {
      console.error('Error adding outline item:', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`/api/outline/${id}`);
      setOutlineItems(outlineItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting outline item:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {writingMode === 'Plotter' ? 'Detailed Outline' : 'Quick Notes'}
      </Typography>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={writingMode === 'Plotter' ? 'Add outline item' : 'Add quick note'}
        />
        <Button variant="contained" color="primary" onClick={handleAddItem} sx={{ ml: 1 }}>
          Add
        </Button>
      </Box>
      <List>
        {outlineItems.map((item) => (
          <ListItem key={item.id}>
            <ListItemText primary={item.content} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteItem(item.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Outline;