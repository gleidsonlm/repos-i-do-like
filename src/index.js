const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());


const repositories = [];
/* repositories Model
  {
  id: uuid(), //primary unique uuid
  title, //string
  url, //string
  techs, //array
  likes: 0 //integer autoincrement !important starts with 0
  }
*/

// list the projects
app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

// create a new repository
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };
  
  repositories.push(repository);
  return response.status(201).json(repository);
});

// update repository
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const newRepository = request.body;
  const repositoryIndex = repositories.findIndex(e => e.id === id);
  let repository;
  // don't update a non existing repository
  if (repositoryIndex === -1) {
    return response.status(404).json({ error: "Repository not found" });
  } else {
    repository = repositories[repositoryIndex];
    if (!newRepository.title){
      repository.title = newRepository.title;
    } else if (!newRepository.url) {
      repository.url = newRepository.url;
    } else if (!newRepository.techs) {
      repository.url = newRepository.url;
    }
  }
    return response.status(200).json(repository);
  }
);

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex > 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const likes = ++repositories[repositoryIndex].likes;

  return response.json('likes');
});

module.exports = app;
