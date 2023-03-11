const path = require("path");
const fs = require("fs");
const http = require("http");
const url = require("url");

const server = http.createServer(function (request, response){
    if(request.url === "/api/jokes" && request.method === "GET"){
        let allJokes = getAllJokes();
        response.writeHead(200, {"Content-type":"text/json"})
        response.end(JSON.stringify(allJokes));
    }else if(request.url === "/api/jokes" && request.method === "POST"){
        let data = '';
        request.on('data', function (chunk){
            data += chunk;
        });
        request.on('end', function (){
            addJoke(data);
        });
        response.writeHead(200);
        response.end();
    }else if(request.url.startsWith('/api/like')){
        const params = url.parse(request.url, true).query;
        if(addLikesOrDislikes(params, true)){
            response.writeHead(200);
            response.end();
        }else{
            response.writeHead(400);
            response.end();
        }
    }else if(request.url.startsWith('/api/dislike')){
        const params = url.parse(request.url, true).query;
        if(addLikesOrDislikes(params, false)){
            response.writeHead(200);
            response.end();
        }else{
            response.writeHead(400);
            response.end();
        }
    }
})

server.listen(3000);

function getAllJokes(){
    let arrayOfJokes = [];
    const pathToData = path.join(__dirname, "data");
    const data = fs.readdirSync(pathToData);
    for(let i = 0; i < data.length; i++){
        let pathToFile = path.join(pathToData, `${i}.json`);
        let jokeString = fs.readFileSync(pathToFile, "utf-8");
        let joke = JSON.parse(jokeString);
        arrayOfJokes.push(joke);
    }
    return arrayOfJokes;
}

function addJoke(jokeString){
    let joke = JSON.parse(jokeString);
    joke.likes = 0;
    joke.dislikes = 0;
    const pathToData = path.join(__dirname, "data");
    const pathToFile = path.join(pathToData, `${fs.readdirSync(pathToData).length}.json`);
    fs.writeFileSync(pathToFile, JSON.stringify(joke));
}

function addLikesOrDislikes(params, check){
    if(isNaN(params.id)){
        return false;
    }
    const pathToData = path.join(__dirname, "data");
    const numberOfJokes = fs.readdirSync(pathToData).length;
    if(params.id < 0 || params.id >= numberOfJokes){
        return false;
    }
    let pathToFile = path.join(pathToData, `${params.id}.json`);
    let joke = JSON.parse(fs.readFileSync(pathToFile, 'utf-8'));
    if(check){
        joke.likes++;
    }else {
        joke.dislikes++;
    }  
    fs.writeFileSync(pathToFile, JSON.stringify(joke));
    return true;
}