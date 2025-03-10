// Import the built-in HTTP module to create a server
const http = require('http');
const url = require('url');

// A sample array to store student data 
// Consider this as a database for now
const students = [
    { id: 1, name: "Karma", age: 22 },
    { id: 2, name: "Pema", age: 24 }
];

// Create an HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    res.setHeader('Content-Type', 'application/json');

    // Check if the request is a GET request to the homepage "/"
    if (req.method === 'GET' && parsedUrl.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' }); // Response type is plain text
        res.end('Welcome to our API'); // Send response text
    }
    
    // Check if the request is a GET request to "/students"
    else if (req.method === 'GET' && parsedUrl.pathname === '/students') {
        res.writeHead(200); // Set status code 200 (OK)
        res.end(JSON.stringify(students)); // Converts students array to JSON and sends it
    }
    
    // Check if the request is a GET request to fetch a single student by ID
    else if (req.method === 'GET' && parsedUrl.pathname.startsWith('/students/')) {
        const parts = parsedUrl.pathname.split('/');
        if (parts.length === 3) {
            const id = parseInt(parts[2], 10);
            const student = students.find(s => s.id === id);
            
            if (student) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(student));
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Student not found');
            }
        } else {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Invalid request format');
        }
    }
    
    // If the request doesn't match any of the above routes, return 404 Not Found
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Route not found" }));
    }
});

// Start the server and listen on port 3000
const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

