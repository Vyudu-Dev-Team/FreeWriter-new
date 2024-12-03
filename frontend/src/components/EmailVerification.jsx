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
    message: 'Verifying your email...'
  });

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        const response = await userAPI.verifyEmail(token);
        
        setVerificationStatus({
          loading: false,
          success: true,
          message: response.data.message || 'Email verified successfully!'
        });

        // Redirect to login with success message
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Email verified successfully! You can now log in.',
              type: 'success'
            } 
          });
        }, 2000);

      } catch (error) {
        console.error('Email verification error:', error);
        setVerificationStatus({
          loading: false,
          success: false,
          message: error.response?.data?.message || 'Email verification failed'
        });

        // Redirect to login with error message
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: error.response?.data?.message || 'Email verification failed',
              type: 'error'
            } 
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