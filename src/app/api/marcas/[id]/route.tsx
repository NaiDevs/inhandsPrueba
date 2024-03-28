import { conn } from "@/libs/mysql";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function DELETE(request: any, response: NextApiResponse) {
    try {
      const { params } = request;
      const results = await conn.query("DELETE FROM `marcas` WHERE id = ?" , [
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