const hapi = require('hapi');
const mongoose = require('mongoose');
const Painting = require('./models/painting');
const { graphqlHapi, graphiqlHapi } = require('apollo-server-hapi');
const schema = require('./graphql/schema');

const server = hapi.server({
    port: 4000,
    host: 'localhost'
});

server.route([
    {
        method: 'GET',
        path: '/',
        handler(request, reply) {
            return `<h1>Our new API</h1>`;
        }
    },
    {
        method: 'GET',
        path: '/api/v1/paintings',
        handler(req, reply) {
            return Painting.find();
        }
    },
    {
        method: 'POST',
        path: '/api/v1/paintings',
        handler: (req, reply) => {
            const { name, url, technique } = req.payload;
            const painting = new Painting({
                name, url, technique
            });
            return painting.save();
        }
    },
    {
        method: 'POST',
        path: '/api/v1/paintings/del',
        handler: (req, reply) => {
            const { name } = req.payload;
            if (name === '') {
                Painting.deleteMany({}, (err) => {
                    if (err) return err;
                });
                console.log('It\'s many deleting');
            } else {
                Painting.deleteOne({ name: name }, (err) => {
                    if (err) return err;
                });
                console.log('It\'s one deleting');
            }
            return Painting.find();
        }
    },
]);

const init = async () => {
    await server.register({
        plugin: graphiqlHapi,
        options: {
            path: '/graphiql',
            graphiqlOptions: {
                endpointURL: '/graphql'
            },
            route: {
                cors: true
            }
        }
    });

    await server.register({
        plugin: graphqlHapi,
        options: {
            path: '/graphql',
            graphqlOptions: {
                schema
            },
            route: {
                cors: true
            }
        }
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

mongoose.connect(
    'mongodb://admin:123456zxc@ds239137.mlab.com:39137/node-power-api',
    { useNewUrlParser: true }
);

mongoose.connection.once('open', () => {
    console.log('Connected to database!');
});

init();
