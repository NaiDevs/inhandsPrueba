import { connDB } from "@/libs/mysql";
import { NextResponse } from "next/server";


export async function GET() {
    try {
      const results = await connDB.query("SELECT * FROM descuentos ORDER BY `nombre` ASC;");
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

      console.log(data)

      const results = await connDB.query("INSERT INTO descuentos SET ?" ,{
        nombre: data.get("nombre"),
        tasa: data.get("tasa"),
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