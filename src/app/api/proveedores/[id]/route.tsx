import { conn } from "@/libs/mysql";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";


export async function GET(request: any, response: NextApiResponse) {
    try {
      const { params } = request;
      const result = await conn.query("SELECT * FROM proveedores WHERE id = ?", [
        params.id,
      ]);
  
      if (!Array.isArray(result) || result.length === 0) {
        return NextResponse.json(
          {
            message: "Proveedor no encontrado",
          },
          {
            status: 404,
          }
        );
      }
  
  
      return NextResponse.json(result[0]);
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
      const result = await conn.query("DELETE FROM proveedores WHERE id = ?", [
        params.id,
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
        proveedor: data.get("proveedor"),
        contacto: data.get("contacto"),
        telefono: data.get("telefono"),
        correo: data.get("correo"),
        direccion: data.get("direccion")
      }
      const results = await conn.query("UPDATE proveedores SET ? WHERE id = ?" , [
        updateData,
        params.id,
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