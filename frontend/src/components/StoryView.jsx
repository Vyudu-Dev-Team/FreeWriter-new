import { Box, Button, Card, CardContent, Typography, IconButton, Stack } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/material/styles'

// Custom styled components
const RetroContainer = styled(Box)({
  background: '#000',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  padding: '1rem',
})

const RetroTypography = styled(Typography)({
  fontFamily: '"Press Start 2P", monospace',
  textTransform: 'uppercase',
})

const RetroButton = styled(Button)(({ theme, variant }) => ({
  fontFamily: 'PixelSplitter, monospace',
  padding: '0.75rem 1.5rem',
  borderRadius: '4px',
  textTransform: 'uppercase',
  fontSize: '1rem',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  width: '100%',
  ...(variant === 'contained' && {
    backgroundColor: '#c9ff2e',
    color: '#000',
    '&:hover': {
      backgroundColor: '#d4ff5e',
      boxShadow: '0 0 20px rgba(201, 255, 46, 0.5)',
    },
  }),
  ...(variant === 'secondary' && {
    backgroundColor: '#4a1e9e',
    color: '#fff',
		mx: '1rem',
    '&:hover': {
      backgroundColor: '#fff',
    	color: '#5f2ac7',
      boxShadow: '0 0 20px rgba(74, 30, 158, 0.5)',
      margin: '0 1rem',
    },
  }),
  ...(variant === 'holy' && {
    backgroundColor: '#fff',
    color: '#5f2ac7',
    '&:hover': {
      backgroundColor: '#5f2ac7',
			color: '#fff',
      boxShadow: '0 0 20px rgba(74, 30, 158, 0.5)',
    },
  }),
}))

const StoryCard = styled(Card)({
  borderRadius: '8px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
})

export default function StoryView() {
  return (
    <RetroContainer>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, color: '#fff' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton size="small" sx={{ color: '#fff' }}>
            <ArrowBackIcon />
          </IconButton>
          <RetroTypography
            variant="subtitle1"
            sx={{
              color: '#c9ff2e',
              fontSize: '0.8rem',
            }}
          >
            FREEWRITER
          </RetroTypography>
        </Stack>
        <IconButton size="small" sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 1, width: '85%', mx: 'auto'}}>
        {/* Story Image */}
        <Box
          sx={{
            flex: 1,
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <img
            src="/assets/images/character.png"
            alt="Story illustration"
            style={{
              width: '80%',
              height: '500px',
              objectFit: 'cover',
              
            }}
          />
        </Box>

        {/* Story Details */}
        <StoryCard sx={{ flex: 1, }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '350px', gap: 2, backgroundColor: '#fff', }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '90%', mx: 'auto' }}>
              <Typography
                variant="caption"
                sx={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                }}
              >
                GENRE, SCI-FI
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                }}
              >
                PURPOSE, BUSINESS
              </Typography>
            </Box>

            <RetroTypography variant="h6" sx={{ color: '#000', fontSize: '1rem', mb: 2 }}>
              TITLE OF CARD / STORY
            </RetroTypography>

            <Typography
              variant="body2"
              sx={{
                flex: 1,
                color: '#666',
                lineHeight: 1.6,
                mb: 2,
								overflow: 'auto'
              }}
            >
              Here will be the first couple of lines of the story. Perhaps a regular quote to help guide the reader into the story. Maybe a description of the scene or a bit of dialogue that sets up the mood. The text will be generated as part of the back of the card. It will set the tone for any...
              Here will be the first couple of lines of the story. Perhaps a regular quote to help guide the reader into the story. Maybe a description of the scene or a bit of dialogue that sets up the mood. The text will be generated as part of the back of the card. It will set the tone for any...
            </Typography>

          </CardContent>
            <Stack spacing={1} bgcolor={'#000'} pt={2} direction={'column'}>
							<Stack spacing={1} direction={'row'}>
								<RetroButton variant="contained">
									Share this story
								</RetroButton>
								<RetroButton variant="holy">
									view story deck
								</RetroButton>
							</Stack>
              <RetroButton variant="secondary">
                Write another story with this prompt
              </RetroButton>
            </Stack>
        </StoryCard>
      </Box>
    </RetroContainer>
  )
}