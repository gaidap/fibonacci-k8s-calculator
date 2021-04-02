const connectionKeys = require('./connection-keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: connectionKeys.redisHost,
  port: connectionKeys.redisPort,
  retry_strategy: () => 1000
});

// Recursive fiboncacci algorithm from geeksforgeeks.org
function fib(n) {
  if(n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

const subscription = redisClient.duplicate();
subscription.on('message', (_channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});
subscription.subscribe('insert');