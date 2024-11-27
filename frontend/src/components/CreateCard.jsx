import React, { useState, useEffect } from 'react';
import { Icons } from '../utils/icon';
import { Box, Typography, IconButton, TextField, Paper } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import PersonIcon from '@mui/icons-material/Person';
import PublicIcon from '@mui/icons-material/Public';
import FlareIcon from '@mui/icons-material/Flare';
import CloseIcon from '@mui/icons-material/Close';

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

// const FlipCard = ({ title, color, icon: Icon, onClick, isSelected }) => {
//   return (
//     <Box
//       sx={{
//         width: 200,
//         height: 300,
//         perspective: '1000px',
//         cursor: 'pointer',
//         transition: 'all 0.6s',
//         transform: isSelected ? 'scale(0.8)' : 'scale(1)',
//       }}
//       onClick={onClick}
//     >
//       <Box
//         sx={{
//           position: 'relative',
//           width: '100%',
//           height: '100%',
//           transformStyle: 'preserve-3d',
//         }}
//       >
//         <Box
//           sx={{
//             position: 'absolute',
//             width: '100%',
//             height: '100%',
//             backfaceVisibility: 'hidden',
//             bgcolor: color,
//             borderRadius: 2,
//             border: '4px solid',
//             borderColor: `${color === '#D8F651' ? 'black' : color}`,
//             boxShadow: `0 0 20px ${color === '#D8F651' ? '#D8F651' : '#490BF4'}`,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             gap: 2,
//           }}
//         >
//           <Icon 
//             sx={{ 
//               fontSize: 60, 
//               color: color === '#D8F651' ? 'black' : 'white',
//             }} 
//           />
//           <Typography
//             sx={{
//               color: color === '#D8F651' ? 'black' : 'white',
//               fontFamily: 'PixelSplitter, monospace',
//               fontSize: '1.2rem',
//               textAlign: 'center',
//             }}
//           >
//             {title}
//           </Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

const EditInterface = ({ title }) => {
	const [ content, setContent ] = useState();

	useEffect(()=>{
		switch (title) {
			case 'WORLD':
				setContent('how is the world and how it challenges the character?')
				break;
			case 'CONFLICT':
				setContent('what will be the inciding incident?')
				break;
			case 'CHARACTER':
				setContent('what is your character’s goal?')
				break;
			default:
				break;
		}
	}, [title])
	return (

			<Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
		<Typography variant="h6" 
			
		sx={{ mb: 2, pl: 2, border: 'none', fontFamily: 'PixelSplitter, monospace', width: '70%', textAlign: 'left', fontSize: '1rem' }}>
       {content}
    </Typography>
    <TextField
      fullWidth
      multiline
			outlined={'none'}
			focused={false}
      rows={15}
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
  </Box>
	)
};

const AIFeedback = () => (
  <Paper elevation={3} sx={{ p: 4, height: '100%', bgcolor: '#fff' }}>
		
    <Typography variant="h6" sx={{ mb: 2, fontFamily: 'PixelSplitter, monospace', fontSize: '0.9rem'  }}>
      AI Feedback
    </Typography>
    <Typography sx={{ fontFamily: 'Quicksand, monospace', fontSize: '0.7rem', gap: 1, display: 'flex' }}>
    <Typography sx={{ fontFamily: 'PixelSplitter', padding: 1, px: 2, borderRadius: 2, bgcolor: 'rgba(216, 246, 81, 1)',fontSize: '0.7rem', display: 'flex', mb: 2 }}>1</Typography>
			
			<span style={{fontFamily: 'PixelSplitter'}}>define more their visual</span>
      
    </Typography>
		<Typography textAlign={'start'} mb={2} fontSize={'10px'}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu nulla nec arcu imperdiet lacinia. </Typography>
    <Typography sx={{ fontFamily: 'Quicksand, monospace', fontSize: '0.7rem',  gap: 1, display: 'flex' }}>
    <Typography sx={{ fontFamily: 'PixelSplitter', padding: 1, px: 2,borderRadius: 2, bgcolor: 'rgba(216, 246, 81, 1)', fontSize: '0.7rem', display: 'flex', mb: 2 }}>2</Typography>
			
			<span style={{fontFamily: 'PixelSplitter', }}>define more their visual</span>
      
    </Typography>
		<Typography textAlign={'start'} mb={2} fontSize={'10px'}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu nulla nec arcu imperdiet lacinia. </Typography>
    <Typography sx={{ fontFamily: 'Quicksand, monospace', fontSize: '0.7rem', gap: 1, display: 'flex' }}>
    <Typography sx={{fontFamily: 'PixelSplitter',  padding: 1, px: 2,  borderRadius: 2, bgcolor: 'rgba(73, 11, 244, 1)', color: '#fff', fontSize: '0.7rem', display: 'flex', mb: 2 }}>3</Typography>
			
			<span style={{fontFamily: 'PixelSplitter', textAlign: 'start'}}>good strength</span>
      
    </Typography>
		<Typography textAlign={'start'} mb={2} fontSize={'10px'}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu nulla nec arcu imperdiet lacinia. </Typography>
  </Paper>
);

export default function FreewriterCards() {
  const [selectedCard, setSelectedCard] = useState(null);

  const cards = [
    { title: "CHARACTER", color: "#490BF4", icon: Icons.CharacterIcon, back: [
			{title: "CHARACTER NAME", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'},
			{title: "GOAL", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'},
			{title: "STRENGTH", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'},
			{title: "WEAKNESS", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
	 ] },
    { title: "WORLD", color: "#D8F651", icon: Icons.WorldIcon, back: [
			{title: "WORLD", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu nulla nec arcu imperdiet lacinia. Suspendisse et velit nulla. Nunc sed elit et orci aliquam pretium nec vitae justo. Duis auctor urna et lorem feugiat, iaculis lobortis eros tincidunt. Nullam bibendum eleifend accumsan. Aliquam quis semper nulla. Orci varius natoque penatibusparturient montes, nascetur ridiculus mus. Maecenas quis fringilla nisi, non tincidunt lectus'}
	 ]  },
    { title: "CONFLICT", color: "rgba(102, 0, 210, 1)", icon: Icons.ConflictIcon, back: [
			{title: "INCIDING INCEDENT", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'},
			{title: "CONFLICT", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu nulla nec arcu imperdiet lacinia. Suspendisse et velit nulla. Nunc sed elit et orci aliquam pretium nec vitae justo.'},
			{title: "RESOLUTION", content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
	 ] }
  ];

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
            <EditInterface title={selectedCard} />
          </Box>
        )}

        {/* Right Side - AI Feedback */}
        {selectedCard && (
          <Box sx={{ width: '18%', pr: 1 }}>
            <AIFeedback />
          </Box>
        )}
      </Box>
    </Box>
  );
}