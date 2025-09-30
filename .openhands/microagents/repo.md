# onprem-api

## Project Description
onprem-api is a simple Node.js REST API that provides static log data. It's built using Express.js and designed to be a lightweight service that returns mock log entries through a dedicated endpoint.

## File Structure
```
.
├── index.js           # Main application file with API endpoints and server configuration
├── package.json       # Project metadata and dependencies
├── package-lock.json  # Dependency lock file
├── README.md          # Project readme (minimal)
└── server.log         # Server output log file
```

## Running the Application
To run the application:
1. Install dependencies: `npm install`
2. Start the server: `npm start` or `node index.js`
3. The server will run at http://localhost:3000

## Available Endpoints
- `GET /logs` - Returns a static JSON payload with mock log entries
- `GET /` - Returns a welcome message

## Development Notes
- The application uses Express.js version 5.x
- No tests are currently implemented
- The server runs on port 3000 by default
- The project is configured as a CommonJS module
