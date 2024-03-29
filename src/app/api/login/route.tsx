import { connGlobal } from "@/libs/mysqlDB";
import { NextResponse } from "next/server";


export async function GET() {
    try {
      const results = await connGlobal.query("SELECT * FROM usuarios");
      return NextResponse.json(results);
    } catch (error:any) {
      console.log(error);
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 404,
        }
      );
    }
  }

  export async function POST(request:any) {
    try {
        const data = await request.json();
        const { username, password } = data;

        if (!username || !password) {
            return NextResponse.json(
                {
                    message: "Username and password are required",
                },
                {
                    status: 400,
                }
            );
        }

        const results = await connGlobal.query("SELECT * FROM usuarios WHERE usuario = ? AND contrasenauser = ?", [username, password]);

        if (!Array.isArray(results) || results.length === 0) {
            return NextResponse.json(
              {
                    message: "Invalid username or password",
              },
              {
                status: 401,
              }
            );
          }

        const userFromDB = results[0]; // Suponiendo que solo esperas un resultado
        const userFromEnv = "u966946366_" + userFromDB.usuario;
        const passwordFromEnv = userFromDB.contrasenabd;

        process.env.USER = userFromEnv;
        process.env.PASSWORD = passwordFromEnv;

        console.log("User and password saved in environment variables:", userFromEnv, passwordFromEnv);

        return NextResponse.json({db:userFromDB, usuario: userFromEnv, contrasenadb: passwordFromEnv });
    } catch (error:any) {
        console.error(error);
        return NextResponse.json(
            {
                message: error.message,
            },
            {
                status: 500,
            }
        );
    }
}
