import { NextRequest, NextResponse } from "next/server";
import mysql from 'mysql2/promise';

export async function POST(req: NextRequest, res: NextResponse) {
    const data = await req.json();
    const email = data.email;

    try {
        const connection = await mysql.createConnection({
          host: '46.247.108.133',
          port: 3306,
          user: 'u3_fVytWolksz',
          password: 'yyLFXut@03l7Xs4tuP+V@+Mo',
          database: 's3_bank',
        });

        await connection.execute(`CREATE TABLE IF NOT EXISTS transactions (sender VARCHAR(64), receiver VARCHAR(64), amount INT)`);
        const [rows] = await connection.execute(`SELECT * FROM transactions WHERE sender = ? OR receiver = ?`, [email, email]);
        return new Response(JSON.stringify({ status: 200, transactions: rows }));
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ status: 500 }));
    }
}