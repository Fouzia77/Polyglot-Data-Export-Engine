const express = require("express");
const router = express.Router();

const {
  createExport,
  downloadExport,
  benchmark
} = require("./exportService");

router.post("/exports", createExport);

router.get("/exports/:id/download", downloadExport);

router.get("/exports/benchmark", benchmark);

module.exports = router;