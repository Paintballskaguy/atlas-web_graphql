const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { GraphQLSchema, GraphQLObjectType } = require('graphql')
const TaskType = require('./schema')

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    task: {
      type: TaskType,
      resolve () {
        return {
          id: '1',
          title: 'Learn GraphQL',
          weight: 5,
          description: 'Master GraphQL fundamentals'
        }
      }
    }
  }
})

const schema = new GraphQLSchema({
  query: RootQuery
})

const app = express()

// Configure GraphQL endpoint
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
)

// Start server
app.listen(4000, () => {
  console.log('Server running on port 4000')
})
