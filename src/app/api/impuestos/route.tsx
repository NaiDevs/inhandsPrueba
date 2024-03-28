import { conn } from "@/libs/mysql";
import { NextResponse } from "next/server";


export async function GET() {
    try {
      const results = await conn.query("SELECT * FROM impuestos");
      return NextResponse.json(results);
    } catch (error:any) {
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