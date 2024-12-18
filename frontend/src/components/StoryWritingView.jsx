import React from "react";
import {
    Box,
    Container,
    Grid,
    Typography,
    IconButton,
    Link,
    Paper,
    Button,
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
    flexDirection: "row",
    alignItems: "start",
    padding: "2rem",
    overflow: "hidden",
    color: "#fff",
});

const Sidebar = styled(Box)({
    width: "300px",
    backgroundColor: "#000",
    borderRadius: "12px",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
});

const MainContent = styled(Paper)({
    flex: 1,
    padding: "2rem",
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "3px solid #000",
    fontFamily: 'PixelSplitter, "Courier New", monospace',
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
    marginLeft: "1rem",
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

export default function StoryWritingView() {
    return (
        <ThemeProvider theme={theme}>
            <StyledContainer>
                <Box
                    sx={{
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
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
                        <Sidebar sx={{ position: "relative", overflow: "hidden" }}>
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
                                        backgroundColor: "#6c5ce7",
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
                                    <CategoryCardContent style={{ justifyContent: "flex-start" }}>
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
                                    <CategoryCardContent style={{ justifyContent: "flex-start" }}>
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
                                    <CategoryCardContent style={{ justifyContent: "flex-start" }}>
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
                            </Box>
                        </Sidebar>

                        {/* Main Content */}
                        <MainContent>
                            <Box display="flex" gap={2} alignItems="end">
                                <Typography
                                    variant="body1"
                                    sx={{ color: theme.palette.primary.main, display: "flex", alignItems: "center" }}
                                >
                                    Writing Points
                                    <Star sx={{ color: theme.palette.primary.main, marginRight: "4px" }} />
                                    1000
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={2}>
                                <Typography
                                    variant="h6"
                                    style={{
                                        fontFamily: 'PixelSplitter, "Courier New", monospace',
                                    }}
                                >
                                    GENRE: SCI-FI
                                </Typography>
                                <Typography
                                    variant="h6"
                                    style={{
                                        fontFamily: 'PixelSplitter, "Courier New", monospace',
                                    }}
                                >
                                    PURPOSE: BUSINESS
                                </Typography>
                            </Box>
                            <Typography
                                variant="h4"
                                fontWeight="bold"
                                mb={2}
                                style={{
                                    fontFamily: 'PixelSplitter, "Courier New", monospace',
                                }}
                            >
                                TITLE OF CARD / STORY
                            </Typography>
                            <Typography
                                variant="body1"
                                style={{
                                    lineHeight: "1.6rem",
                                    fontFamily: 'PixelSplitter, "Courier New", monospace',
                                }}
                            >
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu
                                nulla nec arcu imperdiet lacinia. Suspendisse et velit nulla. Nunc
                                sed elit et orci aliquam pretium nec vitae justo. Duis auctor urna
                                et lorem feugiat, iaculis lobortis eros tincidunt. Nullam bibendum
                                eleifend accumsan. Aliquam quis semper nulla. Orci varius natoque
                                penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                                Maecenas quis fringilla nisi, non tincidunt lectus. Nullam sit amet
                                nunc urna. Praesent euismod mollis mi sit amet tempus. Vivamus eu
                                ligula fermentum, ornare tortor ut, bibendum leo. Fusce leo neque,
                                vulputate vel nunc in, tempus tincidunt arcu. Donec vel interdum
                                lorem. Vestibulum sed nunc imperdiet, scelerisque felis
                                ullamcorper, rhoncus enim. Praesent commodo rhoncus venenatis. Ut
                                scelerisque lacus ac libero tincidunt, sed dictum orci laoreet.
                            </Typography>
                            <Typography
                                variant="body1"
                                mt={2}
                                style={{
                                    lineHeight: "1.6rem",
                                    fontFamily: 'PixelSplitter, "Courier New", monospace',
                                }}
                            >
                                Etiam massa sapien, sollicitudin quis imperdiet sed, congue
                                imperdiet purus. Vestibulum congue libero augue, a interdum felis
                                ullamcorper sit amet. Vestibulum vehicula odio nec libero
                                pellentesque iaculis. Aenean eget neque vel enim porta lobortis ut
                                nec erat. Fusce pellentesque lectus non libero eleifend posuere.
                                Mauris eget orci at nisi scelerisque viverra a non ligula. Nulla
                                scelerisque malesuada mauris sit amet ultricies.
                            </Typography>
                        </MainContent>
                    </Box>
                </Box>
            </StyledContainer>
        </ThemeProvider>
    );
}


