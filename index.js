const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const passport = require('passport');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const db = require('./lib/db');

const app = express();

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

const accounts = require('./routes/accounts');
const notes = require('./routes/notes');

//Swagger Documentation for API
const spec = swaggerJSDoc({
    swaggerDefinition: {
      info: {
        title: 'Todo App API',
        version: '1.0.0',
      },
      basePath: '/',
      produces: ['application/json'],
      consumes: ['application/json'],
      securityDefinitions: {
        jwt: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
      security: [
        { jwt: [] },
      ],
    },
    apis: [
      'routes/*/*.js',
    ],
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec, false, { validatorUrl: null }));

app.get('/', (req, res) => {
    res.status(200).send('Todo App API');
});

app.use(passport.initialize());

app.use('/accounts', accounts);
app.use('/notes', notes);
require('./routes/accounts/facebookLogin')(passport);
require('./routes/accounts/googleLogin')(passport);

const port = process.env.PORT || 3000;

const server = http.createServer(app);

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
}

module.exports.listen = function listen(callback) {
    db.connect(() => {
        console.log('Connection to DB successful.');
    });
    server.listen(port);
    server.on('error', (error) => {
      callback(error);
    });
    server.on('listening', () => {
      onListening();
      callback(null, server);
    });
};
