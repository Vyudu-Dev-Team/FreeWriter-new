import React, { useState, useEffect } from 'react';
import { Icons } from '../utils/icon';
import { Box, Typography, IconButton, TextField, Paper, Button } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import axios from 'axios';
import { useAppContext } from '../contexts/AppContext';

const BackContent = ({title, content}) =>{
	return (
	<>
		<Typography
			sx={{
				color: title === 'WORLD' ? 'black' : 'white',
				fontFamily: 'PixelSplitter, monospace',
				fontSize: '0.8rem',
				textAlign: 'start',
				width: '100%'
			}}
			>
        {title}
    </Typography>
		<Typography
			variant='p'
			sx={{
				fontFamily: 'Quicksand',
				fontSize: '9px',
				textAlign: 'start',
				color: '#000',
				fontWeight: 'bold'
			}}>
				{content}
		</Typography>
	</>
)}


const FlipCard = ({ title, color, icon: Icon, back, onClick, isSelected  }) => {
	const [isFlipped, setIsFlipped] = useState(false);
	useEffect(()=>{
			setTimeout(()=>{
				!isSelected && setIsFlipped(false)
			}, 600)
		}, [isSelected])
  
    return (
      <Box
        sx={{
          width: 180,
          height: 300,
          perspective: '1000px',
          cursor: 'pointer',
        }}
        onClick={() => {
            setIsFlipped(!isFlipped)
            console.log('flip')
        }}
      >
        <Box

				  
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s',
            transform: isFlipped  ? `rotateY(180deg) ${isSelected ? 'scale(1.12)' :' scale(1)' }` : 'rotateY(0) scale(0.8)',
						'&: hover': {
							transform: 'scale(1)'
						}
          }}
          onClick={onClick}
        >
          {/* Front of card */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              bgcolor: color,
              borderRadius: 1,
              border: '4px solid',
              borderColor: `#000`,
              boxShadow: `0 0 0 20px ${color}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
								<Typography
									sx={{
										color: color === '#D8F651' ? 'black' : 'white',
										fontFamily: 'PixelSplitter, monospace',
										fontSize: '1.2rem',
										textAlign: 'center',
									}}
								>
									{title}
								</Typography>
            <Icon 
              sx={{ 
                fontSize: '8rem', 
                color: color === '#D8F651' ? 'black' : 'white',
              }} 
            />
          </Box>
  
          {/* Back of card */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              bgcolor: color,
              borderRadius: 2,
              border: '4px solid',
              borderColor: `${color === '#D8F651' ? 'black' : color}`,
              transform: 'rotateY(180deg)',
              display: 'flex',
							flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pt: 2,
							px: 2,
							gap: 1
            }}
          >
            {back.map((item)=>{
							return (
							<BackContent {...item} />
						)})}
          </Box>
        </Box>
      </Box>
    );
};

const EditInterface = ({ title, setFeedback, setSelectedCard }) => {
	const { fetchContent, saveContent, fetchFeedback } = useAppContext();
	const [content, setContent] = useState();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadContent = async () => {
			setLoading(true);
			try {
				const response = await fetchContent(title);
				setContent(response.content);
				const newFeedback = await fetchFeedback(title, response.content);
				newFeedback && setFeedback({title: title, text: newFeedback.text})
				setSelectedCard(null)
			} catch (error) {
				console.error("Error fetching content:", error);
			} finally {
				setLoading(false);
			}
		};

		loadContent();
	}, [title]);

	const handleSave = async () => {
		try {
			await saveContent(title, content);
			alert('Content saved successfully!');
      const response = await fetchFeedback(title)
      response && setFeedback({title: title, text: response.data.feedback})
		} catch (error) {
			console.error("Error saving content:", error);
		}
	};

	const handleContentChange = async (newContent) => {
		setContent(newContent);
	};

	return (
		<Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
			<Typography variant="h6" 
				sx={{ mb: 2, pl: 2, border: 'none', fontFamily: 'PixelSplitter, monospace', width: '70%', textAlign: 'left', fontSize: '1rem' }}>
				DISCRIBE YOUR {title} FOR THE STORY
			</Typography>
			<TextField
				fullWidth
				multiline
				outlined={'none'}
				focused={false}
				rows={15}
				value={content}
				onChange={(e) => handleContentChange(e.target.value)}
				sx={{
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
				}}
			/>
			<Button onClick={handleSave} variant="contained" color="primary">Save</Button>
		</Box>
	);
};

const AIFeedback = ({ feedbackToRender }) => {

  return (
    <Paper elevation={3} sx={{ p: 4, height: '100%', bgcolor: '#fff' }}>
      <Typography variant="h6" sx={{ mb: 2, fontFamily: 'PixelSplitter, monospace', fontSize: '0.9rem' }}>
        AI Feedback
      </Typography>
      {feedbackToRender.map(({ id, title, text, grade }) => (
        <>
        
        <Typography key={id} sx={{ fontFamily: 'Quicksand, monospace', fontSize: '0.7rem', gap: 1, display: 'flex' }}>
        </Typography>
          <Typography sx={{ fontFamily: 'PixelSplitter', padding: 1, gap: 1, fontSize: '0.7rem', display: 'flex', alignItems: 'center'}}>
            <Typography 
              sx={{ 
                  bgcolor: grade === 'good' ? 'rgba(73, 11, 244, 1)' : grade === 'fair' ? 'yellow' : 'red',
                  padding: 1, 
                color: grade === 'good' ? 'white' :  'black',
                px: 2, 
                borderRadius: 2, 
                maxHeight: 40, 
                fontSize: '0.7rem', 
                fontWeight: 'bold',
                display: 'flex',  
              }}
            >
              {id}
            </Typography>
            <span style={{ fontFamily: 'PixelSplitter', textAlign: 'start' }}>
              {title} 
            </span>
          </Typography>
          <Typography textAlign={'start'} mb={2} px={2} fontSize={'10px'}>
            {text}
          </Typography>
        </>
      ))}
     
    </Paper>
  );
};

export default function FreewriterCards() {
  cards = [
    { title: "CHARACTER", color: "#490BF4", icon: Icons.CharacterIcon, back: [
			{title: "CHARACTER NAME", content: 'A brave warrior known for their unmatched skills.'},
			{title: "GOAL", content: 'To unite the fractured kingdoms through diplomacy.'},
			{title: "STRENGTH", content: 'Exceptional combat skills and strategic thinking.'},
			{title: "WEAKNESS", content: 'A tendency to trust too easily.'}
	 ] },
    { title: "WORLD", color: "#D8F651", icon: Icons.WorldIcon, back: [
			{title: "WORLD", content: 'A richly detailed setting that influences the narrative and character development. The world is filled with diverse cultures, landscapes, and histories that shape the characters’ experiences and conflicts. From the towering mountains to the vast oceans, every element of this world plays a crucial role in the unfolding story, providing a backdrop that is as dynamic and engaging as the characters themselves.'}
	 ]  },
    { title: "CONFLICT", color: "rgba(102, 0, 210, 1)", icon: Icons.ConflictIcon, back: [
			{title: "INCIDING INCIDENT", content: 'The event that triggers the main conflict.'},
			{title: "CONFLICT", content: 'The central struggle between opposing forces.'},
			{title: "RESOLUTION", content: 'The outcome of the conflict, providing closure.'}
	 ] }
  ];

  const defaultFeedback = [
  { id: 1, title: 'Clarify character motivations', grade: 'fair', text: 'Consider providing more background on the character’s motivations to enhance depth.' },
  { id: 2, title: 'Expand on world-building', grade: 'bad', text: 'The world description lacks detail. Include more elements that define the setting and its culture.' },
  { id: 3, title: 'Strengthen conflict resolution', grade: 'good', text: 'The resolution is well thought out, but consider adding more emotional stakes to engage the reader.' },
  ];

	const { fetchFeedback } = useAppContext();
	const [selectedCard, setSelectedCard] = useState(null);
	const [feedbackData, setFeedbackData] = useState(defaultFeedback);

	useEffect(() => {
		const loadFeedback = async () => {
			if (selectedCard) {
				const response = await fetchFeedback(selectedCard);
				setFeedback({title: selectedCard, text: response.data.feedback});
			}
		};

		loadFeedback();
	}, [selectedCard]);

  const setFeedback = (data) => {
    const newFeedback = defaultFeedback.map((item)=>(
      item.title === data.title ? {...item, text: data.text} : item
    ))
    setFeedbackData(newFeedback)
  }
	return (
		<Box
			sx={{
				width: '100%',
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',
				bgcolor: 'white',
				backgroundImage: 'linear-gradient(#e5e5e5 2px, transparent 1px)',
				backgroundSize: '100% 30px',
				backgroundRepeat: 'repeat-y',
			}}
		>
			{/* Header */}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					p: 1,
					width: '100%'
				}}
			>
				<Typography
					sx={{
						color: '#D8F651',
						fontFamily: 'PixelSplitter, monospace',
						fontSize: '1.2rem',
						pl: 4,
						pt: 2
					}}
				>
					FREE<span style={{color: 'blue'}}>WRITER</span>
				</Typography>
				<Box>
					<IconButton sx={{ color: '#000',}}>
						<QuestionMarkIcon sx={{border: '1px solid #000', borderRadius: 50, fontSize: '1rem'}} />
					</IconButton>
					<IconButton sx={{ color: '#000' }}>
						<SettingsIcon sx={{fontSize: '1rem'}} />
					</IconButton>
				</Box>
			</Box>

			{/* Main Content */}
			<Box
				sx={{
					flex: 1,
					display: 'flex',
					gap: 4,
					width: '100%'
				}}
			>
				{/* Left Side - Cards */}
				<Box sx={{
					width: selectedCard ? '35%' : '100%',
					bgcolor: 'black', 
					transition: 'width 0.6s',
					display: 'flex', 
					justifyContent: 'center', 
					alignItems: 'center',
					gap: 8,
					pt: 2,
					borderRadius: '20px 20px 0 0'
				}}
				>
					{cards.map((card, index) => (
						<Box
							key={card.title}
							sx={{
								mb: 2,
								display: selectedCard ? (selectedCard === card.title ? 'block' : 'none') : 'block',
								transition: 'all 0.6s',
							}}
						>
							<FlipCard
								{...card}
								onClick={() => {
									setTimeout(() => {
										setSelectedCard(card.title)
										
									}, 500); 
								}}
								isSelected={selectedCard === card.title}
							/>
						</Box>
					))}
				</Box>

				{/* Middle - Editing Interface */}
				{selectedCard && (
					<Box sx={{ width: '47%', p: 2, bgcolor: '#fff', borderRadius: 2, border: `3px solid ${cards.find((item)=>(item.title === selectedCard)).color}` }}>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, zIndex: 111, position: 'absolute', top: 80, left: 20 }}>
							<IconButton onClick={() => setSelectedCard(null)}>
								<Icons.BackArrowIcon sx={{color: '#fff'}} />
							</IconButton>
						</Box>
						<EditInterface title={selectedCard} setFeedback={setFeedback} setSelectedCard={setSelectedCard} />
					</Box>
				)}

				{/* Right Side - AI Feedback */}
				{selectedCard && (
					<Box sx={{ width: '18%', pr: 1 }}>
						<AIFeedback feedbackToRender={feedbackData} />
					</Box>
				)}
			</Box>
		</Box>
	);
}