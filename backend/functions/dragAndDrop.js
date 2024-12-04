// functions/dragAndDrop.js
import { MongoClient } from "mongodb";
import { validateDragAndDropOperation } from "../utils/validators.js";
import logger from "../utils/logger.js";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/**
 * Handles drag-and-drop operations
 * @param {Object} event - The event object from Netlify
 * @param {Object} context - The context object from Netlify
 * @returns {Object} - The response object
 */
export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await client.connect();
    const database = client.db("freewriter");
    const dragAndDropOperations = database.collection("dragAndDropOperations");

    switch (event.httpMethod) {
      case "POST":
        return await recordDragAndDropOperation(
          JSON.parse(event.body),
          dragAndDropOperations
        );
      case "GET":
        return await getDragAndDropOperations(
          event.queryStringParameters,
          dragAndDropOperations
        );
      default:
        return { statusCode: 405, body: "Method Not Allowed" };
    }
  } catch (error) {
    logger.error("Error in dragAndDrop function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  } finally {
    await client.close();
  }
};

/**
 * Records a drag-and-drop operation
 * @param {Object} data - The drag-and-drop operation data
 * @param {Collection} dragAndDropOperations - The MongoDB collection for drag-and-drop operations
 * @returns {Object} - The response object
 */
async function recordDragAndDropOperation(data, dragAndDropOperations) {
  const { error } = validateDragAndDropOperation(data);
  if (error)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.details[0].message }),
    };

  const result = await dragAndDropOperations.insertOne({
    ...data,
    timestamp: new Date(),
  });
  logger.info("Drag-and-drop operation recorded:", result.insertedId);
  return { statusCode: 201, body: JSON.stringify({ id: result.insertedId }) };
}

/**
 * Retrieves drag-and-drop operations
 * @param {Object} queryParams - The query parameters
 * @param {Collection} dragAndDropOperations - The MongoDB collection for drag-and-drop operations
 * @returns {Object} - The response object
 */
async function getDragAndDropOperations(queryParams, dragAndDropOperations) {
  const { userId, startDate, endDate } = queryParams;
  const query = {};

  if (userId) query.userId = userId;
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  const operations = await dragAndDropOperations.find(query).toArray();
  return { statusCode: 200, body: JSON.stringify(operations) };
}
