import React, { useState, useEffect } from 'react';
import { Icons } from '../utils/icon';
import { Box, Typography, IconButton, TextField, Paper, Button } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import axios from 'axios';
import { useAppContext } from '../contexts/AppContext';

const BackContent = ({ title, content }) => {
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
	)
}


const FlipCard = ({ title, color, icon: Icon, image, back, onClick, isSelected }) => {
	const [isFlipped, setIsFlipped] = useState(false);
	useEffect(() => {
		setTimeout(() => {
			!isSelected && setIsFlipped(false)
		}, 600)
	}, [isSelected])

	return (
		<Box
			sx={{
				width: isSelected? 350 : 250,
				height: isSelected ? 600 : 450,
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
					transform: isFlipped ? `rotateY(180deg) ${isSelected ? 'scale(1.12)' : ' scale(1)'}` : 'rotateY(0) scale(0.8)',
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
						height: '95%',
						backfaceVisibility: 'hidden',
						borderColor: `#000`,
						boxShadow: `0 0 0 20px ${color}`,
						display: 'flex',
						flexDirection: 'column-reverse',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Typography
						sx={{
							color: color === '#D8F651' || color === '#fff' ? 'black' : 'white',
							fontFamily: 'PixelSplitter, monospace',
							fontSize: '1.2rem',
							textAlign: 'center',
							bgcolor: color,
							width: '100%',
						}}
					>
						{title}
					</Typography>
					<Box
          component="img"
          src={image}
          alt="Character"
          sx={{
            height: '100%',
						bgcolor: '#fff',
						border: '1px solid transparent',
            width: '100%',
            objectFit: 'cover',
            objectPosition: 'top'
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
					{back.map((item) => {
						return (
							<BackContent {...item} />
						)
					})}
				</Box>
			</Box>
		</Box>
	);
};

export default function FreewriterCards() {
	const cards = [
		{
			title: "CHARACTER", color: "#490BF4", image: 'assets/images/character.png', icon: Icons.CharacterIcon, back: [
				{ title: "CHARACTER NAME", content: 'A brave warrior known for their unmatched skills.' },
				{ title: "GOAL", content: 'To unite the fractured kingdoms through diplomacy.' },
				{ title: "STRENGTH", content: 'Exceptional combat skills and strategic thinking.' },
				{ title: "WEAKNESS", content: 'A tendency to trust too easily.' }
			]
		},
		{
			title: "WORLD", color: "#D8F651", image: 'assets/images/world.png', icon: Icons.WorldIcon, back: [
				{ title: "WORLD", content: 'A richly detailed setting that influences the narrative and character development. The world is filled with diverse cultures, landscapes, and histories that shape the characters’ experiences and conflicts. From the towering mountains to the vast oceans, every element of this world plays a crucial role in the unfolding story, providing a backdrop that is as dynamic and engaging as the characters themselves.' }
			]
		},
		{
			title: "CONFLICT", color: "rgba(102, 0, 210, 1)", image: 'assets/images/conflict.png', icon: Icons.ConflictIcon, back: [
				{ title: "INCIDING INCIDENT", content: 'The event that triggers the main conflict.' },
				{ title: "CONFLICT", content: 'The central struggle between opposing forces.' },
				{ title: "RESOLUTION", content: 'The outcome of the conflict, providing closure.' }
			]
		},
		{
			title: "STORY", color: "#fff", image: 'assets/images/vigil.svg', icon: Icons.CharacterIcon, back: [
				{ title: "CHARACTER NAME", content: 'A brave warrior known for their unmatched skills.' },
				{ title: "GOAL", content: 'To unite the fractured kingdoms through diplomacy.' },
				{ title: "STRENGTH", content: 'Exceptional combat skills and strategic thinking.' },
				{ title: "WEAKNESS", content: 'A tendency to trust too easily.' }
			]
		},
	];


	const defaultFeedback = [
		{ id: 1, indicator: 'CHARACTER', title: 'Clarify character motivations', grade: 'fair', text: 'Consider providing more background on the character’s motivations to enhance depth.' },
		{ id: 2, indicator: 'WORLD', title: 'Expand on world-building', grade: 'bad', text: 'The world description lacks detail. Include more elements that define the setting and its culture.' },
		{ id: 3, indicator: 'CONFLICT', title: 'Strengthen conflict resolution', grade: 'good', text: 'The resolution is well thought out, but consider adding more emotional stakes to engage the reader.' },
	];

	const { fetchFeedback } = useAppContext();
	const [selectedCard, setSelectedCard] = useState('STORY');
	const [currentCard, setCurrentCard] = useState(cards.find((card)=> card.title === selectedCard));

	useEffect(() => {
		const reset = async () => {
				const newCard = cards.find((card)=> card.title === selectedCard);
				setCurrentCard(newCard);
			}
			reset();
	
	}, [selectedCard]);

	// const setFeedback = (data) => {
	// 	const newFeedback = defaultFeedback.map((item) => (
	// 		item.indicator === data.title ? { ...item, text: data.text, grade: data.grade } : item
	// 	))
	// 	setFeedbackData(newFeedback)
	// 	console.log(feedbackData)
	// }
	return (
		<Box
			sx={{
				width: '100%',
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',
				bgcolor: 'black'
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
					FREE<span style={{ color: 'blue' }}>WRITER</span>
				</Typography>
				<Box>
					<IconButton sx={{ color: '#000', }}>
						<QuestionMarkIcon sx={{ border: '1px solid #000', borderRadius: 50, fontSize: '1rem' }} />
					</IconButton>
					<IconButton sx={{ color: '#000' }}>
						<SettingsIcon sx={{ fontSize: '1rem' }} />
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
				<Box
				 sx={{
					width: '70%',
					bgcolor: 'black',
					transition: 'width 0.6s',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					pt: 2,
					borderRadius: '20px 20px 0 0',
					
				}}
				>
					{cards.map((card, index) => (
						card.title !== selectedCard &&
						<Box
							key={card.title}
							sx={{
								mb: 2,
								ml: -10,
								display: 'block',
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
				<Box sx={{
					width: '35%',
					bgcolor: 'black',
					transition: 'width 0.6s',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					pt: 2,
					borderRadius: '20px 20px 0 0'
				}}
				>
					<FlipCard {...currentCard} isSelected={true} />
					
				</Box>
			</Box>
		</Box>
	);
}