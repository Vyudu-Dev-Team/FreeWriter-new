import { MongoClient } from "mongodb";
import { validateOutline } from "../utils/validators.js";
import logger from "../utils/logger.js";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/**
 * Handles outline management operations
 * @param {Object} event - The event object from Netlify
 * @param {Object} context - The context object from Netlify
 * @returns {Object} - The response object
 */
export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await client.connect();
    const database = client.db("freewriter");
    const outlines = database.collection("outlines");

    switch (event.httpMethod) {
      case "POST":
        return await createOutline(JSON.parse(event.body), outlines);
      case "GET":
        return await getOutline(event.queryStringParameters.id, outlines);
      case "PUT":
        return await updateOutline(
          event.queryStringParameters.id,
          JSON.parse(event.body),
          outlines
        );
      case "DELETE":
        return await deleteOutline(event.queryStringParameters.id, outlines);
      default:
        return { statusCode: 405, body: "Method Not Allowed" };
    }
  } catch (error) {
    logger.error("Error in outlineManagement function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  } finally {
    await client.close();
  }
};

/**
 * Creates a new outline
 * @param {Object} data - The outline data
 * @param {Collection} outlines - The MongoDB collection for outlines
 * @returns {Object} - The response object
 */
async function createOutline(data, outlines) {
  const { error } = validateOutline(data);
  if (error)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.details[0].message }),
    };

  const result = await outlines.insertOne(data);
  logger.info("Outline created:", result.insertedId);
  return { statusCode: 201, body: JSON.stringify({ id: result.insertedId }) };
}

/**
 * Retrieves an outline by ID
 * @param {string} id - The outline ID
 * @param {Collection} outlines - The MongoDB collection for outlines
 * @returns {Object} - The response object
 */
async function getOutline(id, outlines) {
  const outline = await outlines.findOne({ _id: id });
  if (!outline)
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Outline not found" }),
    };
  return { statusCode: 200, body: JSON.stringify(outline) };
}

/**
 * Updates an outline
 * @param {string} id - The outline ID
 * @param {Object} data - The updated outline data
 * @param {Collection} outlines - The MongoDB collection for outlines
 * @returns {Object} - The response object
 */
async function updateOutline(id, data, outlines) {
  const { error } = validateOutline(data);
  if (error)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.details[0].message }),
    };

  const result = await outlines.updateOne({ _id: id }, { $set: data });
  if (result.matchedCount === 0)
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Outline not found" }),
    };
  logger.info("Outline updated:", id);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Outline updated successfully" }),
  };
}

/**
 * Deletes an outline
 * @param {string} id - The outline ID
 * @param {Collection} outlines - The MongoDB collection for outlines
 * @returns {Object} - The response object
 */
async function deleteOutline(id, outlines) {
  const result = await outlines.deleteOne({ _id: id });
  if (result.deletedCount === 0)
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Outline not found" }),
    };
  logger.info("Outline deleted:", id);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Outline deleted successfully" }),
  };
}
