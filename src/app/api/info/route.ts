import { NextRequest, NextResponse } from "next/server";
import mysql from 'mysql2/promise';
import config from "../../../../config.json";
import { createAccountsTable } from '../dbSchema';

export async function POST(req: NextRequest, res: NextResponse) {
    const data = await req.json();
    const key = data.key;

    try {
        const connection = await mysql.createConnection({
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
            database: config.database,
          });
    
        await createAccountsTable(connection);

        const [rows] = await connection.execute(`SELECT * FROM accounts WHERE accountKey = ?`, [key]);

        if ((rows as any[]).length <= 0) {
            return new Response(JSON.stringify({ status: 404 }));
        } else {
            const user = (rows as any)[0];
            const username = user.name;
            const balance = user.balance;
            const email = user.email;

            return new Response(JSON.stringify({ status: 200, username: username, balance: balance, email: email}));
        }
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ status: 500 }));
    }
}