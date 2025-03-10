const http = require("http");
 const server = http.createServer((req, res) => {
    console.log(`Received request: ${req.method} ${req.url}`);

    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify({message:"Hello World!"}));  
 })

 // Define the port number
 const PORT = 3000;

 // Start the server
 server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
 });
