import { NextResponse, NextRequest } from "next/server";
import mysql from 'mysql2/promise';
import { cookies } from "next/headers";

export async function POST(req: NextRequest, res: NextResponse) {
    const data = await req.json();
    const { email, password } = data;

    try {
        const connection = await mysql.createConnection({
          host: '46.247.108.133',
          port: 3306,
          user: 'u3_fVytWolksz',
          password: 'yyLFXut@03l7Xs4tuP+V@+Mo',
          database: 's3_bank',
        });
    
        await connection.execute(`CREATE TABLE IF NOT EXISTS accounts (email VARCHAR(64), name VARCHAR(64), password VARCHAR(64), accountKey VARCHAR(64), balance int)`);

        const [rows] = await connection.execute(`SELECT * FROM accounts WHERE email = ?`, [email]);

        if ((rows as any[]).length <= 0) {
            return new Response(JSON.stringify({ status: 404 }));
        } else {
            const user = (rows as any)[0];
            
            if (user.password !== password) {
                return new Response(JSON.stringify({ status: 401, message: 'Incorrect password' }), {
                    status: 401,
                });
            } 

            (await cookies()).set("userToken", user.accountKey);
            return new Response(JSON.stringify({ status: 200, key: user.accountKey}));
        }
    } catch (error) {
        return new Response(JSON.stringify({ status: 500 }));
    }
}