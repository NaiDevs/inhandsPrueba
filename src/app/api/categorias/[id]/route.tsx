import { NextResponse } from "next/server";
import { connDB } from "@/libs/mysql";

export async function DELETE(request:any, params:any ) {
  try {
    const results = await connDB.query("DELETE FROM `categorias` WHERE id = ?" , [
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
