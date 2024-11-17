exports.handler = async (event, context) => {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Permite qualquer origem
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", // Permite métodos comuns
        "Access-Control-Allow-Headers": "Content-Type", // Permite cabeçalhos específicos
      },
      body: JSON.stringify({ message: "Hello from the backend!" }),
    };
  };
  