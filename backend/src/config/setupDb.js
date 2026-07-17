'use strict';

require('dotenv').config();
const { Client } = require('pg');

const createDatabase = async () => {
  const dbName = process.env.DB_NAME || 'employee_management';
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres', // Connect to default postgres DB
  };

  const client = new Client(config);

  try {
    await client.connect();
    
    // Check if database exists
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (res.rowCount === 0) {
      console.log(`Database "${dbName}" does not exist. Creating...`);
      // CREATE DATABASE cannot be executed inside a transaction block, pg library supports it
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" created successfully!`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error('Error setting up database:', err.message);
  } finally {
    await client.end();
  }
};

createDatabase();
