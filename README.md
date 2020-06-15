# Server for simple chat application.

## Installation
Clone the repo
Run 'npm i' to start install the dependencies,
Run 'npm run build' to compile the typescript files to Javascript
Run npm start to start the server locally.

## Logging
Logging will show up in the terminal where you run the start script

## Timeout
You can set a timeout for clients so they will get disconnected after inactivity.
In the repo it's set to 600 sec( 10 minutes)
if you want to change this change the constant 'clientTimeoutInS' in the /src/index.ts file and then rerun the 'npm run build' command


