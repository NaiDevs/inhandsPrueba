import { connDB } from "@/libs/mysql";
import { NextResponse } from "next/server";

export async function GET(request: any) {
  try {
    const results = await connDB.query("SELECT inventario.codigo, inventario.nombre, inventario.costoCompra, inventario.precio, SUM(detalleVenta.cantidad) AS unidadesVendidas, (inventario.precio * SUM(detalleVenta.cantidad)) AS ingresosVentas, (inventario.costoCompra * SUM(detalleVenta.cantidad)) AS costosTotales, (inventario.precio * SUM(detalleVenta.cantidad)) - (inventario.costoCompra * SUM(detalleVenta.cantidad)) AS margenGanancia, (inventario.precio - inventario.costoCompra) AS gananciaUnidad FROM inventario INNER JOIN detalleVenta ON detalleVenta.codigoProducto = inventario.codigo GROUP BY inventario.codigo;");
    console.log(results)
    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Error al procesar la solicitud.",
      },
      {
        status: 500,
      }
    );
  }
}
