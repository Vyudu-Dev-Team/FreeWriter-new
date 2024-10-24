import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Chip,
  Box,
  Divider,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AddCircleOutline as AddIcon,
} from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  marginBottom: theme.spacing(2),
}));

export default function ProfilePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    bio: 'Passionate writer with a love for science fiction and fantasy.',
    genres: ['Science Fiction', 'Fantasy', 'Mystery'],
    wordCount: 150000,
    storiesPublished: 12,
  });
  const [originalProfile, setOriginalProfile] = useState(null);
  const [newGenre, setNewGenre] = useState('');
  const [genreError, setGenreError] = useState('');

  const handleEdit = () => {
    setOriginalProfile({...profile}); 
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // await saveProfile(profile);
      setIsEditing(false);
      setOriginalProfile(null); 
    } catch (error) {
      console.error('Failed to save profile:', error);
      
    }
  };

  const handleCancel = () => {
    if (originalProfile) {
      setProfile(originalProfile);
    }
    setIsEditing(false);
    setOriginalProfile(null); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const validateGenre = (genre) => {
    if (!genre.trim()) {
      setGenreError('Genre cannot be empty');
      return false;
    }
    if (genre.trim().length > 30) {
      setGenreError('Genre must be 30 characters or less');
      return false;
    }
    if (profile.genres.includes(genre.trim())) {
      setGenreError('Genre already exists');
      return false;
    }
    setGenreError('');
    return true;
  };

  const handleAddGenre = () => {
    if (validateGenre(newGenre)) {
      setProfile({
        ...profile,
        genres: [...profile.genres, newGenre.trim()]
      });
      setNewGenre(''); 
    }
  };

  const handleGenreInputChange = (e) => {
    const value = e.target.value;
    setNewGenre(value);
    if (genreError) {
      validateGenre(value); 
    }
  };

  const handleDeleteGenre = (genreToDelete) => {
    setProfile({
      ...profile,
      genres: profile.genres.filter(genre => genre !== genreToDelete)
    });
  };

  const handleGenreInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddGenre();
    }
  };

  return (
    <Container sx={{ mt: 4 }} maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StyledPaper elevation={3}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <StyledAvatar alt={profile.name} src="/path-to-profile-image.jpg" />
              <Typography variant="h5" gutterBottom>{profile.name}</Typography>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>@{profile.username}</Typography>
              <Box mt={2} width="100%">
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                  onClick={isEditing ? handleSave : handleEdit}
                >
                  {isEditing ? 'Save Profile' : 'Edit Profile'}
                </Button>
                {isEditing && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    style={{ marginTop: theme.spacing(1) }}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </Box>
          </StyledPaper>

          <StyledPaper elevation={3}>
            <Typography variant="h6" gutterBottom>Writing Stats</Typography>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body1">Total Words Written:</Typography>
              <Typography variant="body1" fontWeight="bold">{profile.wordCount.toLocaleString()}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1">Stories Published:</Typography>
              <Typography variant="body1" fontWeight="bold">{profile.storiesPublished}</Typography>
            </Box>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={8}>
          <StyledPaper elevation={3}>
            <Typography variant="h6" gutterBottom>About Me</Typography>
            {isEditing ? (
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                name="bio"
                value={profile.bio}
                onChange={handleChange}
              />
            ) : (
              <Typography variant="body1">{profile.bio}</Typography>
            )}
          </StyledPaper>

          <StyledPaper elevation={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Favorite Genres</Typography>
              {isEditing && (
                <Box display="flex" gap={1}>
                  <TextField
                    size="small"
                    value={newGenre}
                    onChange={handleGenreInputChange}
                    onKeyDown={handleGenreInputKeyPress}
                    placeholder="Add new genre"
                    variant="outlined"
                    error={!!genreError}
                    helperText={genreError}
                    inputProps={{ maxLength: 30 }}
                  />
                  <IconButton
                    onClick={handleAddGenre}
                    color="primary"
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {profile.genres.map((genre, index) => (
                <Chip
                  key={index}
                  label={genre}
                  onDelete={isEditing ? () => handleDeleteGenre(genre) : undefined}
                  color="primary"
                  variant={isEditing ? "outlined" : "filled"}
                />
              ))}
            </Box>
          </StyledPaper>

          <StyledPaper elevation={3}>
            <Typography variant="h6" gutterBottom>Contact Information</Typography>
            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>Email</Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  variant="outlined"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                />
              ) : (
                <Typography variant="body1">{profile.email}</Typography>
              )}
            </Box>
            <Divider />
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>Username</Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  variant="outlined"
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                />
              ) : (
                <Typography variant="body1">@{profile.username}</Typography>
              )}
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
}
