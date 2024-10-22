import React, { useState } from 'react';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Card, CardContent, Typography, Box } from '@mui/material';
import axios from 'axios';

function CardCreator({ onCardCreated }) {
  const [cardType, setCardType] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [customFields, setCustomFields] = useState({});

  const handleCreateCard = async () => {
    try {
      const res = await axios.post('/api/cards', {
        type: cardType,
        name,
        description,
        customFields
      });
      onCardCreated(res.data);
      // Reset form
      setCardType('');
      setName('');
      setDescription('');
      setCustomFields({});
    } catch (err) {
      console.error(err);
      // TODO: Handle error
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Create a New Card</Typography>
        <Box sx={{ backgroundImage: 'url("/assets/images/card-background.svg")', backgroundSize: 'cover', p: 2, borderRadius: 1, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">Card Preview</Typography>
        </Box>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Card Type</InputLabel>
          <Select
            value={cardType}
            onChange={(e) => setCardType(e.target.value)}
          >
            <MenuItem value="character">Character</MenuItem>
            <MenuItem value="conflict">Conflict</MenuItem>
            <MenuItem value="setting">Setting</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Card Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Card Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        {/* Add custom fields based on card type */}
        <Button variant="contained" color="primary" onClick={handleCreateCard}>
          Create Card
        </Button>
      </CardContent>
    </Card>
  );
}

export default CardCreator;