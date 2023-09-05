# Watermelon Virtual Wallet - RESTful API 🍉 💳
I made this backend Express app to accompany the new challenge of rebuilding the new [Watermelon app with React](https://github.com/FranCeballos/watermelon-wallet-front.git), previously built with Vanilla JavaScript and no cloud database. 

It uses JSON Web Token verification for accessing resources from the front end, as well as connecting with a MongoDB database.

## Main dependencies used
- jsonwebtoken: for user authentication.
- mongoose: for connecting with MongoDB and managing data models.
- express-validator: for validating user input.

## Usage
First, add your own private environment variables: 
```
PORT="preferedPort" // skip in production
MONGO_URL="yourUrl" // for connecting to mongoDB
TOKEN_KEY="yourTokenKey" // for validating token
```

Then install dependencies and start the app in development mode:

```
npm install
npm run dev /// "nodemon index.js"
```

## Author
Francisco Ceballos

### Special Notes
Right now the backend API runs on a free tier of Render, so the server sleeps after a certain amount of minutes of inactivity. An initial request may take around 30 seconds to get a response.
