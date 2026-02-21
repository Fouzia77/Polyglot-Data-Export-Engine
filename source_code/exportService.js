const QueryStream = require('pg-query-stream');
const { pipeline } = require('stream');
const db = require('./db'); // your pg pool

async function streamExport(job, reply) {
  const client = await db.connect();

  const query = new QueryStream('SELECT * FROM records');
  const stream = client.query(query);

  reply.header('Content-Type', 'text/csv');

  pipeline(stream, reply.raw, (err) => {
    client.release();
    if (err) console.error(err);
  });
}

module.exports = { streamExport };