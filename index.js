const express = require('express');

const server = express();

server.use(express.json());

const projects= [];
var contadorReq =0;


/*Middleware global - Indica o tempo, tipo, url da req, e uma
contagem de reqs*/

server.use((req, res, next) => {
  console.time('Request');

  console.log(`Método: ${req.method}; URL: ${req.url}`);

  contadorReq += 1;

  console.log(`Número de Requisições: ${contadorReq}`);
  
  next();

  console.timeEnd('Request');
});


/*Middleware para checar se o id existe no array projects*/
function checkProjectInArray(req, res, next) {

  const { id } = req.params;
  
  const project = projects.find(p => p.id == id);
  
  if(!project) {
    return res.status(400).json({error: "Project doesn't exist."});
    
  }
  req.project = project;

  return next();
};


/*Middleware para checar se o id já existe no array projects
Se existir não realiza o PUT de projeto*/
function checkIdAlreadyExists(req, res, next) {

  const { id } = req.body;
  
  const project = projects.find(p => p.id == id);
  
  if(project) {
    return res.status(400).json({error: "Project id already exist."});
    
  }
  req.project = project;

  return next();
};

server.get('/projects', (req,res) => {
  return res.json(projects);
});

/*Rota de deleção de um projeto*/
server.delete('/projects/:id', checkProjectInArray, (req, res) =>{
  /*Recebe o id do projeto que o usuario deseja deletar, via req.query*/
  const { id } = req.query;
  /*Procura o index do projeto que possui o id informado no req.query*/
  const pindex = projects.findIndex(p => p.id == id);
  
  /*Exclui o projeto do Array*/
  projects.splice(pindex, 1);

  /*Retorna o HTTP code*/
  return res.send();
});

server.post('/projects', checkIdAlreadyExists, (req, res) =>{
  const { id,title } = req.body;

  const project =
    { id,
      title,
      tasks: []
    };

  projects.push(project);
    
  return res.json(projects);
})

/*Alteração do nome de um projeto.*/
server.put('/projects/:id', checkProjectInArray, (req, res) =>{
  
  /*Recebe o id dos parametros da requisição*/
  const { id } = req.params;
  
  /*Recebe o title através do body da requisição*/
  const { title } = req.body;
  

  /*Busca o id no array de projetos e se econtrar, atribui o projeto para
  const project */
  const project = projects.find(p => p.id == id); 

  /*Atribui o title do req.body para o title do projeto do array*/
  project.title = title;

  /*Retorna a alteração*/
  return res.json(project);

});


/*Inclusão de Task em um projeto*/

server.post('/projects/:id/tasks', checkProjectInArray, (req, res) => {
  
  /*Recebe o id dos parametros da requisição*/
  const { id } = req.params;
  /*Recebe a task através do body da requisição*/
  const { task } = req.body;


  /*Busca o id no array de projetos e se econtrar, atribui o projeto para
  const project */
  const project = projects.find(p => p.id == id);

  /*Atribui a task recebida no req.body ao registro atribuído à const project*/
  project.tasks.push(task);

  //console.log(projects);
  return res.json(project);

})

server.listen(3000);