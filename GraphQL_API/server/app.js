const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');

// Load environment variables first
require('dotenv').config();

// Load models BEFORE schema
require('./models/task');
require('./models/project');
const schema = require('./schema/schema');

const app = express();

// MongoDB Atlas connection
const CONNECTION_STRING = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(CONNECTION_STRING)
  .then(() => console.log('Connected to MongoDB Atlas database'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.error('Connection string:', CONNECTION_STRING.replace(process.env.DB_PASSWORD, '******'));
  });

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});