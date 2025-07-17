const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const TaskType = require('./schema')

const schema = buildSchema(`
  type Query {
    task: Task
  }
  ${TaskType.toString()}
`)

const rootValue = {
  task: () => ({
    id: '1',
    title: 'Example Task',
    weight: 3,
    description: 'Sample description'
  })
}

const app = express()

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true
  })
)

app.listen(4000, () => {
  console.log('Server running on port 4000')
})
