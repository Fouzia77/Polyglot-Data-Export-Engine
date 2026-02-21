const QueryStream = require("pg-query-stream");
const { pipeline } = require("stream");
const { stringify } = require("csv-stringify");

async function createStream(db, columns) {
  const client = await db.connect();

  const queryText = `SELECT ${columns.join(",")} FROM records`;
  const query = new QueryStream(queryText);

  const dbStream = client.query(query);
  const csvStream = stringify({ header: true });

  dbStream.on("end", () => client.release());
  dbStream.on("error", () => client.release());

  return dbStream.pipe(csvStream);
}

module.exports = { createStream };