const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');

// Load models BEFORE schema
require('./models/task');
require('./models/project');
const schema = require('./schema/schema');

const app = express();

// MongoDB Atlas connection
const DB_USER = 'jwilsonatlas';
const DB_PASSWORD = 'TY5nJ9PaRqAC5NTf';
const DB_NAME = 'graphql_db';
const CONNECTION_STRING = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.2awvmkk.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB Atlas database');
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