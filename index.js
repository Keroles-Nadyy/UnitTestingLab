const fastify = require('fastify')({ logger: true })
const startDB = require('./helpers/DB.js');
const { addUser, getUsers, getSingleUser, deleteUser } = require('./controllers/user.controller.js');
const {getFullName} = require('./helpers/utils.js');
const User = require('./models/user.js')


fastify.register(startDB);


// Declare a route
fastify.get('/', function handler (request, reply) {
    reply.send({ hello: 'world' })
})


fastify.post('/users', addUser);
fastify.get('/users', getUsers);
fastify.get('/users/:id', getSingleUser);
fastify.delete('/users/:id', deleteUser);
// fastify.get('/users/:id', updateUser);


// Run the server!
fastify.listen({ port: 3000 }, (err) => {
    if (err) {
    fastify.log.error(err)
    process.exit(1)
    }
})


