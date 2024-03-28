import { conn } from "@/libs/mysql";
import { NextResponse } from "next/server";
import { NextApiResponse } from "next";

export async function GET(request: any, response: NextApiResponse) {
    try {
      const { params } = request;
      const results = await conn.query("SELECT *, COALESCE(clientes.nombre, 'Consumidor Final') AS cliente, inventario.codigo AS codigoProducto, inventario.nombre AS producto FROM cotizaciones INNER JOIN detalleCotizacion ON cotizaciones.id = detalleCotizacion.id LEFT JOIN clientes ON cotizaciones.cliente = clientes.nombre RIGHT JOIN inventario ON detalleCotizacion.producto = inventario.nombre WHERE cotizaciones.id = ?", [
        params.id,
      ]);
  
      if (!Array.isArray(results) || results.length === 0) {
        return NextResponse.json(
          {
            message: "Cotizacion no encontrada",
          },
          {
            status: 404,
          }
        );
      }
  
      return NextResponse.json(results);
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
      const results = await conn.query("UPDATE `cotizaciones` SET `estado`='1' WHERE `id`= ?" , [
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
  export async function DELETE(request: any, response: NextApiResponse) {
    try {
      const { params } = request;
      const results = await conn.query("DELETE FROM `cotizaciones` WHERE id = ?" , [
        params.id,
      ]);
      const results2 = await conn.query("DELETE FROM `detalleCotizacion` WHERE id = ?" , [
        params.id,
      ]);
      return NextResponse.json(results),NextResponse.json(results2);
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