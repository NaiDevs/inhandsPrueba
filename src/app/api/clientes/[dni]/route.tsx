import { connDB } from "@/libs/mysql";
import { NextResponse } from "next/server";
import { NextApiResponse } from "next";

export async function GET(request: any, response: NextApiResponse) {
    try {
      const { params } = request;
      const results = await connDB.query("SELECT * FROM clientes WHERE dni = ?", [
        params.dni,
      ]);
  
      if (!Array.isArray(results) || results.length === 0) {
        return NextResponse.json(
          {
            message: "Cliente no encontrado",
          },
          {
            status: 404,
          }
        );
      }
  
      return NextResponse.json(results[0]);
    } catch (error:any) {
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 500 }
      );
    }
  }

  export async function DELETE(request: any, response: NextApiResponse) {
    try {
      const { params } = request;
      const result = await connDB.query("DELETE FROM clientes WHERE dni = ?", [
        params.dni,
      ]);
  
      return new Response(null, {
        status: 204,
      });
    } catch (error:any) {
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 500 }
      );
    }
  }

  export async function PUT(request: any, response: NextApiResponse) {
    try {
      const { params } = request;
      const data = await request.formData();
      const updateData = {
        dni: data.get("dni"),
        nombre: data.get("nombre"),
        telefono: data.get("telefono"),
        correo: data.get("correo"),
        rtn: data.get("rtn"),
        direccion: data.get("direccion")
      }
      const results = await connDB.query("UPDATE clientes SET ? WHERE dni = ?" , [
        updateData,
        params.dni,
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