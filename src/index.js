const hapi = require('hapi');

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

init();