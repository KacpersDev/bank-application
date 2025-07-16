import { Connection } from 'mysql2/promise';

export async function createAccountsTable(connection: Connection) {
  await connection.execute(`CREATE TABLE IF NOT EXISTS accounts (
    email VARCHAR(64),
    name VARCHAR(64),
    password VARCHAR(64),
    accountKey VARCHAR(64),
    balance INT
  )`);
}

export async function createTransactionsTable(connection: Connection) {
  await connection.execute(`CREATE TABLE IF NOT EXISTS transactions (
    sender VARCHAR(64),
    receiver VARCHAR(64),
    amount INT
  )`);
} 