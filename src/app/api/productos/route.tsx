import { connDB } from "@/libs/mysql";
import { NextResponse } from "next/server";


export async function GET() {
    try {
      const results = await connDB.query("SELECT * FROM inventario ORDER BY `nombre` ASC;");
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
      const results = await connDB.query("INSERT INTO inventario SET ?" ,{
        codigo: data.get("codigo"),
        nombre: data.get("nombre"),
        precio: data.get("precio"),
        existencias: data.get("existencias"),
        categoria: data.get("categoria"),
        marca: data.get("marca"),
        costoCompra: data.get("costoCompra"),
        proveedor: data.get("proveedor"),
        impuesto: data.get("impuesto"),
        descripcion: data.get("descripcion"),
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