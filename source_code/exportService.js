const { v4: uuidv4 } = require("uuid");
const streamCSV = require("./streaming/csvWriter");
const streamJSON = require("./streaming/jsonWriter");
const streamXML = require("./streaming/xmlWriter");
const streamParquet = require("./streaming/parquetWriter");
const zlib = require("zlib");

const jobs = {};

// Create export job
exports.createExport = (req, res) => {

  const { format, columns, compression } = req.body;

  const exportId = uuidv4();

  jobs[exportId] = {
    format,
    columns,
    compression,
    status: "pending"
  };

  res.status(201).json({
    exportId,
    status: "pending"
  });
};

// Download export (placeholder for now)

exports.downloadExport = async (req, res) => {

  const job = jobs[req.params.id];

  if (!job) {
    return res.status(404).json({ error: "Export job not found" });
  }

  let output = res;

  // Set correct file headers
  if (job.format === "csv") {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="export.csv"');
  }
  else if (job.format === "json") {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", 'attachment; filename="export.json"');
  }
  else if (job.format === "xml") {
    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Content-Disposition", 'attachment; filename="export.xml"');
  }
  else if (job.format === "parquet") {
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", 'attachment; filename="export.parquet"');
  }

  // Apply gzip compression if requested
  if (job.compression === "gzip" && job.format !== "parquet") {

    res.setHeader("Content-Encoding", "gzip");

    const gzip = zlib.createGzip();

    gzip.pipe(res);

    output = gzip;

  }

  // Call correct writer
  if (job.format === "csv") {
    await streamCSV(output);
  }
  else if (job.format === "json") {
    await streamJSON(output);
  }
  else if (job.format === "xml") {
    await streamXML(output);
  }
  else if (job.format === "parquet") {
    await streamParquet(output);
  }

};

// Benchmark endpoint
const fs = require("fs");
const os = require("os");
const path = require("path");

exports.benchmark = async (req, res) => {

  const formats = ["csv","json","xml","parquet"];
  const results = [];

  for (const format of formats) {

    const startTime = Date.now();

    const filePath = path.join(os.tmpdir(), `benchmark.${format}`);

    const writeStream = fs.createWriteStream(filePath);

    if (format === "csv") {
      await streamCSV(writeStream);
    }
    else if (format === "json") {
      await streamJSON(writeStream);
    }
    else if (format === "xml") {
      await streamXML(writeStream);
    }
    else if (format === "parquet") {
      await streamParquet(writeStream);
    }

    await new Promise(resolve => writeStream.on("finish", resolve));

    const durationSeconds = (Date.now() - startTime) / 1000;

    const stats = fs.statSync(filePath);

    const memoryUsage = process.memoryUsage().rss / (1024 * 1024);

    results.push({
      format,
      durationSeconds,
      fileSizeBytes: stats.size,
      peakMemoryMB: memoryUsage
    });

  }

  res.json({
    datasetRowCount: 10000000,
    results
  });

};