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
  Snackbar,
  Alert,
  InputAdornment,
} from '@mui/material';
import { styled, useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AddCircleOutline as AddIcon,
} from '@mui/icons-material';
import { useAppContext } from '../contexts/AppContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  marginBottom: theme.spacing(2),
}));

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#b8ff57',
    },
    secondary: {
      main: '#6c5ce7',
    },
  },
  typography: {
    body1: {
      fontFamily: 'Quicksand'
    }
  }
});

export default function ProfilePage() {
  const theme = useTheme();
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
  const [error, setError] = useState(null);
  const { saveProfile, state } = useAppContext();

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!profile.name?.trim()) {
      errors.name = 'Name is required';
    }
    if (!profile.username?.trim()) {
      errors.username = 'Username is required';
    }
    if (!profile.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      errors.email = 'Invalid email format';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEdit = () => {
    setOriginalProfile({...profile}); 
    setIsEditing(true);
    setFormErrors({});
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setError('Please fix the form errors before saving.');
      return;
    }

    try {
      const savedProfile = await saveProfile(profile);
      
      if (savedProfile) {
        setIsEditing(false);
        setOriginalProfile(null);
        setError(null);
        return;
      }

      setError(state.error);
    } catch (err) {
      setError('Failed to save profile. Please try again.');
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
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
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

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error" 
          variant="filled"
        >
          {error}
        </Alert>
      </Snackbar>
      <Container sx={{ mt: 4, textTransform: 'capitalize', bgcolor: 'background.default' }} maxWidth="lg">
        <Grid container spacing={3} sx={{ textTransform: 'capitalize' }}>
          <Grid item xs={12} md={4}>
            <StyledPaper elevation={3}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <StyledAvatar alt={profile.name} src="/path-to-profile-image.jpg" />
                <Typography variant="h5" sx={{ fontFamily: 'PixelSplitter' }} gutterBottom>{profile.name}</Typography>
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
              <Typography variant="h6" sx={{ fontFamily: 'PixelSplitter' }} gutterBottom>Writing Stats</Typography>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body1">Total Words Written:</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {profile.wordCount?.toLocaleString() || '0'}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body1">Stories Published:</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {profile.storiesPublished || '0'}
                </Typography>
              </Box>
            </StyledPaper>
          </Grid>

          <Grid item xs={12} md={8}>
            <StyledPaper elevation={3}>
              <Typography variant="h6" sx={{ fontFamily: 'PixelSplitter' }} gutterBottom>About Me</Typography>
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
                <Typography sx={{ fontFamily: 'PixelSplitter' }} variant="h6">Favorite Genres</Typography>
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
              <Typography sx={{ fontFamily: 'PixelSplitter' }} variant="h6" gutterBottom>Contact Information</Typography>
              <Box mb={2}>
                {isEditing ? (
                  <>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="name"
                      label="Name"
                      value={profile.name}
                      onChange={handleChange}
                      error={!!formErrors.name}
                      helperText={formErrors.name}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="email"
                      label="Email"
                      value={profile.email}
                      onChange={handleChange}
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                    />
                  </>
                ) : (
                  <>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Name:</strong> {profile.name}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Email:</strong> {profile.email}
                    </Typography>
                  </>
                )}
              </Box>
              <Divider />
              <Box mt={2}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="username"
                    label="Username"
                    value={profile.username}
                    onChange={handleChange}
                    error={!!formErrors.username}
                    helperText={formErrors.username}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">@</InputAdornment>
                      ),
                    }}
                  />
                ) : (
                  <Typography variant="body1">
                    <strong>Username:</strong> @{profile.username}
                  </Typography>
                )}
              </Box>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
