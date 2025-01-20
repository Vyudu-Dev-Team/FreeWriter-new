import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAppContext } from '../contexts/AppContext';

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useAppContext();
  const [verificationStatus, setVerificationStatus] = useState({
    loading: true,
    success: false,
    message: 'Verifying your email...',
  });

  // Decode token function
  const decodeToken = (encodedToken) => {
    if (!encodedToken) {
      throw new Error('No token provided');
    }
  
    try {
      // Reverse base64URL encoding
      let base64 = encodedToken
        .replace(/-/g, '+')  // Convert '-' back to '+'
        .replace(/_/g, '/'); // Convert '_' back to '/'
  
      // Add padding if needed
      while (base64.length % 4) {
        base64 += '=';
      }
  
      // Decode the base64 string using atob
      const decodedToken = atob(base64);
  
      return decodedToken;
    } catch (error) {
      throw new Error(`Failed to decode token: ${error.message}`);
    }
  };

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const decodedToken = decodeToken(token);
        console.log('Decoded token:', decodedToken);

        if (!decodedToken) {
          throw new Error('Invalid verification token');
        }

        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await userAPI.verifyEmail(decodedToken);

        setVerificationStatus({
          loading: false,
          success: true,
          message: response.data.message,
        });

        if (response.data.Token) {
          localStorage.setItem('Token', response.data.Token);
          setAuthToken(response.data.Token);
        }

        setTimeout(() => {
          navigate('/login', {
            state: {
              message: 'Email verified successfully! You can now log in.',
              type: 'success',
            },
          });
        }, 2000);
      } catch (error) {
        console.error('Email verification error:', error);
        setVerificationStatus({
          loading: false,
          success: false,
          message: error.response?.data?.message || 'Email verification failed',
        });

        setTimeout(() => {
          navigate('/login', {
            state: {
              message: error.response?.data?.message || 'Email verification failed',
              type: 'error',
            },
          });
        }, 2000);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate, dispatch]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg text-center">
        {verificationStatus.loading ? (
          <div>
            <p className="text-xl text-blue-500">Verifying your email...</p>
            <div className="animate-spin w-10 h-10 border-4 border-blue-300 border-t-blue-600 rounded-full mx-auto mt-4"></div>
          </div>
        ) : verificationStatus.success ? (
          <div>
            <h2 className="text-2xl text-green-600 mb-4">Email Verified!</h2>
            <p className="text-green-500">{verificationStatus.message}</p>
            <p className="mt-4">Redirecting to login...</p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl text-red-600 mb-4">Verification Failed</h2>
            <p className="text-red-500">{verificationStatus.message}</p>
            <p className="mt-4">Redirecting to login...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
