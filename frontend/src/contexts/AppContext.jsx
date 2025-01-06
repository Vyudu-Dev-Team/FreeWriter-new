import React, { createContext, useContext, useReducer, useEffect } from "react";
import { userAPI, setAuthToken, aiAPI, deckAPI, fcmAPI } from "../services/api";

const AppContext = createContext();

const initialState = {
  user: null,
  stories: [], 
  currentStory: null,
  notifications: [],
  badges: [],
  loading: false,
  error: null,
  fcmToken: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_STORIES":
      return { ...state, stories: action.payload };
    case "SET_CURRENT_STORY":
      return { ...state, currentStory: action.payload };
    case "SET_NOTIFICATIONS":
      return { ...state, notifications: action.payload };
    case "SET_BADGES":
      return { ...state, badges: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_FCM_TOKEN":
      return { ...state, fcmToken: action.payload };
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      fetchUser();
    }
  }, []);

  const fetchUser = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      setAuthToken(token);

      const res = await userAPI.getCurrentUser();
      console.log("Current user response:", res);

      if (!res.data) {
        throw new Error("No user data in response");
      }

      dispatch({ type: "SET_USER", payload: res.data });

      if (res.data.fcmToken) {
        dispatch({ type: "SET_FCM_TOKEN", payload: res.data.fcmToken });
      }

      dispatch({ type: "SET_ERROR", payload: null });
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
      setAuthToken(null);
      dispatch({ type: "SET_USER", payload: null });
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch user data" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const login = async ({ email, password }) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const res = await userAPI.login(email, password);
      console.log("Login response:", res);

      if (!res.data || !res.data.token) {
        throw new Error("No authentication token received");
      }

      localStorage.setItem("token", res.data.token);
      setAuthToken(res.data.token);

      await fetchUser();

      dispatch({ type: "SET_ERROR", payload: null });
      return true;
    } catch (error) {
      console.error("Login error:", error);
      localStorage.removeItem("token");
      setAuthToken(null);
      dispatch({
        type: "SET_ERROR",
        payload:
          error.response?.data?.message || error.message || "Login failed",
      });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const register = async (data) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const { username, email, password, writingMode, deviceToken } = data;

      console.log("Sending registration request with:", {
        username,
        email,
        writingMode,
        deviceToken,
      });

      const res = await userAPI.register(
        username,
        email,
        password,
        writingMode,
        deviceToken
      );

      console.log("Full registration response:", res);

      const { user, success, message } = res.data;

      if (!success) {
        throw new Error(message || "Registration failed");
      }

      dispatch({ type: "SET_USER", payload: user });
      dispatch({ type: "SET_ERROR", payload: null });

      // Instead of expecting a token, we'll show a success message
      return {
        success: true,
        message:
          "Registration successful. Please check your email to verify your account.",
      };
    } catch (error) {
      console.error("Full registration error:", error);
      dispatch({
        type: "SET_ERROR",
        payload:
          error.response?.data?.message ||
          error.message ||
          "Registration failed",
      });
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Registration failed",
      };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    dispatch({ type: "LOGOUT" });
  };

  const saveProfile = async (profileData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await userAPI.updateProfile(profileData);
      dispatch({ type: "SET_USER", payload: res.data });
      dispatch({ type: "SET_ERROR", payload: null });
      return true;
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Failed to update profile",
      });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const verifyEmail = async (token) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await userAPI.verifyEmail(token);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setAuthToken(res.data.token);
        await fetchUser();
      }

      dispatch({ type: "SET_ERROR", payload: null });
      return true;
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Email verification failed",
      });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const resendVerification = async (email) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await userAPI.resendVerificationEmail(email);
      dispatch({ type: "SET_ERROR", payload: null });
      return true;
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error.response?.data?.message ||
          "Failed to resend verification email",
      });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const fetchContent = async (title) => {
    // TODO: random story id for testing
    let storyId = "123";
    try {
      // fetching character, conflict, and world card content by querrying with their title and storyid
      const res = await deckAPI.getCardContent(title, storyId);
      return res.data;
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Failed to fetch content",
      });
      return null; // Return null or handle as needed
    }
  };

  const saveContent = async (title, content) => {
    // TODO: random story id for testing
    let storyId = "123";
    try {
      const res = await deckAPI.saveCardContent({ content, storyId, title });
      return res.data;
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Failed to save content",
      });
      return null; // Return null or handle as needed
    }
  };

  const fetchFeedback = async (cardTitle) => {
    // TODO: random story id for testing
    let storyId = "123";

    try {
      const res = await aiAPI.submitFeedback({ cardTitle, storyId });
      return res.data;
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Failed to save content",
      });
      return null; // Return null or handle as needed
    }
  };
  const updateFCMToken = async (token) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await userAPI.updateFCMToken(token);
      dispatch({ type: "SET_FCM_TOKEN", payload: token });
      dispatch({ type: "SET_ERROR", payload: null });
      return true;
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Failed to update FCM token",
      });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const testFCMNotification = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await fcmAPI.testNotification();
      dispatch({ type: "SET_ERROR", payload: null });
      return true;
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error.response?.data?.message || "Failed to send test notification",
      });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const value = {
    state,
    dispatch,
    login,
    register,
    saveProfile,
    logout,
    verifyEmail,
    resendVerification,
    fetchContent,
    saveContent,
    fetchFeedback,
    updateFCMToken,
    testFCMNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
