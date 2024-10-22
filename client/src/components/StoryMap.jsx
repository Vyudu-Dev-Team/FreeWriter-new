import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Paper, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';

const StoryElement = ({ element, index }) => (
  <Draggable draggableId={element.id} index={index}>
    {(provided, snapshot) => (
      <Paper
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        elevation={3}
        sx={{
          p: 2,
          m: 1,
          backgroundColor: snapshot.isDragging ? 'action.hover' : 'background.paper',
          ...provided.draggableProps.style,
        }}
      >
        <Typography>{element.content}</Typography>
      </Paper>
    )}
  </Draggable>
);

const StoryMap = () => {
  const [elements, setElements] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newElementContent, setNewElementContent] = useState('');

  useEffect(() => {
    fetchStoryElements();
  }, []);

  const fetchStoryElements = async () => {
    try {
      const response = await axios.get('/api/story-elements');
      setElements(response.data);
    } catch (error) {
      console.error('Error fetching story elements:', error);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const newElements = Array.from(elements);
    const [reorderedElement] = newElements.splice(result.source.index, 1);
    newElements.splice(result.destination.index, 0, reorderedElement);

    setElements(newElements);

    try {
      await axios.put('/api/story-elements/reorder', { elements: newElements });
    } catch (error) {
      console.error('Error updating element order:', error);
    }
  };

  const handleAddElement = async () => {
    try {
      const response = await axios.post('/api/story-elements', { content: newElementContent });
      setElements([...elements, response.data]);
      setNewElementContent('');
      setOpenDialog(false);
    } catch (error) {
      console.error('Error adding new element:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Story Map</Typography>
      <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
        Add Element
      </Button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="story-map">
          {(provided) => (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              {elements.map((element, index) => (
                <StoryElement key={element.id} element={element} index={index} />
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Story Element</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Element Content"
            fullWidth
            variant="outlined"
            value={newElementContent}
            onChange={(e) => setNewElementContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddElement} variant="contained" color="primary">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StoryMap;