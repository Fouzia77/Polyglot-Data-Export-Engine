const QueryStream = require("pg-query-stream");

async function createStream(db, columns) {
  const client = await db.connect();

  const queryText = `SELECT row_to_json(t) FROM (SELECT ${columns.join(",")} FROM records) t`;
  const query = new QueryStream(queryText);

  const stream = client.query(query);

  stream.on("end", () => client.release());
  stream.on("error", () => client.release());

  return stream;
}

module.exports = { createStream };