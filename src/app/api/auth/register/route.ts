import { NextResponse, NextRequest } from "next/server";
import mysql from 'mysql2/promise';
import { randomUUID } from "crypto";

export async function POST(req: NextRequest, res: NextResponse) {
    const data = await req.json();
    const { name, email, password } = data;
    const key = randomUUID();

    try {
        const connection = await mysql.createConnection({
          host: '46.247.108.133',
          port: 3306,
          user: 'u3_fVytWolksz',
          password: 'yyLFXut@03l7Xs4tuP+V@+Mo',
          database: 's3_bank',
        });
    
        await connection.execute(`CREATE TABLE IF NOT EXISTS accounts (email VARCHAR(64), name VARCHAR(64), password VARCHAR(64), accountKey VARCHAR(64), balance INT)`);

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