const express = require("express");
const routes = require("./routes");

const app = express();

app.use(express.json());

// register all routes
app.use("/", routes);

app.listen(8080, () => {
  console.log("Server running on port 8080");
});