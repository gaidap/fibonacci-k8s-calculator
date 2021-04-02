const connectionKeys = require('./connection-keys');
const { Pool } = require('pg');

const createNewPgPool = () => {
  return new Pool({
    user: connectionKeys.pgUser,
    password: connectionKeys.pgPassword,
    host: connectionKeys.pgHost,
    port: connectionKeys.pgPort,
    database: connectionKeys.pgDatabase
  });
};

const initPgClientConnection = (pgPool) => {
  pgPool.on('connect', (client) => {
    client 
      .query('CREATE TABLE IF NOT EXISTS values (number INT);')
      .catch((error) => console.log(error));
  });
};

module.exports = {
  createNewPgPool: createNewPgPool,
  initPgClientConnection: initPgClientConnection
};