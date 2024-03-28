import { conn } from "@/libs/mysql";
import { NextResponse } from "next/server";


export async function GET() {
    try {
      const results = await conn.query("SELECT * FROM perfil WHERE id = 1");
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
  export async function PUT(request:any) {
    try {
      const data = await request.formData();
      const updateData = {
        nombre: data.get("nombre"),
        telefono: data.get("telefono"),
        correo: data.get("correo"),
        rtn: data.get("rtn"),
        direccion: data.get("direccion"),
        pagina: data.get("pagina"),
      }
      const results = await conn.query("UPDATE perfil SET ? WHERE id = 1" , [
        updateData,
      ]);

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