#!/usr/bin/node
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull
} = require('graphql')
const { GraphQLSchema } = require('graphql/type')
const _ = require('lodash')
const mongoose = require('mongoose')

// Safely get Mongoose models
const Task = mongoose.models?.Task;
const Project = mongoose.models?.Project;

// Dummy tasks data
const tasks = [
  {
    id: '1',
    title: 'Create your first webpage',
    weight: 1,
    description: 'Create your first HTML file 0-index.html with: -Add the doctype on the first line (without any comment) -After the doctype, open and close a html tag Open your file in your browser (the page should be blank)',
    projectId: '1'
  },
  {
    id: '2',
    title: 'Structure your webpage',
    weight: 1,
    description: 'Copy the content of 0-index.html into 1-index.html Create the head and body sections inside the html tag, create the head and body tags (empty) in this order',
    projectId: '1'
  }
];

// Dummy projects data
const projects = [
  {
    id: '1',
    title: 'Web Development Project',
    weight: 1,
    description: 'Learn web development fundamentals'
  }
];

// Unified TaskType definition
const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    weight: { type: GraphQLInt },
    description: { type: GraphQLString },
    project: {
      type: ProjectType,
      resolve(parent) {
        // Use database if available, otherwise dummy data
        if (Project) {
          return Project.findById(parent.projectId)
        }
        return _.find(projects, { id: parent.projectId })
      }
    }
  })
});

// Unified ProjectType definition
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    weight: { type: GraphQLInt },
    description: { type: GraphQLString },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve(parent) {
        // Use database if available, otherwise dummy data
        if (Task) {
          return Task.find({ projectId: parent.id })
        }
        return _.filter(tasks, { projectId: parent.id })
      }
    }
  })
});

// Unified RootQuery definition
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    task: {
      type: TaskType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // Use database if available, otherwise dummy data
        if (Task) {
          return Task.findById(args.id)
        }
        return _.find(tasks, { id: args.id })
      }
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // Use database if available, otherwise dummy data
        if (Project) {
          return Project.findById(args.id)
        }
        return _.find(projects, { id: args.id })
      }
    },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve() {
        // Use database if available, otherwise dummy data
        if (Task) {
          return Task.find({})
        }
        return tasks
      }
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve() {
        // Use database if available, otherwise dummy data
        if (Project) {
          return Project.find({})
        }
        return projects
      }
    }
  }
});

// Unified Mutation definition
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addProject: {
      type: ProjectType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        weight: { type: new GraphQLNonNull(GraphQLInt) },
        description: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        // Only works with database
        if (!Project) {
          throw new Error('Database not available')
        }
        const project = new Project({
          title: args.title,
          weight: args.weight,
          description: args.description
        })
        return project.save()
      }
    },
    addTask: {
      type: TaskType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        weight: { type: new GraphQLNonNull(GraphQLInt) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        projectId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        // Only works with database
        if (!Task) {
          throw new Error('Database not available')
        }
        const task = new Task({
          title: args.title,
          weight: args.weight,
          description: args.description,
          projectId: args.projectId
        })
        return task.save()
      }
    }
  })
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})