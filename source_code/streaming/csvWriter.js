const { Pool } = require("pg");
const copyTo = require("pg-copy-streams").to;

const pool = new Pool({
  user: "user",
  password: "password",
  host: "localhost",
  port: 5432,
  database: "exports_db"
});

async function streamCSV(stream) {

  const client = await pool.connect();

  try {

    const query = `
      COPY (
        SELECT * FROM records
      )
      TO STDOUT WITH CSV HEADER
    `;

    const copyStream = client.query(copyTo(query));

    copyStream.pipe(stream);

    copyStream.on("end", () => {
      client.release();
    });

  } catch (err) {
    console.error(err);
    client.release();
  }

}

module.exports = streamCSV;