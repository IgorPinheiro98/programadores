const express = require("express");
const { response } = require("express");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());

const devs = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);

  next();
}

function validateDevId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response
      .status(400)
      .json({ error: "Param sent is not a valid UUID" });
  }
  next();
}

app.use(logRequests);
app.use("/dev/:id", validateDevId);

app.get("/devs", (request, response) => {
  const { title } = request.query;

  const results = title
    ? devs.filter((dev) => dev.title.includes(title))
    : devs;

  return response.json(results);
});

app.post("/devs", (request, response) => {
  const { nome, sobrenome, idade, empresa, tecnologias } = request.body;

  const dev = { id: uuid(), nome, sobrenome, idade, empresa, tecnologias };

  devs.push(dev);

  return response.json(dev);
});

app.put("/dev/:id", validateDevId, (request, response) => {
  const { id } = request.params;
  const { nome, sobrenome, idade, empresa, tecnologias } = request.body;

  const devIndex = devs.findIndex((dev) => dev.id == id);

  if (devIndex < 0) {
    return response.status(400).json({ error: "Dev not found" });
  }

  const devs = {
    id,
    nome,
    sobrenome,
    idade,
    empresa,
    tecnologias,
  };

  devs[devIndex] = dev;

  return response.json(dev);
});

app.delete("/devs/:id", validateDevId, (request, response) => {
  const { id } = request.params;

  const devIndex = devs.findIndex((dev) => dev.id == id);

  if (devIndex < 0) {
    return response.status(400).json({ error: "Dev not found" });
  }

  devs.splice(devIndex, 1);

  return response.status(204).send();
});

const port = 3332;
app.listen(port, () => {
  console.log(`🚀 Server up and running on PORT ${port}`);
});
