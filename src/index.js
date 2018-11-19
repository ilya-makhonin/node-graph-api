const hapi = require('hapi');
const mongoose = require('mongoose');
const Painting = require('./models/painting');

const server = hapi.server({
    port: 4000,
    host: 'localhost'
});


const init = async () => {
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
        }
    ]);
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
