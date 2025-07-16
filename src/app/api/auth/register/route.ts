import { NextResponse, NextRequest } from "next/server";
import mysql from 'mysql2/promise';
import { randomUUID } from "crypto";
import config from "../../../../../config.json";
import { createAccountsTable } from '../../dbSchema';

export async function POST(req: NextRequest, res: NextResponse) {
    const data = await req.json();
    const { name, email, password } = data;
    const key = randomUUID();

    try {
        const connection = await mysql.createConnection({
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
            database: config.database,
          });
    
        await createAccountsTable(connection);

        const [rows] = await connection.execute(`SELECT email FROM accounts WHERE email = ?`, [email]);

        if ((rows as any[]).length <= 0) {
            await connection.execute(`INSERT INTO accounts (email, name, password, accountKey, balance) VALUES (?,?,?,?,?)`, [email, name, password, key, 10000]);
            return new Response(JSON.stringify({ status: 200, key: key }));
        } else {
            return new Response(JSON.stringify({ status: 502 }));
        }
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ status: 500 }));
    }
}