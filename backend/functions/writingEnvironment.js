const { MongoClient } = require( "mongodb");
const {
  validateWritingSession,
  validateAIFeedbackRequest,
} = require( "../utils/validators.js");
const logger = require( "../utils/logger.js");
const { generateAIFeedback } = require( "../services/aiService.js");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/**
 * Handles writing environment operations
 * @param {Object} event - The event object from Netlify
 * @param {Object} context - The context object from Netlify
 * @returns {Object} - The response object
 */
const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await client.connect();
    const database = client.db("freewriter");
    const writingSessions = database.collection("writingSessions");

    switch (event.httpMethod) {
      case "POST":
        if (event.path.endsWith("/feedback")) {
          return await getAIFeedback(JSON.parse(event.body));
        }
        return await createWritingSession(
          JSON.parse(event.body),
          writingSessions
        );
      case "GET":
        return await getWritingSession(
          event.queryStringParameters.id,
          writingSessions
        );
      case "PUT":
        return await updateWritingSession(
          event.queryStringParameters.id,
          JSON.parse(event.body),
          writingSessions
        );
      case "DELETE":
        return await deleteWritingSession(
          event.queryStringParameters.id,
          writingSessions
        );
      default:
        return { statusCode: 405, body: "Method Not Allowed" };
    }
  } catch (error) {
    logger.error("Error in writingEnvironment function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  } finally {
    await client.close();
  }
};
/**
 * Creates a new writing session
 * @param {Object} data - The writing session data
 * @param {Collection} writingSessions - The MongoDB collection for writing sessions
 * @returns {Object} - The response object
 */
async function createWritingSession(data, writingSessions) {
  const { error } = validateWritingSession(data);
  if (error)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.details[0].message }),
    };

  const result = await writingSessions.insertOne(data);
  logger.info("Writing session created:", result.insertedId);
  return { statusCode: 201, body: JSON.stringify({ id: result.insertedId }) };
}

/**
 * Retrieves a writing session by ID
 * @param {string} id - The writing session ID
 * @param {Collection} writingSessions - The MongoDB collection for writing sessions
 * @returns {Object} - The response object
 */
async function getWritingSession(id, writingSessions) {
  const session = await writingSessions.findOne({ _id: id });
  if (!session)
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Writing session not found" }),
    };
  return { statusCode: 200, body: JSON.stringify(session) };
}

/**
 * Updates a writing session
 * @param {string} id - The writing session ID
 * @param {Object} data - The updated writing session data
 * @param {Collection} writingSessions - The MongoDB collection for writing sessions
 * @returns {Object} - The response object
 */
async function updateWritingSession(id, data, writingSessions) {
  const { error } = validateWritingSession(data);
  if (error)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.details[0].message }),
    };

  const result = await writingSessions.updateOne({ _id: id }, { $set: data });
  if (result.matchedCount === 0)
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Writing session not found" }),
    };
  logger.info("Writing session updated:", id);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Writing session updated successfully" }),
  };
}

/**
 * Deletes a writing session
 * @param {string} id - The writing session ID
 * @param {Collection} writingSessions - The MongoDB collection for writing sessions
 * @returns {Object} - The response object
 */
async function deleteWritingSession(id, writingSessions) {
  const result = await writingSessions.deleteOne({ _id: id });
  if (result.deletedCount === 0)
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Writing session not found" }),
    };
  logger.info("Writing session deleted:", id);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Writing session deleted successfully" }),
  };
}

/**
 * Generates AI feedback for the given text
 * @param {Object} data - The feedback request data
 * @returns {Object} - The response object
 */
async function getAIFeedback(data) {
  const { error } = validateAIFeedbackRequest(data);
  if (error)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.details[0].message }),
    };

  try {
    const feedback = await generateAIFeedback(
      data.text,
      data.genre,
      data.style
    );
    return { statusCode: 200, body: JSON.stringify({ feedback }) };
  } catch (error) {
    logger.error("Error generating AI feedback:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate AI feedback" }),
    };
  }
}
v;

module.exports = {
  handler
};
