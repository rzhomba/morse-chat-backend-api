# Morse Chat Backend Api

Backend for morse chat app. Provides REST API for certain actions such as room creation or authentication. Real-time
messaging is implemented via Websockets.

## Configuration

Create a `.env` file:

````dotenv
APPLICATION_PORT=[APPLICATION_PORT]
DB_CONNECTION=[DB_CONNECTION_URL]
CORS_ORIGIN=[CORS_ORIGIN_URL]
COOKIES_DOMAIN=[COOKIES_DOMAIN_URL]
JWT_SECRET=[SECRET_KEY]
````

`JWT_SECRET` must be a long random string.
For example, it may be generated with `node -e "console.log(require('crypto').randomBytes(256).toString('base64'))”`

## Starting the application

Requires [Node.js](https://nodejs.org/) `^12.22`
and [MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/) `^4.0`

1. Run `npm i`
2. Configure the app
3. To start app in production mode:
   1. `npm run build`
   2. `npm run start`
4. To start app in development mode run `npm run watch`
5. Install [morse-chat-frontend](https://github.com/rzhomba/morse-chat-frontend)

## License

This project is MIT licensed.
