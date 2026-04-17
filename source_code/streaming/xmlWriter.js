const { Pool } = require("pg");

const pool = new Pool({
  user: "user",
  password: "password",
  host: "localhost",
  port: 5432,
  database: "exports_db"
});

async function streamXML(stream) {

  const client = await pool.connect();

  try {

    stream.write("<records>");

    const batchSize = 10000;
    let offset = 0;

    while (true) {

      const result = await client.query(
        "SELECT * FROM records LIMIT $1 OFFSET $2",
        [batchSize, offset]
      );

      if (result.rows.length === 0) break;

      for (const row of result.rows) {

        stream.write(`
<record>
  <id>${row.id}</id>
  <created_at>${row.created_at}</created_at>
  <name>${row.name}</name>
  <value>${row.value}</value>
  <metadata>${JSON.stringify(row.metadata)}</metadata>
</record>
        `);

      }

      offset += batchSize;
    }

    stream.write("</records>");
    stream.end();

  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }

}

module.exports = streamXML;