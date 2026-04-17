const { Pool } = require("pg");

const pool = new Pool({
  user: "user",
  password: "password",
  host: "localhost",
  port: 5432,
  database: "exports_db"
});

async function streamJSON(stream) {

  const client = await pool.connect();

  try {

    stream.write("[");

    const batchSize = 10000;
    let offset = 0;
    let first = true;

    while (true) {

      const result = await client.query(
        "SELECT * FROM records LIMIT $1 OFFSET $2",
        [batchSize, offset]
      );

      if (result.rows.length === 0) break;

      for (const row of result.rows) {

        if (!first) stream.write(",");
        stream.write(JSON.stringify(row));

        first = false;
      }

      offset += batchSize;
    }

    stream.write("]");
    stream.end();

  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }

}

module.exports = streamJSON;