export const fetchNotifications = () => {
    return Promise.resolve([
      { id: 1, message: 'Welcome to FreeWriter!' },
      { id: 2, message: 'Your AI prompt is ready.' },
    ]);
  };