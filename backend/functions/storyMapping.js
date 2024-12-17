const { MongoClient } = require( "mongodb");
const { validateStoryMap } = require( "../utils/validators.js");
const logger = require( "../utils/logger.js");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/**
 * Handles story mapping operations
 * @param {Object} event - The event object from Netlify
 * @param {Object} context - The context object from Netlify
 * @returns {Object} - The response object
 */
const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await client.connect();
    const database = client.db("freewriter");
    const storyMaps = database.collection("storyMaps");

    switch (event.httpMethod) {
      case "POST":
        return await createStoryMap(JSON.parse(event.body), storyMaps);
      case "GET":
        return await getStoryMap(event.queryStringParameters.id, storyMaps);
      case "PUT":
        return await updateStoryMap(
          event.queryStringParameters.id,
          JSON.parse(event.body),
          storyMaps
        );
      case "DELETE":
        return await deleteStoryMap(event.queryStringParameters.id, storyMaps);
      default:
        return { statusCode: 405, body: "Method Not Allowed" };
    }
  } catch (error) {
    logger.error("Error in storyMapping function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  } finally {
    await client.close();
  }
};

/**
 * Creates a new story map
 * @param {Object} data - The story map data
 * @param {Collection} storyMaps - The MongoDB collection for story maps
 * @returns {Object} - The response object
 */
async function createStoryMap(data, storyMaps) {
  const { error } = validateStoryMap(data);
  if (error)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.details[0].message }),
    };

  const result = await storyMaps.insertOne(data);
  logger.info("Story map created:", result.insertedId);
  return { statusCode: 201, body: JSON.stringify({ id: result.insertedId }) };
}

/**
 * Retrieves a story map by ID
 * @param {string} id - The story map ID
 * @param {Collection} storyMaps - The MongoDB collection for story maps
 * @returns {Object} - The response object
 */
async function getStoryMap(id, storyMaps) {
  const storyMap = await storyMaps.findOne({ _id: id });
  if (!storyMap)
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Story map not found" }),
    };
  return { statusCode: 200, body: JSON.stringify(storyMap) };
}

/**
 * Updates a story map
 * @param {string} id - The story map ID
 * @param {Object} data - The updated story map data
 * @param {Collection} storyMaps - The MongoDB collection for story maps
 * @returns {Object} - The response object
 */
async function updateStoryMap(id, data, storyMaps) {
  const { error } = validateStoryMap(data);
  if (error)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.details[0].message }),
    };

  const result = await storyMaps.updateOne({ _id: id }, { $set: data });
  if (result.matchedCount === 0)
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Story map not found" }),
    };
  logger.info("Story map updated:", id);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Story map updated successfully" }),
  };
}

/**
 * Deletes a story map
 * @param {string} id - The story map ID
 * @param {Collection} storyMaps - The MongoDB collection for story maps
 * @returns {Object} - The response object
 */
async function deleteStoryMap(id, storyMaps) {
  const result = await storyMaps.deleteOne({ _id: id });
  if (result.deletedCount === 0)
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Story map not found" }),
    };
  logger.info("Story map deleted:", id);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Story map deleted successfully" }),
  };
}

module.exports = {
  handler
};