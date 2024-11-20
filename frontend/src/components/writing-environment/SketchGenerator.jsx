import { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Paper, TextField, Box, Button, Typography, Icon } from '@mui/material';
import { Icons } from '../../utils/icon';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const NotebookPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: '100%',
  minHeight: 'auto',
  padding: '0',
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  borderRadius: theme.spacing(0.5) ,
  position: 'relative',
  overflow: 'visible',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '60px',
    top: 0,
    bottom: 0,
    width: '3px',
    backgroundColor: '#e5e5e5',
  }
}));

const RuledLines = styled('div')({
  backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px)',
  backgroundSize: '100% 40px',
  backgroundRepeat: 'repeat-y',
  width: '100%',
  minHeight: '100vh',
  height: '100%',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  '& .MuiInputBase-root': {
    fontFamily: '"Comic Sans MS", cursive, sans-serif',
    fontSize: '16px',
  },
  '& .MuiInputBase-input': {
    padding: '0',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  }
});

function SketchGenerator() {
  const [content, setContent] = useState('');
  const textFieldRef = useRef(null);
  const [activeSection, setActiveSection] = useState('goals');
  const [droppedItems, setDroppedItems] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const sectionItems = getItemsBySection(activeSection);
    console.log('Setting items:', sectionItems);
    setItems(sectionItems);
  }, [activeSection]);

  const handleTextInput = (e) => {
    setContent(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setContent(prev => prev + '\n');
    }
  };

  const handleSectionChange = (section) => {
    if (section === activeSection) return;
    setActiveSection(section);
    setContent('');
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    
    console.log('Drag result:', result);
    
    if (!destination) {
      console.log('No destination');
    }


    try {
      const draggedItem = items[source.index];
      console.log('Dragged item:', draggedItem);
      setDroppedItems(prev => [...prev, {
        id: Date.now(),
        text: draggedItem.text
      }]);
      items.splice(source.index, 1);
    } catch (error) {
      console.error('Error in handleDragEnd:', error);
    }
  };

  return (
    <Box display="flex" flex={1} minHeight="100vh" bgcolor="white">
      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Sidebar */}
        <Box width={'30%'} bgcolor="black" p={10} pb={5} display="flex" flexDirection="column" gap={3}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Icons.DartIcon style={{fontSize: '2rem',marginLeft: '3px'}} />}
            onClick={() => handleSectionChange('goals')}
            sx={{ 
              gap: '1rem', 
              flexDirection: 'column', 
              height: '8rem',
              bgcolor: activeSection === 'goals' ? 'white' : '#490BF4',
              color: activeSection === 'goals' ? 'black' : 'white',
              '&:hover': { bgcolor: activeSection === 'goals' ? 'grey.200' : '#3a09c3' } 
            }}
          >
            Goals
          </Button>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Icons.BoltIcon style={{ fontSize: '2rem', marginLeft: '3px' }} />}
            onClick={() => handleSectionChange('strength')}
            sx={{ 
              bgcolor: activeSection === 'strength' ? 'white' : '#490BF4',
              color: activeSection === 'strength' ? 'black' : 'white',
              height: '8rem', 
              '&:hover': { bgcolor: activeSection === 'strength' ? 'grey.200' : '#3a09c3' },
              flexDirection: 'column',
              gap: '1rem',
            }}>
            Strength
          </Button>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Icons.BatteryIcon style={{ fontSize: '2rem', marginLeft: '3px' }} />}
            onClick={() => handleSectionChange('weakness')}
            sx={{ 
              bgcolor: activeSection === 'weakness' ? 'white' : '#490BF4',
              color: activeSection === 'weakness' ? 'black' : 'white',
              height: '8rem', 
              '&:hover': { bgcolor: activeSection === 'weakness' ? 'grey.200' : '#3a09c3' },
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            Weakness
          </Button>
          <Typography 
            component="div"
            mt={'auto'}
          >
            <Button
              variant="outlined"
              sx={{color: 'white', width: '70%', borderRadius: '1px', borderColor: 'white', '&:hover': { bgcolor: 'grey.900' } }}
            >
              Card Done
            </Button>
          </Typography>
        </Box>

        {/* Main Content */}
        <Box flex={2} display="flex" justifyContent="center" alignItems="center" px={0}>
          <NotebookPaper elevation={3}>
            
            
                <RuledLines
                >
                  <Typography 
                    component="h5"
                    color="black"
                    textAlign='start'
                    pt={11}
                    pl={11}
                    fontFamily="PixelSplitter, monospace"
                  >
                    {activeSection === 'goals' ? 'what is your character"s goals?' :
                      activeSection === 'strength' ? 'what is your character"s strengths?' :
                      'what is your character"s weaknesses?'}
                  </Typography>
                  <TextField
                    ref={textFieldRef}
                    fullWidth
                    multiline
                    value={content}
                    onChange={handleTextInput}
                    onKeyDown={handleKeyDown}
                    minRows={10}
                    placeholder={
                      activeSection === 'goals' ? "Write your goals here..." :
                      activeSection === 'strength' ? "List your strengths..." :
                      "Identify areas for improvement..."
                    }
                    sx={{
                      flex: 1,
                      display: 'flex',
                      maxHeight: 'fit-content',
                      padding: '0',
                      '& .MuiInputBase-input': {
                        maxWidth: '80%',
                        lineHeight: '40px',
                        padding: '28px 15px 0 0 !important',
                        overflowWrap: 'break-word',
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                        maxHeight: '10rem',
                      },
                      '& .MuiInputBase-root': {
                        height: 'fit-content',
                        display: 'flex',
                        flexDirection: 'column',
                      }
                    }}
                  />
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 2,
                      padding: '20px 80px',
                      alignItems: 'flex-start',
                    }}
                  >
                    {droppedItems.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          bgcolor: 'black',
                          color: 'white',
                          padding: '10px 15px',
                          borderRadius: '4px',
                          fontFamily: 'PixelSplitter, monospace',
                          fontSize: '14px',
                        }}
                      >
                        {item.text}
                      </Box>
                    ))}
                  </Box>
                  <Droppable droppableId="draggable-items" direction="horizontal">
                    {(gridProvided) => (
                      <Box
                        ref={gridProvided.innerRef}
                        {...gridProvided.droppableProps}
                        sx={{
                          bgcolor: '#490BF4',
                          p: 3,
                          borderRadius: 2,
                          width: '80%',
                          margin: '0 auto 2rem',
                          display: 'flex',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '18px',
                            justifyContent: 'center',
                            width: '100%'
                          }}
                        >
                          {items.map((item, index) => (
                            <DraggableItem 
                              key={item.id}
                              item={item} 
                              index={index}
                            />
                          ))}
                          {gridProvided.placeholder}
                        </Box>
                      </Box>
                    )}
                  </Droppable>
                  <Box
                  fullWidth
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      justifyContent: 'center',
                      mt: 'auto',
                      mb: 8,
                      width: '100%',

                    }}
                  >
                    <Button
                      startIcon={<Icons.RefreshIcon style={{fontSize: '2rem'}} />}
                      variant="outlined"
                      sx={{color: 'black', width: 'auto', borderRadius: '1px', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'white' } }}
                    >
                    </Button>
                    <Box
                      component="img"
                      src="/assets/images/round-vigil.svg"
                      alt="Round Vigil"
                      sx={{
                        width: '4rem',
                        height: '4rem',
                        position: 'absolute ',
                        zIndex: 10,
                        top: -30,
                        right: 30,
                        borderRadius: '50%',
                      }}
                    />
                  </Box>
                </RuledLines>
          </NotebookPaper>
        </Box>
      </DragDropContext>
    </Box>
  );
}

