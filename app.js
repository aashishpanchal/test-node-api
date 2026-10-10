// Importing required packages
require('dotenv').config();
const http = require('http');
const express = require('express');
const { createClient } = require('redis');

const app = express();

// Redis client configuration
const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Redis client connected'));

(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('Redis connection error:', err);
    }
})();

app.locals.redisClient = redisClient;

app.set('port', process.env.PORT || 3000); // Application port is set
app.set('views', __dirname + '/app/server/views'); // Views folder is set
app.set('view engine', 'ejs'); // View engine is set
app.use(express.static(__dirname + '/app/public')); // Public folder containing static files is set

require('./app/routes')(app); // Routes are imported

const server = http.createServer(app).listen(app.get('port'), function(){
	console.log('The application is running on port ' + app.get('port'));
}); // Http server is created

server.redisClient = redisClient;

module.exports = server;