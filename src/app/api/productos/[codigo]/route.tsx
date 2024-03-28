import { conn } from "@/libs/mysql";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";


export async function GET(request: any, response: NextApiResponse) {
    try {
      const { params } = request;
      const result = await conn.query("SELECT * FROM inventario WHERE codigo = ?", [
        params.codigo,
      ]);
  
      if (!Array.isArray(result) || result.length === 0) {
        return NextResponse.json(
          {
            message: "Producto no encontrado",
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
      const result = await conn.query("DELETE FROM inventario WHERE codigo = ?", [
        params.codigo,
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
        codigo: data.get("codigo"),
        nombre: data.get("nombre"),
        precio: data.get("precio"),
        existencias: data.get("existencias"),
        categoria: data.get("categoria"),
        marca: data.get("marca"),
        impuesto: data.get("impuesto"),
        descripcion: data.get("descripcion"),
      }
      const results = await conn.query("UPDATE inventario SET ? WHERE codigo = ?" , [
        updateData,
        params.codigo,
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