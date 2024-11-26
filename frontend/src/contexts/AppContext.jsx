import React, { createContext, useContext, useReducer, useEffect } from "react";
import { userAPI, setAuthToken } from "../services/api";

const AppContext = createContext();

const initialState = {
  user: null,
  stories: [],
  currentStory: null,
  notifications: [],
  badges: [],
  loading: false,
  error: null,
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
      const res = await userAPI.getCurrentUser();
      dispatch({ type: "SET_USER", payload: res.data });
      dispatch({ type: "SET_ERROR", payload: null });
    } catch (error) {
      console.error("Error fetching user:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch user data" });
      localStorage.removeItem("token");
      setAuthToken(null);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const login = async ({ email, password }) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await userAPI.login(email, password);
      localStorage.setItem("token", res.data.token);
      setAuthToken(res.data.token);
      await fetchUser();
      dispatch({ type: "SET_ERROR", payload: null });
      return true;
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Login failed",
      });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const register = async (data) => {
    try {
      console.log("AppContext register called with:", data);
      dispatch({ type: "SET_LOADING", payload: true });

      // Destructure the data to match the API method signature
      const { username, email, password, writingMode } = data;

      console.log("Calling userAPI.register with:", {
        username,
        email,
        password,
        writingMode,
      });

      const res = await userAPI.register(
        username,
        email,
        password,
        writingMode
      );

      console.log("Register API response:", res);

      localStorage.setItem("token", res.data.token);
      setAuthToken(res.data.token);

      await fetchUser();
      dispatch({ type: "SET_ERROR", payload: null });
      return true;
    } catch (error) {
      console.error("Full registration error:", error);
      console.error("Error response:", error.response);

      // More detailed error logging
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
      }

      dispatch({
        type: "SET_ERROR",
        payload:
          error.response?.data?.message ||
          error.message ||
          "Registration failed",
      });
      return false;
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
      
      // Update token if a new one is provided
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
        payload: error.response?.data?.message || "Email verification failed"
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
        payload: error.response?.data?.message || "Failed to resend verification email"
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
    resendVerification
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