export default SketchGenerator;




const DraggableItem = ({ item, index }) => {
  return (
    <Draggable 
      draggableId={item.id.toString()}
      index={index}
      key={item.id}
    >
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            opacity: snapshot.isDragging ? 0.8 : 1,
            cursor: 'grab',
            '&:active': {
              cursor: 'grabbing'
            },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            ...provided.draggableProps.style
          }}
        >
          <Box
            sx={{
              bgcolor: 'black',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'PixelSplitter, monospace',
              fontSize: '14px',
              mb: '4px',
              padding: '10px 15px',
              userSelect: 'none',
            }}
          >
            {item.text}
          </Box>
        </Box>
      )}
    </Draggable>
  );
};

const getItemsBySection = (section) => {
  const goalItems = [
    { id: '1', text: 'Career Growth' },
    { id: '2', text: 'Learning' },
    { id: '3', text: 'Work-Life Balance' },
    { id: '4', text: 'Innovation' },
    { id: '5', text: 'Leadership' },
    { id: '6', text: 'Networking' },
    { id: '7', text: 'Skill Development' },
    { id: '8', text: 'Health' },
    { id: '9', text: 'Personal Projects' },
    { id: '10', text: 'Education' },
    { id: '11', text: 'Financial Growth' },
  ].map(item => ({
    ...item,
    id: item.id.toString()
  }));

  const strengthItems = [
    { id: '1', text: 'Problem Solving' },
    { id: '2', text: 'Creativity' },
    { id: '3', text: 'Team Player' },
    { id: '4', text: 'Adaptability' },
    { id: '5', text: 'Leadership' },
    { id: '6', text: 'Communication' },
    { id: '7', text: 'Critical Thinking' },
    { id: '8', text: 'Initiative' },
    { id: '9', text: 'Project Management' },
    { id: '10', text: 'Mentoring' },
    { id: '11', text: 'Technical Skills' },
  ].map(item => ({
    ...item,
    id: item.id.toString()
  }));

  const weaknessItems = [
    { id: '1', text: 'Time Management' },
    { id: '2', text: 'Public Speaking' },
    { id: '3', text: 'Technical Skills' },
    { id: '4', text: 'Networking' },
    { id: '5', text: 'Leadership' },
    { id: '6', text: 'Communication' },
    { id: '7', text: 'Organization' },
    { id: '8', text: 'Focus' },
    { id: '9', text: 'Decision Making' },
    { id: '10', text: 'Delegation' },
    { id: '11', text: 'Problem Solving' },
  ].map(item => ({
    ...item,
    id: item.id.toString()
  }));

  switch (section) {
    case 'goals':
      return [...goalItems];
    case 'strength':
      return [...strengthItems];
    case 'weakness':
      return [...weaknessItems];
    default:
      return [];
  }
};

