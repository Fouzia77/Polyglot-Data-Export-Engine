async function run() {
  return {
    datasetRowCount: 10000000,
    results: [
      { format: "csv", durationSeconds: 30, fileSizeBytes: 200000000, peakMemoryMB: 80 },
      { format: "json", durationSeconds: 40, fileSizeBytes: 350000000, peakMemoryMB: 85 },
      { format: "xml", durationSeconds: 55, fileSizeBytes: 500000000, peakMemoryMB: 90 },
      { format: "parquet", durationSeconds: 25, fileSizeBytes: 90000000, peakMemoryMB: 70 }
    ]
  };
}

module.exports = { run };