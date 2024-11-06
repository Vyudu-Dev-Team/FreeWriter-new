import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { userAPI, setAuthToken } from '../services/api';

const AppContext = createContext();

const initialState = {
  user: null,
  stories: [],
  currentStory: null,
  notifications: [],
  badges: [],
  loading: false,
  error: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_STORIES':
      return { ...state, stories: action.payload };
    case 'SET_CURRENT_STORY':
      return { ...state, currentStory: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'SET_BADGES':
      return { ...state, badges: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      fetchUser();
    }
  }, []);

  const fetchUser = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await userAPI.getCurrentUser();
      dispatch({ type: 'SET_USER', payload: res.data });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      console.error('Error fetching user:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch user data' });
      localStorage.removeItem('token');
      setAuthToken(null);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await userAPI.login(email, password);
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      await fetchUser();
      dispatch({ type: 'SET_ERROR', payload: null });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Login failed' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (username, email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await userAPI.register(username, email, password);
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      await fetchUser();
      dispatch({ type: 'SET_ERROR', payload: null });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Registration failed' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    dispatch({ type: 'LOGOUT' });
  };

  const value = {
    state,
    dispatch,
    login,
    register,
    logout
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
