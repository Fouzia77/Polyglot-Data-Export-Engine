const { create } = require("xmlbuilder2");
const QueryStream = require("pg-query-stream");
const { Readable } = require("stream");

async function createStream(db) {
  const query = new QueryStream("SELECT * FROM records");
  const stream = db.query(query);

  const out = new Readable({ read() {} });
  out.push("<records>");

  stream.on("data", row => {
    const xml = create({ record: row }).end({ headless: true });
    out.push(xml);
  });

  stream.on("end", () => out.push("</records>"));

  return out;
}

module.exports = { createStream };