const connectionKeys = require('./connection-keys');
const redis = require('redis');

const createRedisClient = () => {
  return redis.createClient({
    host: connectionKeys.redisHost,
    port: connectionKeys.redisPort,
    retry_strategy: () => 1000
  });
};

const createRedisPublisher = (redisClient) => {
  return redisClient.duplicate();
};

module.exports = {
  createRedisClient: createRedisClient,
  createRedisPublisher: createRedisPublisher
};