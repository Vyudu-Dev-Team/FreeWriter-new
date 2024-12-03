// functions/logout.js
export const handler = async (event, context) => {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Logout successful' }),
      headers: {
        'Set-Cookie': 'jwt=; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }
    };
  };