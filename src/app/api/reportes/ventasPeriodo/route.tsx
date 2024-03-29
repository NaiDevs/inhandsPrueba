import { connDB } from "@/libs/mysql";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  try {
    const data = await request.formData();
    const inicio = data.get("inicio");
    const final = data.get("final");
    console.log(data)
    const results = await connDB.query("SELECT ventas.numFactura, ventas.cliente, ventas.fecha, SUM(detalleVenta.cantidad) AS productosVendidos, ventas.total FROM ventas INNER JOIN detalleVenta ON ventas.id = detalleVenta.id WHERE ventas.fecha BETWEEN ? AND ?", [inicio, final]);
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
