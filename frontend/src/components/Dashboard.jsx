import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Tooltip,
  useMediaQuery,
  useTheme,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import axios from "axios";
// import { motion } from "framer-motion";

function Dashboard() {
  const { state, dispatch } = useAppContext();
  const { stories, loading, error } = state;

  const [aiResponse, setAiResponse] = useState("");
  const [newStoryTitle, setNewStoryTitle] = useState("");
  const [writingMode, setWritingMode] = useState("");
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [inputError, setInputError] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleCreateStory = async () => {
    if (!newStoryTitle) {
      setValidationError("Story title is required.");
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const { data } = await axios.post("/api/stories", {
        title: newStoryTitle,
        writingMode,
      });
      dispatch({ type: "SET_STORIES", payload: [...stories, data] });
      setNewStoryTitle("");
      setWritingMode("");
      setOpenDialog(false);
      setShowSnackbar(true);
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Failed to create story" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleAIInteraction = async () => {
    if (!userInput.trim()) {
      setInputError("Input cannot be empty.");
      return;
    }

    try {
      setIsAiLoading(true);
      const { data } = await axios.post("/api/ai/prompt", { input: userInput });
      setAiResponse(data.response);
      setChatHistory([
        ...chatHistory,
        { sender: "User", text: userInput, timestamp: new Date() },
        { sender: "AI", text: data.response, timestamp: new Date() },
      ]);
      setUserInput("");
      setInputError(null);
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Failed to get AI response" });
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, px: isMobile ? 2 : 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Stories
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Tooltip title="Create a new story and start writing">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
          sx={{
            mb: 2,
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            },
            padding: "10px 20px",
            borderRadius: "8px",
          }}
        >
          Create New Story
        </Button>
      </Tooltip>

      {loading ? (
        <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Container>
      ) : stories.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No stories yet. Create your first story to get started!
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {stories.map((story) => (
            <Grid item xs={12} sm={6} md={4} key={story._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {story.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {story.createdAt
                      ? new Date(story.createdAt).toLocaleDateString()
                      : "Date unavailable"}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Tooltip title="Continue writing your story">
                    <Button
                      size="small"
                      component={RouterLink}
                      to={`/write/${story._id}`}
                    >
                      Write
                    </Button>
                  </Tooltip>
                  <Tooltip title="View and edit your story's structure">
                    <Button
                      size="small"
                      component={RouterLink}
                      to={`/story-map/${story._id}`}
                    >
                      Story Map
                    </Button>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create a New Story</DialogTitle>
        <DialogContent>
          {validationError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {validationError}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Story Title"
            fullWidth
            value={newStoryTitle}
            onChange={(e) => setNewStoryTitle(e.target.value)}
            variant="outlined"
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Writing Mode</InputLabel>
            <Select
              value={writingMode}
              onChange={(e) => setWritingMode(e.target.value)}
              displayEmpty
            >
              <MenuItem value="Plotter">Plotter</MenuItem>
              <MenuItem value="Pantser">Pantser</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateStory} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Chat with AI Assistant
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            label="Ask the AI"
            variant="outlined"
            error={!!inputError}
            helperText={inputError}
            multiline
            minRows={1}
            maxRows={8}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAIInteraction}
            disabled={isAiLoading}
          >
            {isAiLoading ? <CircularProgress size={24} /> : "Send"}
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 2, maxHeight: 400, overflowY: "auto" }}>
          {chatHistory.length > 0 ? (
            chatHistory.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: msg.sender === "User" ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ListItem sx={{ alignItems: "flex-start", mb: 1 }}>
                  <ListItemText
                    primary={msg.text}
                    secondary={new Date(msg.timestamp).toLocaleTimeString()}
                    sx={{
                      backgroundColor:
                        msg.sender === "User" ? "#e3f2fd" : "#f1f8e9",
                      borderRadius: 2,
                      padding: 1,
                    }}
                  />
                </ListItem>
              </motion.div>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No messages yet. Start the conversation by sending a message!
            </Typography>
          )}
        </Paper>

        {aiResponse && (
          <Alert severity="info" sx={{ mt: 2 }}>
            AI Response: {aiResponse}
          </Alert>
        )}
      </Box>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        message="Story created successfully!"
      />
    </Container>
  );
}

export default Dashboard;
