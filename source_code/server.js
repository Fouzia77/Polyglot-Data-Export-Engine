const Fastify = require("fastify");
const { v4: uuidv4 } = require("uuid");
const exportService = require("./exportService");
const benchmark = require("./benchmark");

const app = Fastify();
const jobs = new Map();

app.post("/exports", async (req, reply) => {
  const { format, columns, compression } = req.body;

  const exportId = uuidv4();
  jobs.set(exportId, { format, columns, compression });

  return reply.code(201).send({
    exportId,
    status: "pending",
  });
});



app.get("/exports/:id/download", async (req, reply) => {
  const job = jobs.get(req.params.id);
  if (!job) return reply.code(404).send("Not found");

  await exportService.streamExport(job, reply);
});

app.get("/exports/benchmark", async () => {
  return benchmark.run();
});



const port = process.env.PORT || 8080;
app.listen({ port, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server listening at ${address}`);
});


