//Import Express
const express = require('express'); // importing a CommonJS module

//Import Helmet
const helmet = require('helmet');

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

// Global Middleware
//Helmet blocks info being leaked in header.
server.use(helmet()); // Third Party Middleware

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
