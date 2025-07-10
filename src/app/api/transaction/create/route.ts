import { NextRequest, NextResponse } from "next/server";
import mysql from 'mysql2/promise';

export async function POST(req: NextRequest, res: NextResponse) {
    const data = await req.json();
    const { sender, receiver, amount } = data;

    console.log(data);

    try {
        const connection = await mysql.createConnection({
            host: '',
            port: 3306,
            user: '',
            password: '',
            database: '',
        });

        await connection.execute(`CREATE TABLE IF NOT EXISTS transactions (sender VARCHAR(64),receiver VARCHAR(64),amount INT)`);
        await connection.execute(`INSERT INTO transactions (sender, receiver, amount) VALUES (?, ?, ?)`,[sender, receiver, amount]);
        await connection.execute(`UPDATE accounts SET balance = balance - ? WHERE email = ?`,[amount, sender]);
        await connection.execute(`UPDATE accounts SET balance = balance + ? WHERE email = ?`,[amount, receiver]);
        return new Response(JSON.stringify({ status: 200 }));
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ status: 500 }));
    }
}