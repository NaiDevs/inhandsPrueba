import { connDB } from "@/libs/mysql";
import { NextResponse } from "next/server";


export async function GET() {
    try {
      const results = await connDB.query("SELECT * FROM `facturacion` WHERE id = 1");
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
      const results = await connDB.query("UPDATE facturacion SET ? WHERE id = 1" ,{
        cai: data.get("cai"),
        fechaLimite: data.get("fechaLimite"),
        FacturacionInicial: data.get("FacturacionInicial"),
        FacturacionFinal: data.get("FacturacionFinal"),
        papel: data.get("papel")
      });
      console.log(results)
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