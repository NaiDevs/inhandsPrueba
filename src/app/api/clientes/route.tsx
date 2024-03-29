import { connDB } from "@/libs/mysql";
import { NextResponse } from "next/server";


export async function GET() {
    try {
      const results = await connDB.query("SELECT * FROM clientes ORDER BY `nombre` ASC;");
      return NextResponse.json(results);
    } catch (error:any) {
      console.log(error);
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

  export async function POST(request:any) {
    try {
      const data = await request.formData();

      const results = await connDB.query("INSERT INTO clientes SET ?" ,{
        dni: data.get("dni"),
        nombre: data.get("nombre"),
        telefono: data.get("telefono"),
        correo: data.get("correo"),
        rtn: data.get("rtn"),
        direccion: data.get("direccion")
      });

      return NextResponse.json(results);
    } catch (error:any) {
      console.log(error);
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