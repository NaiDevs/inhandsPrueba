import { conn } from "@/libs/mysql";
import { NextResponse } from "next/server";


export async function GET() {
    try {
      const results = await conn.query("SELECT *, COALESCE(clientes.nombre, 'Consumidor Final') AS cliente, SUM(detalleCotizacion.cantidad) AS productosVendidos FROM cotizaciones INNER JOIN detalleCotizacion ON cotizaciones.id = detalleCotizacion.id LEFT JOIN clientes ON cotizaciones.cliente = clientes.nombre WHERE estado = 0 GROUP BY cotizaciones.id;");
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
      const results = await conn.query("INSERT INTO cotizaciones SET ?" ,{
        id: data.get("id"),
        cliente: data.get("nombreCliente"),
        rtnCliente: data.get("rtnCliente"),
        fecha: data.get("fechaActual"),
        papel: data.get("papel"),
        tasaDescuento: data.get("tasa"),
        subtotal: data.get("subtotal"),
        descuento: data.get("descuento"),
        gravado15: data.get("gravado15"),
        gravado18: data.get("gravado18"),
        impuesto15: data.get("impuesto15"),
        impuesto18: data.get("impuesto18"),
        total: data.get("total"),
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