const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());


const repositories = [
  /* Model
  {
  id: uuid(), //primary unique uuid
  title, //string
  url, //string
  techs, //array
  likes: 0 //integer autoincrement !important starts with 0
  }
  */
  {
    "id": "4491b5bd-7136-4330-b63f-075309fcdbfe",
    "title": "Repos I Do Like",
    "url": "https://github.com/gleidsonlm/repos-i-do-like",
    "techs": "['javascript','nodejs']",
    "likes": 0
  }
];


/* Middleware will receive route params and return next if matching object */
function findId(request,response,next) {
  const { id } = request.params;
  const repository = repositories.find(e => e.id === id)
  if (!repository) {
    return response.status(404).json({error: "Repository Not Found with ID " + id });
  } else {
    request.repository = repository;
    return next();
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
  const { repository } = request;
  // don't update repository likes manually
  const { title , url , techs} = request.body;
  // todo: reassign values not ideal, refactor to map maybe?
  // case request.body properties and update repository with its values, if they exist.
  if (title){
    repository.title = title;
  } if (url) {
    repository.url = url;
  } if (techs) {
    repository.techs = techs;
  }
  return response.status(200).json(repository); 
});

// delete the repository
app.delete("/repositories/:id",findId, (request, response) => {
  const { repository } = request;
  const repositoryIndex = repositories.findIndex(e => e.id === repository.id);
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

//give a like to the repository
app.post("/repositories/:id/like",findId, (request, response) => {
  const { repository } = request;
  repository.likes = ++repository.likes;
  return response.status(200).json(repository);
});

module.exports = app;