const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'ecommerce';

let client;

async function conectar() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db(dbName);
}

async function fechar() {
  if (client) {
    await client.close();
    client = null;
  }
}

module.exports = { conectar, fechar };
