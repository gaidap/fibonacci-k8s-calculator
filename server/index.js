// Create and connect Postgress Client
const { createNewPgPool, initPgClientConnection } = require('./pg-client');
const pgPool = createNewPgPool();
initPgClientConnection(pgPool);

// Redis Client Setup
const { createRedisClient, createRedisPublisher } = require('./redis-client');
const redisClient = createRedisClient();
const redisPublisher = createRedisPublisher(redisClient);

// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Express rout handlers
app.get('/', (_request, response) => {
  response.send('Fibonacci-Calculator us running');
});
app.get('/values/all', async (_request, response) => {
  const values  = await pgPool.query('SELECT * FROM values;');
  response.send(values.rows);
});
app.get('/values/current', async (_request, response) => {
  // redis library has no Promise support so we cannot use await here.
  redisClient.hgetall('values', (error, values) => {
    response.send(values);
  });
});
app.post('/values', async (request, response) => {
  const index = request.body.index;
  if(parseInt(index) > 40) {
    response.status(422).send('Due to technical restriction you can ony calulate Fibonacci numbers upt to a index of 40.');
  } else {
    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgPool.query('INSERT INTO values(number) VALUES($1)', [index]);
    response.send({ calculating: true });
  }
});

// Start to listen on specific port
const port = 5000;
app.listen(port, _error => {
  console.log(`Listeneing on port ${port}.`);
});
