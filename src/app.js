const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.get("/repositories/:id", (request, response) => {
  let { id } = request.params

  let repository = repositories.find(repository => repository.id === id)

  return repository
    ? response.json(repository)
    : response.status(404).json({ error: 'Repository not found' })
});

app.post("/repositories", (request, response) => {
  let { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository)

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  let { id } = request.params
  let { title, url, techs } = request.body

  let repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex === -1) {
    return response.status(400).json({ error: 'Repository not found' })
  }

  let repository = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs
  }

  repositories[repositoryIndex] = repository

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  let { id } = request.params

  let repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex === -1) {
    return response.status(400).json({ error: 'Repository not found' })
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  let { id } = request.params

  let repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex === -1) {
    return response.status(400).json({ error: 'Repository not found' })
  }

  let foundRepository = repositories[repositoryIndex]

  let repository = { ...foundRepository, likes: foundRepository.likes + 1 }

  repositories[repositoryIndex] = repository

  return response.json({
    likes: repository.likes
  })
});

module.exports = app;
