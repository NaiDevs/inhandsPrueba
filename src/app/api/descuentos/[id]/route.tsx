import { connDB } from "@/libs/mysql";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function DELETE(request: any, response: NextApiResponse) {
    try {
      const { params } = request;
      const results = await connDB.query("DELETE FROM `descuentos` WHERE id = ?" , [
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