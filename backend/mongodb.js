const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  socketTimeoutMS: 30000,
  connectTimeoutMS: 30000,
});

async function connectMongoDB() {
  try {
    console.log('MongoDB URI:', process.env);
    await client.connect();
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

async function saveMessage(vector, isDangerous = false) {
  const db = client.db('anomaly_detection');
  const collection = db.collection('messages');
  try {
    await collection.insertOne({ vector, isDangerous });
    console.log('Message saved:', isDangerous ? 'Dangerous' : 'Normal');
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}

async function checkAnomaly(vector, threshold = 0.9, exact = false) {
  const db = client.db('anomaly_detection');
  const collection = db.collection('messages');
  if (!Array.isArray(vector)) {
    throw new Error('"vector" must be an array');
  }
  const pipeline = [
    {
      $vectorSearch: {
        index: 'vector_index',
        path: 'vector',
        queryVector: vector,
        numCandidates: 100,
        limit: 10
      }
    },
    {
      $project: {
        _id: 1,
        vector: 1,
        score: { $meta: 'vectorSearchScore' }
      }
    },
    {
      $match: {
        score: { $gt: threshold }
      }
    }
  ];
  const result = await collection.aggregate(pipeline).toArray();
  if (result.length === 0 || !result[0]?.score) {
    console.log('No similar dangerous message found.');
    return false;
  }
  const score = result[0].score;
  return true;
}

module.exports = { connectMongoDB, saveMessage, checkAnomaly };
