//Import Express
const express = require('express'); // importing a CommonJS module

//Import Helmet
const helmet = require('helmet');

//Import Morgan
const morgan = require('morgan');

//Import Hubs Router
const hubsRouter = require('./hubs/hubs-router.js');

//Create Server with Express
const server = express();

// the three amigos
function dateLogger(req, res, next){
  console.log(new Date().toISOString());

  next();
}

// custom middleware to log visits
function logVisit(req, res, next){
  console.log(
    `${req.method} to ${req.url} from ${req.get('Origin')}`
  )
  next();
}

function gateKeeper(req, res, next){
  //data can come in the body, url parameters, query strings, headers
  //new way of reading data sent by the client 
  const password = req.headers.password;

  if(!password){
    res.status(400).json({ message: "Password Required for Access"})
  } else if (password === 'mellon'){
    next();
  } else {
    res.status(401).json({ Message: "cannot pass!"})
  }

  // if(password.toLowerCase() === 'mellon'){
  //   next();
  // } else {
  //   res.status(400).json({ Message: "cannot pass!!" });
  // }
}

// Global Middleware
// Depending on where we put this (cascading) it will set up a gate locked by password
server.use(gateKeeper);
//Helmet blocks info being leaked in header.
server.use(helmet()); // Third Party Middleware

//MOrgan
server.use(morgan('dev')); // Third Party Middleware

//Fill Requests with JSON
server.use(express.json()); //Built-in Middleware

server.use(dateLogger); // Custom Middleware

server.use(logVisit); // Custom Middleware



//Use if requesting /api/hubs
server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

// Export Server
module.exports = server;
