const server = require('./server');
const env = require('dotenv').config({path: './.env'});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server live on port ${port}`));
