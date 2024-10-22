import React from 'react';
import { Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const UserGuide = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>User Guide</Typography>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Getting Started</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Welcome to freeWriter! To begin, create an account or log in. Once logged in, you can start a new story from your dashboard.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Writing Workspace</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            The writing workspace is where you'll spend most of your time. It includes a text editor, an AI assistant, and tools for outlining and tracking your progress.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Using the AI Assistant</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            The AI assistant can help with writer's block, provide feedback, and generate ideas. Simply type your request in the AI assistant box and hit enter.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Add more sections as needed */}
    </div>
  );
};

export default UserGuide;