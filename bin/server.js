const server = require('../index');
server.listen((err, app) => {
    if (err) {
        throw err;
    }
    console.log('server started');
    console.log(app.address());
});