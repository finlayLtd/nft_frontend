const app = require('express')();
const serveStatic = require('serve-static');
const path = require('path');

app.use(serveStatic(__dirname + '/dist'));
app.get('*', (request, response) => {
	response.sendFile(path.join(__dirname, '/dist', 'index.html'));
});
const port = process.env.PORT || 80
app.listen(port, function(err) {
    if (err) {
        console.log('Failed to start server');
    } else {
        console.log('Server started in '+ port);
    }
});
