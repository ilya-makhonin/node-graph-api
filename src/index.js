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
        /** Обработчик стартовой страницы */
        method: 'GET',
        path: '/',
        handler(request, reply) {
            return `<h1>Our new API</h1>`;
        }
    },
    {
        /** Обработчик, возвращающий все записи из базы данных */
        method: 'GET',
        path: '/api/v1/paintings',
        handler(req, reply) {
            return Painting.find();
        }
    },
    {
        /** Обработчик, для загрузки новых данных в базу */
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
        /** Удаление записей по фильтру / всех записей */
        method: 'POST',
        path: '/api/v1/paintings/del',
        handler: (req, reply) => {
            const { name } = req.payload;
            if (name === '') {
                Painting.deleteMany({}, (err) => {             // Удаляем все записи в БД, если не передан аргумент-фильтр
                    if (err) return err;
                });
            } else {
                Painting.deleteOne({ name: name }, (err) => {  // Удаляем записи в БД по переданному фильтру (имени)
                    if (err) return err;
                });
            }
            return Painting.find();                            // Возвращаем текущее состояние БД
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
