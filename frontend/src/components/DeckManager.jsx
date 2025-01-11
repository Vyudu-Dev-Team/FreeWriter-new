import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import CardCreator from './CardCreator';
import FreewriterCards from './UpdatedDeck';



function DeckManager() {
  // const [cards, setCards] = useState([]);
  // const [openDialog, setOpenDialog] = useState(false);
  // const [selectedCard, setSelectedCard] = useState(null);
  // const [editedCard, setEditedCard] = useState({ name: '', description: '', customFields: {} });

  // useEffect(() => {
  //   fetchCards();
  // }, []);

  // const fetchCards = async () => {
  //   try {
  //     const res = await axios.get('/api/cards');
  //     setCards(res.data);
  //   } catch (err) {
  //     console.error(err);
  //     // TODO: Handle error
  //   }
  // };

  // const handleOpenDialog = (card) => {
  //   setSelectedCard(card);
  //   setEditedCard({
  //     name: card.name,
  //     description: card.description,
  //     customFields: card.customFields || {}
  //   });
  //   setOpenDialog(true);
  // };

  // const handleCloseDialog = () => {
  //   setOpenDialog(false);
  //   setSelectedCard(null);
  //   setEditedCard({ name: '', description: '', customFields: {} });
  // };

  // const handleSaveCard = async () => {
  //   try {
  //     const res = await axios.put(`/api/cards/${selectedCard._id}`, editedCard);
  //     setCards(cards.map(card => card._id === selectedCard._id ? res.data : card));
  //     handleCloseDialog();
  //   } catch (err) {
  //     console.error(err);
  //     // TODO: Handle error
  //   }
  // };

  // const handleDeleteCard = async (cardId) => {
  //   try {
  //     await axios.delete(`/api/cards/${cardId}`);
  //     setCards(cards.filter(card => card._id !== cardId));
  //   } catch (err) {
  //     console.error(err);
  //     // TODO: Handle error
  //   }
  // };

  return (
    // <Container maxWidth="lg" sx={{ mt: 4 }}>
    //   <Typography variant="h4" gutterBottom>Your Deck</Typography>
    //   <CardCreator onCardCreated={fetchCards} />
    //   <Grid container spacing={3} sx={{ mt: 2 }}>
    //     {cards.map(card => (
    //       <Grid item xs={12} sm={6} md={4} key={card._id}>
    //         <Card>
    //           <CardMedia
    //             component="img"
    //             height="140"
    //             image={card.artworkUrl}
    //             alt={card.name}
    //           />
    //           <CardContent>
    //             <Typography variant="h6">{card.name}</Typography>
    //             <Typography variant="body2" color="text.secondary">{card.description}</Typography>
    //             <Typography variant="caption" display="block">Type: {card.type}</Typography>
    //             <Typography variant="caption" display="block">Rarity: {card.rarity}</Typography>
    //             <Button size="small" onClick={() => handleOpenDialog(card)}>Edit</Button>
    //             <Button size="small" color="error" onClick={() => handleDeleteCard(card._id)}>Delete</Button>
    //           </CardContent>
    //         </Card>
    //       </Grid>
    //     ))}
    //   </Grid>
    //   <Dialog open={openDialog} onClose={handleCloseDialog}>
    //     <DialogTitle>Edit Card</DialogTitle>
    //     <DialogContent>
    //       <TextField
    //         fullWidth
    //         label="Name"
    //         value={editedCard.name}
    //         onChange={(e) => setEditedCard({ ...editedCard, name: e.target.value })}
    //         margin="normal"
    //       />
    //       <TextField
    //         fullWidth
    //         multiline
    //         rows={4}
    //         label="Description"
    //         value={editedCard.description}
    //         onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
    //         margin="normal"
    //       />
    //       {/* Add custom fields based on card type */}
    //     </DialogContent>
    //     <DialogActions>
    //       <Button onClick={handleCloseDialog}>Cancel</Button>
    //       <Button onClick={handleSaveCard}>Save</Button>
    //     </DialogActions>
    //   </Dialog>
    // </Container>
   <FreewriterCards />

   //<DeckPage />
  );
}

export default DeckManager;