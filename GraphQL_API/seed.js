const mongoose = require('mongoose');
const Task = require('./models/task');
const Project = require('./models/project');

// Use the same connection string from app.js
const DB_USER = 'jwilsonatlas';
const DB_PASSWORD = 'TY5nJ9PaRqAC5NTf';
const DB_NAME = 'graphql_db';
const CONNECTION_STRING = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.2awvmkk.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

async function seedDatabase() {
  try {
    await mongoose.connect(CONNECTION_STRING);
    console.log('Connected to database for seeding');

    // Clear existing data
    await Task.deleteMany({});
    await Project.deleteMany({});

    // Create projects
    const project1 = new Project({
      title: 'Advanced HTML',
      weight: 1,
      description: 'Welcome to the Web Stack specialization. The 3 first projects will give you all basics of the Web development: HTML, CSS and Developer tools.'
    });

    const project2 = new Project({
      title: 'Bootstrap',
      weight: 1,
      description: 'Bootstrap is a free and open-source CSS framework directed at responsive, mobile-first front-end web development.'
    });

    const savedProject1 = await project1.save();
    const savedProject2 = await project2.save();

    // Create tasks
    const task1 = new Task({
      title: 'Create your first webpage',
      weight: 1,
      description: 'Create your first HTML file 0-index.html with: -Add the doctype on the first line -After the doctype, open and close a html tag',
      projectId: savedProject1.id
    });

    const task2 = new Task({
      title: 'Structure your webpage',
      weight: 1,
      description: 'Copy the content of 0-index.html into 1-index.html Create the head and body sections',
      projectId: savedProject1.id
    });

    const task3 = new Task({
      title: 'Learn Bootstrap Grid System',
      weight: 1,
      description: 'Understand how to use Bootstrap grid system for responsive layouts',
      projectId: savedProject2.id
    });

    await Promise.all([task1.save(), task2.save(), task3.save()]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();