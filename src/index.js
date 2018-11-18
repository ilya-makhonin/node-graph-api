const hapi = require('hapi');
const mongoose = require('mongoose');

const server = hapi.server({
    port: 4000,
    host: 'localhost'
});


const init = async () => {
    server.route({
        method: 'GET',
        path: '/',
        handler(request, reply) {
            return `<h1>Our new API</h1>`;
        }
    });
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

mongoose.connect(
    'mongodb://admin:naizemk123@ds239137.mlab.com:39137/node-power-api',
    { useNewUrlParser: true }
);
mongoose.connection.once('open', () => {
    console.log('Connected to database')
});

init();