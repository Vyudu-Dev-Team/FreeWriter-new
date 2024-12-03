import React from "react";
import {
    Box,
    Container,
    Typography,
    IconButton,
    Paper,
    Button,
    Link,
} from "@mui/material";
import { HelpOutline, Settings, Star } from "@mui/icons-material";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#6c5ce7",
        },
        secondary: {
            main: "#b8ff57",
        },
        background: {
            default: "#000",
        },
    },
    typography: {
        fontFamily: 'PixelSplitter, "Courier New", monospace',
    },
});

const StyledContainer = styled(Container)({
    minHeight: "100vh",
    width: "100vw",
    maxWidth: "100% !important",
    backgroundImage: 'url("/assets/images/bg-grid.svg")',
    backgroundSize: "contain",
    backgroundRepeat: "repeat",
    display: "flex",
    flexDirection: "column",
    padding: "2rem",
    color: "#fff",
});

const Sidebar = styled(Box)({
    width: "250px",
    backgroundColor: "#000",
    borderRadius: "12px",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
});

const MainContent = styled(Paper)({
    flex: 1,
    padding: "2rem",
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "3px solid #000",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
    margin: "0 1rem",
});

const FeedbackPanel = styled(Box)({
    width: "300px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "1rem",
    border: "3px solid #000",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    fontFamily: 'PixelSplitter, "Courier New", monospace',
});

const FeedbackItem = styled(Box)(({ index }) => ({
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    alignItems: "flex-start",
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: index === 1 ? "#b8ff57" : index === 2 ? "#b8ff57" : "#6c5ce7",
    border: "2px solid #000",
    color: index === 3 ? "#fff" : "#000",
}));

const FeedbackNumber = styled(Box)(({ index }) => ({
    backgroundColor: index === 1 ? "#b8ff57" : index === 2 ? "#b8ff57" : "#6c5ce7",
    color: index === 3 ? "#fff" : "#000",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "18px",
    marginRight: "8px",
}));

const EndLoglineButton = styled(Button)({
    backgroundColor: "#000",
    color: "#b8ff57",
    fontWeight: "bold",
    fontFamily: 'PixelSplitter, "Courier New", monospace',
    padding: "10px 20px",
    border: "3px solid #000",
    borderRadius: "8px",
    "&:hover": {
        backgroundColor: "#222",
    },
});

const CategoryCard = styled(Box)(({ color }) => ({
    position: "relative",
    width: "220px",
    height: "300px",
    backgroundColor: color === "primary" ? "#6c5ce7" : "#b8ff57",
    color: color === "primary" ? "#fff" : "#000",
    borderRadius: "16px",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "transform 0.2s",
    "&:hover": {
        transform: "translateY(-5px)",
    },
}));

const CategoryCardContent = styled(Box)({
    borderRadius: "inherit",
    border: "3px solid #000",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
});

