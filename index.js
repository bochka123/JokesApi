const path = require("path");
const fs = require("fs");
const http = require("http");

const server = http.createServer(function (request, response){
    if(request.url === "/api/jokes" && request.method === "GET"){
        let allJokes = getAllJokes(request, response);
        response.writeHead(200, {"Content-type":"text/json"})
        response.end(JSON.stringify(allJokes));
    }
})

server.listen(3000);

function getAllJokes(request, response){
    let arrayOfJokes = []
    let pathToData = path.join(__dirname, "data");
    let data = fs.readdirSync(pathToData);
    for(let i = 0; i < data.length; i++){
        let pathToFile = path.join(pathToData, `${i}.json`)
        let jokeString = fs.readFileSync(pathToFile, "utf-8");
        let joke = JSON.parse(jokeString);
        arrayOfJokes.push(joke);
    }
    return arrayOfJokes;
}