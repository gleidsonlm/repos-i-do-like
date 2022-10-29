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

/* Middleware will receive route params and return next if matching object */
function findId(request,response,next) {
  const { id } = request.params;
  const repository = repositories.find(e => e.repository.id = id)
  if (repository) {
    request.repository = repository;
    return next();
  } else {
    return response.status(404).json({error: "Repository Not Found with ID " + id });
  }
};

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
    likes: 0 //!important start with 0 likes
  };
  
  repositories.push(repository);
  return response.status(201).json(repository);
});

// update repository
app.put("/repositories/:id",findId, (request, response) => {
  const repository = request.repository;

  // todo: reassign values not ideal, refactor to map maybe?
  if (!newRepository.title){
    repository.title = newRepository.title;
  } else if (!newRepository.url) {
    repository.url = newRepository.url;
  } else if (!newRepository.techs) {
    repository.techs = newRepository.techs;
  } else if (!newRepository.likes) {
    // don't update repository likes manually
  } else {
    return response.status(200).json(repository);
  }
});

// delete the repository
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
