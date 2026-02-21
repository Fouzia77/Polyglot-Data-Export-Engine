const parquet = require("parquetjs-lite");
const fs = require("fs");

async function createStream(db) {
  const schema = new parquet.ParquetSchema({
    id: { type: "INT64" },
    name: { type: "UTF8" },
    value: { type: "DOUBLE" }
  });

  const file = "/tmp/export.parquet";
  const writer = await parquet.ParquetWriter.openFile(schema, file);

  const res = await db.query("SELECT * FROM records");
  for (const row of res.rows) {
    await writer.appendRow(row);
  }

  await writer.close();
  return fs.createReadStream(file);
}

module.exports = { createStream };