const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const app = express();

const gqlSchema = require("./GraphQL/schema/index");
const gqlResolvers = require("./GraphQL/resolvers/index");

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: gqlSchema,
    rootValue: gqlResolvers,
    graphiql: true,
  })
);
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.nazdjic.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3001);
  })
  .catch((err) => {
    console.log(err);
  });
