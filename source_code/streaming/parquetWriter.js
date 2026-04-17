const parquet = require("parquetjs");
const { Pool } = require("pg");

const pool = new Pool({
  user: "user",
  password: "password",
  host: "localhost",
  port: 5432,
  database: "exports_db"
});

async function streamParquet(stream) {

  const client = await pool.connect();

  try {

    const schema = new parquet.ParquetSchema({
      id: { type: "INT64" },
      created_at: { type: "TIMESTAMP_MILLIS" },
      name: { type: "UTF8" },
      value: { type: "DOUBLE" },
      metadata: { type: "UTF8" }
    });

    const writer = await parquet.ParquetWriter.openStream(schema, stream);

    const batchSize = 10000;
    let offset = 0;

    while (true) {

      const result = await client.query(
        "SELECT * FROM records LIMIT $1 OFFSET $2",
        [batchSize, offset]
      );

      if (result.rows.length === 0) break;

      for (const row of result.rows) {

        await writer.appendRow({
          id: row.id,
          created_at: new Date(row.created_at),
          name: row.name,
          value: Number(row.value),
          metadata: JSON.stringify(row.metadata)
        });

      }

      offset += batchSize;
    }

    await writer.close();

  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }

}

module.exports = streamParquet;