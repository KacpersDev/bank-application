import { NextResponse, NextRequest } from "next/server";
import mysql from 'mysql2/promise';
import { cookies } from "next/headers";
import config from "../../../../../config.json";
import { createAccountsTable } from '../../dbSchema';

export async function POST(req: NextRequest, res: NextResponse) {
    const data = await req.json();
    const { email, password } = data;

    try {
        const connection = await mysql.createConnection({
          host: config.host,
          port: config.port,
          user: config.user,
          password: config.password,
          database: config.database,
        });
    
        await createAccountsTable(connection);
        

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