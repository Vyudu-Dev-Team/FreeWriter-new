# Deployment Guide for freeWriter

This guide outlines the steps to deploy freeWriter to a production environment using Vercel.

## Prerequisites

- Node.js (v14 or later)
- Vercel account
- Git

## Deployment Steps

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Navigate to the project root:
   ```
   cd freewriter
   ```

4. Deploy to Vercel:
   ```
   vercel
   ```

5. Follow the prompts to link your project to Vercel.

6. Set up environment variables in Vercel:
   - Go to your project settings on the Vercel dashboard
   - Add the following environment variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `MONGODB_DB`: Your MongoDB database name
     - `JWT_SECRET`: A secret key for JWT token generation
     - `OPENAI_API_KEY`: Your OpenAI API key (if using AI features)

7. Trigger a new deployment:
   ```
   vercel --prod
   ```

## Post-Deployment Steps

1. Test the application thoroughly to ensure all features are working as expected.

2. Set up monitoring and logging services (e.g., Sentry, LogRocket) for both frontend and backend.

3. Configure custom domain and SSL certificates if not automatically handled by Vercel.

4. Set up a CI/CD pipeline for automated deployments (optional).

For any issues or additional configuration needs, please refer to the [Vercel documentation](https://vercel.com/docs).