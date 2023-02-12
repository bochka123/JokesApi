const path = require("path");
const fs = require("fs");
const http = require("http");

const server = http.createServer(function (request, response){
    if(request.url === "/jokes" && request.method === "GET"){
        getAllJokes(request, response);
    }
})

server.listen(3000);

function getAllJokes(request, response){

}