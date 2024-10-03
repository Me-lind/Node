import http from 'http'
import chalk from 'chalk';
import router from './routes.js';

//listener function
// const listener = (req, res) => {}
//create server
const server = http.createServer( (req, res) => {
    router(req,res)
})
// listen to the server 
const PORT = 3000
const HOST = 'localhost'
server.listen(PORT, HOST, () => {
    console.log(chalk.blue(`Server running at port: ${PORT}` ));
})
