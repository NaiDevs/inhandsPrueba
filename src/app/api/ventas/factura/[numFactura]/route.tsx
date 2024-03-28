import { conn } from "@/libs/mysql";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";


export async function GET(request: any, response: NextApiResponse) {
    try {
      const { params } = request;
      const results = await conn.query("SELECT *, ventas.numFactura, COALESCE(clientes.nombre, 'Consumidor Final') AS cliente, inventario.codigo AS codigoProducto, inventario.nombre AS producto FROM ventas INNER JOIN detalleVenta ON ventas.id = detalleVenta.id LEFT JOIN clientes ON ventas.cliente = clientes.nombre RIGHT JOIN inventario ON detalleVenta.producto = inventario.nombre WHERE ventas.numFactura = ?", [
        params.numFactura,
      ]);

  
      if (!Array.isArray(results) || results.length === 0) {
        return NextResponse.json(
          {
            message: "Venta no encontrado",
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