export default function StoryWritingViewWithFeedback() {
    return (
        <ThemeProvider theme={theme}>
            <StyledContainer>
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1rem",
                        padding: "0 1rem",
                    }}
                >
                    {/* Logo */}
                    <Link href="/" style={{ textDecoration: "none" }}>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{ color: "#fff", fontFamily: 'PixelSplitter, "Courier New", monospace' }}
                        >
                            <span style={{ color: theme.palette.secondary.main }}>FREE</span>
                            <span style={{ color: theme.palette.primary.main }}>WRITER</span>
                        </Typography>
                    </Link>

                    {/* Icons */}
                    <Box display="flex" gap={2}>
                        <IconButton style={{ color: "#000" }}>
                            <HelpOutline />
                        </IconButton>
                        <IconButton style={{ color: "#000" }}>
                            <Settings />
                        </IconButton>
                    </Box>
                </Box>

                {/* Content */}
                <Box
                    sx={{
                        display: "flex",
                        flex: 1,
                        overflow: "hidden",
                        height: "calc(100vh - 100px)",
                    }}
                >

                    {/* Sidebar */}

                    <Sidebar style={{ overflow: "hidden" }}>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <IconButton
                                style={{
                                    backgroundColor: "#000",
                                    borderRadius: "50%",
                                    width: "50px",
                                    height: "50px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Typography
                                    style={{
                                        color: "#fff",
                                        fontFamily: 'PixelSplitter, "Courier New", monospace',
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {"<<"}
                                </Typography>
                            </IconButton>
                            <Typography
                                style={{
                                    fontFamily: 'PixelSplitter, "Courier New", monospace',
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    color: "#fff",
                                }}
                            >
                                Back to Story Deck
                            </Typography>
                        </Box>

                        <CategoryCard
                            style={{
                                backgroundColor: "#fff",
                                border: "3px solid #000",
                                zIndex: 3,
                            }}
                        >
                            <CategoryCardContent>
                                <Typography
                                    variant="h5"
                                    style={{
                                        fontFamily: 'PixelSplitter, "Courier New", monospace',
                                        marginBottom: "1rem",
                                    }}
                                >
                                    STORY LOGLINE
                                </Typography>
                                <Box
                                    component="img"
                                    src="/assets/images/idea-1.svg"
                                    alt="Story Logline"
                                    sx={{ width: 100, height: 100 }}
                                />
                            </CategoryCardContent>
                        </CategoryCard>

                        <Box sx={{ position: "relative", width: "100%" }}>
                            <CategoryCard
                                style={{
                                    backgroundColor: "#490bf4",
                                    color: "#fff",
                                    position: "absolute",
                                    top: "0px",
                                    zIndex: 1,
                                    width: "90%",
                                    left: "5%",
                                    borderRadius: "16px",
                                    height: "300px",
                                    justifyContent: "flex-start",
                                }}
                            >
                                <CategoryCardContent style={{ justifyContent: "flex-start", paddingTop: "15px" }}>
                                    <Typography
                                        variant="h5"
                                        style={{
                                            fontFamily: 'PixelSplitter, "Courier New", monospace',
                                        }}
                                    >
                                        CHARACTER
                                    </Typography>
                                </CategoryCardContent>
                            </CategoryCard>

                            <CategoryCard
                                style={{
                                    backgroundColor: "#b8ff57",
                                    color: "#000",
                                    position: "absolute",
                                    top: "75px",
                                    zIndex: 2,
                                    width: "90%",
                                    left: "5%",
                                    borderRadius: "16px",
                                    height: "300px",
                                    justifyContent: "flex-start",
                                }}
                            >
                                <CategoryCardContent style={{ justifyContent: "flex-start", paddingTop: "15px" }}>
                                    <Typography
                                        variant="h5"
                                        style={{
                                            fontFamily: 'PixelSplitter, "Courier New", monospace',
                                        }}
                                    >
                                        WORLD
                                    </Typography>
                                </CategoryCardContent>
                            </CategoryCard>

                            <CategoryCard
                                style={{
                                    backgroundColor: "#6c5ce7",
                                    color: "#fff",
                                    position: "absolute",
                                    top: "150px",
                                    zIndex: 3,
                                    width: "90%",
                                    left: "5%",
                                    borderRadius: "16px",
                                    height: "300px",
                                }}
                            >
                                <CategoryCardContent style={{ justifyContent: "flex-start", paddingTop: "15px" }}>
                                    <Typography
                                        variant="h5"
                                        style={{
                                            fontFamily: 'PixelSplitter, "Courier New", monospace',
                                        }}
                                    >
                                        CONFLICT
                                    </Typography>
                                </CategoryCardContent>
                            </CategoryCard>
                            <CategoryCard
                                style={{
                                    backgroundColor: "#fff",
                                    color: "#000",
                                    position: "absolute",
                                    top: "220px",
                                    zIndex: 4,
                                    width: "90%",
                                    left: "5%",
                                    borderRadius: "16px",
                                    height: "300px",
                                }}
                            >
                                <CategoryCardContent style={{ justifyContent: "flex-start", paddingTop: "15px" }}>
                                    <Typography
                                        variant="h5"
                                        style={{
                                            fontFamily: 'PixelSplitter, "Courier New", monospace',
                                        }}
                                    >
                                        PLOT TWIST
                                    </Typography>
                                </CategoryCardContent>
                            </CategoryCard>
                        </Box>
                    </Sidebar>

                    {/* Main Content */}
                    <MainContent>
                        <Box display="flex" justifyContent="end">
                            <Typography
                                variant="body1"
                                sx={{
                                    color: theme.palette.primary.main,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                Writing Points
                                <Star sx={{ marginLeft: "8px" }} /> 1700
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" my={2}>
                            <Typography variant="h6">GENRE: SCI-FI</Typography>
                            <Typography variant="h6">PURPOSE: BUSINESS</Typography>
                        </Box>
                        <Typography variant="h4" fontWeight="bold" mb={2}>
                            TITLE OF CARD / STORY
                        </Typography>
                        <Typography
                            variant="body1"
                            style={{
                                lineHeight: "1.6rem",
                                fontFamily: 'PixelSplitter, "Courier New", monospace',
                            }}
                        >
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Morbi eu nulla nec arcu imperdiet lacinia. Suspendisse et velit nulla.
                            Nunc sed elit et orci aliquam pretium nec vitae justo. Duis auctor urna et lorem
                            feugiat, iaculis lobortis eros tincidunt.
                        </Typography>
                    </MainContent>

                    {/* Feedback Panel */}
                    <FeedbackPanel>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            style={{
                                fontFamily: 'PixelSplitter, "Courier New", monospace',
                                fontSize: "16px",
                            }}
                        >
                            VIRGIL'S FEEDBACK:
                        </Typography>

                        {/* Feedback Items */}
                        {[1, 2, 3].map((index) => (
                            <FeedbackItem key={index} index={index}>
                                <FeedbackNumber index={index}>{index}</FeedbackNumber>
                                <Box>
                                    <Typography
                                        variant="h6"
                                        style={{
                                            fontFamily: 'PixelSplitter, "Courier New", monospace',
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {index === 1
                                            ? "SENTENCE HARD TO READ"
                                            : index === 2
                                                ? "SIMPLIFY THE SENTENCE"
                                                : "GOOD ENDING OF PHRASE"}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        style={{
                                            fontFamily: 'PixelSplitter, "Courier New", monospace',
                                            fontSize: "12px",
                                        }}
                                    >
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu nulla
                                        nec arcu imperdiet lacinia.
                                    </Typography>
                                </Box>
                            </FeedbackItem>
                        ))}

                        {/* End Logline Button */}
                        <EndLoglineButton>END LOGLINE</EndLoglineButton>
                    </FeedbackPanel>
                </Box>
            </StyledContainer>
        </ThemeProvider >
    );
}
