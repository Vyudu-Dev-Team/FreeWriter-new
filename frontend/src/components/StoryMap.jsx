import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Paper, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const StoryElement = ({ element, index, onEdit, onDelete }) => (
  <Draggable draggableId={element._id} index={index}>
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
        <Typography variant="h6">{element.title}</Typography>
        <Typography variant="body2">{element.content}</Typography>
        <Typography variant="caption">Type: {element.type}</Typography>
        <Box sx={{ mt: 1 }}>
          <Button size="small" onClick={() => onEdit(element)}>Edit</Button>
          <Button size="small" color="error" onClick={() => onDelete(element._id)}>Delete</Button>
        </Box>
      </Paper>
    )}
  </Draggable>
);

const StoryMap = () => {
  const { storyId } = useParams();
  const [elements, setElements] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingElement, setEditingElement] = useState(null);
  const [elementTitle, setElementTitle] = useState('');
  const [elementContent, setElementContent] = useState('');
  const [elementType, setElementType] = useState('scene');

  useEffect(() => {
    fetchStoryElements();
  }, [storyId]);

  const fetchStoryElements = async () => {
    try {
      const response = await axios.get(`/api/stories/${storyId}/elements`);
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
      await axios.put(`/api/stories/${storyId}/elements/reorder`, { elements: newElements });
    } catch (error) {
      console.error('Error updating element order:', error);
    }
  };

  const handleAddElement = async () => {
    try {
      const response = await axios.post(`/api/stories/${storyId}/elements`, { 
        title: elementTitle,
        content: elementContent,
        type: elementType
      });
      setElements([...elements, response.data]);
      handleCloseDialog();
    } catch (error) {
      console.error('Error adding new element:', error);
    }
  };

  const handleEditElement = async () => {
    try {
      const response = await axios.put(`/api/stories/${storyId}/elements/${editingElement._id}`, {
        title: elementTitle,
        content: elementContent,
        type: elementType
      });
      setElements(elements.map(el => el._id === editingElement._id ? response.data : el));
      handleCloseDialog();
    } catch (error) {
      console.error('Error editing element:', error);
    }
  };

  const handleDeleteElement = async (elementId) => {
    try {
      await axios.delete(`/api/stories/${storyId}/elements/${elementId}`);
      setElements(elements.filter(el => el._id !== elementId));
    } catch (error) {
      console.error('Error deleting element:', error);
    }
  };

  const handleOpenDialog = (element = null) => {
    if (element) {
      setEditingElement(element);
      setElementTitle(element.title);
      setElementContent(element.content);
      setElementType(element.type);
    } else {
      setEditingElement(null);
      setElementTitle('');
      setElementContent('');
      setElementType('scene');
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingElement(null);
    setElementTitle('');
    setElementContent('');
    setElementType('scene');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Story Map</Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>
        Add Element
      </Button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="story-map">
          {(provided) => (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              {elements.map((element, index) => (
                <StoryElement 
                  key={element._id} 
                  element={element} 
                  index={index}
                  onEdit={handleOpenDialog}
                  onDelete={handleDeleteElement}
                />
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingElement ? 'Edit Story Element' : 'Add New Story Element'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Element Title"
            fullWidth
            variant="outlined"
            value={elementTitle}
            onChange={(e) => setElementTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Element Content"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={elementContent}
            onChange={(e) => setElementContent(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Element Type</InputLabel>
            <Select
              value={elementType}
              onChange={(e) => setElementType(e.target.value)}
            >
              <MenuItem value="scene">Scene</MenuItem>
              <MenuItem value="chapter">Chapter</MenuItem>
              <MenuItem value="plotPoint">Plot Point</MenuItem>
              <MenuItem value="characterArc">Character Arc</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={editingElement ? handleEditElement : handleAddElement} variant="contained" color="primary">
            {editingElement ? 'Save Changes' : 'Add Element'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StoryMap;