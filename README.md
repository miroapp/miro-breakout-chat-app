# Miro Breakout Chat App

Add multiple local chats to you Miro board. Uses WebSockets and Miro Web SDK.

![Miro Breakout Chat App](https://github.com/miroapp/miro-breakout-chat-app/raw/master/showme.gif)

## Structure
- NodeJS backend. Uses [socket.io](https://socket.io) to set up the communication channel
- Svelte + TypeScript frontend

## Start-up
1. Get your application id as [described here](https://developers.miro.com/docs/how-to-start) and save it in the `./frontend/.env` file (use `.env_example` as a template)

2. Install packages and run
- If you have Docker, just launch `first-run.sh` - it will run `npm install` in both `backend` and `frontend` folders and then run `docker-compose up -d` (application folders including node_modules are mounted to containers to provide live reloading). Next time, you can just run `docker-compose up -d` in your root folder. Use `docker-compose down` to stop containers.

- If you don't have Docker, run `npm install && npm run dev` in 2 parallel instances of the terminal from both backend and frontend folders.

3. If everything goes well, you should see a webpage at http://localhost (also an empty array should be returned if you GET http://localhost:8081/rooms - this is an endpoint to get current chat rooms).

## Connecting to Miro

In Miro go to your profile settings, open the "API, SDK & Embed" tab and click on your app. There:
- set up the web-plugin URL to `http://localhost/init` - this is the app entrypoint served by the frontend application (see `./frontend/src/init` and `./frontend/public/init`). This is enough for development purposes. **Don't forget to change it to a real URL, once you publish your application.**
- choose `boards:read`, `boards:write` and `identity:read` in the "OAuth scopes" section
- if you want to let others authenticate your application (this is required for other users to start using the app), set the Redirect URLs to `https://{YOUR APP HOST}/auth-success.html`

## Notes

Backend server host is set in the `./frontend/.env` file.