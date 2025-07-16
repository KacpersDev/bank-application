import { NextRequest, NextResponse } from "next/server";
import mysql from 'mysql2/promise';
import config from "../../../../config.json";
import { createTransactionsTable } from '../dbSchema';

export async function POST(req: NextRequest, res: NextResponse) {
    const data = await req.json();
    const email = data.email;

    try {
        const connection = await mysql.createConnection({
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
            database: config.database,
          });

        await createTransactionsTable(connection);
        const [rows] = await connection.execute(`SELECT * FROM transactions WHERE sender = ? OR receiver = ?`, [email, email]);
        return new Response(JSON.stringify({ status: 200, transactions: rows }));
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ status: 500 }));
    }
}