import { conn } from "@/libs/mysql";
import { NextResponse } from "next/server";


export async function GET() {
    try {
      const results = await conn.query("SELECT *, ventas.numFactura, COALESCE(clientes.nombre, 'Consumidor Final') AS cliente, SUM(detalleVenta.cantidad) AS productosVendidos FROM ventas INNER JOIN detalleVenta ON ventas.id = detalleVenta.id LEFT JOIN clientes ON ventas.cliente = clientes.nombre GROUP BY ventas.id;");
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
      const results = await conn.query("INSERT INTO ventas SET ?" ,{
        numFactura: data.get("numFactura"),
        cai: data.get("cai"),
        cliente: data.get("nombreCliente"),
        rtnCliente: data.get("rtnCliente"),
        fecha: data.get("fechaActual"),
        papel: data.get("papel"),
        metodopago: data.get("metodoPago"),
        efectivo: data.get("cash"),
        cambio: data.get("change"),
        tasaDescuento: data.get("tasa"),
        subtotal: data.get("subtotal"),
        descuento: data.get("descuento"),
        gravado15: data.get("gravado15"),
        gravado18: data.get("gravado18"),
        impuesto15: data.get("impuesto15"),
        impuesto18: data.get("impuesto18"),
        total: data.get("total"),
        fechaLimiteEmision: data.get("fechaLimite"),
        FacturacionInicial: data.get("FacturacionInicial"),
        FacturacionFinal: data.get("FacturacionFinal"),
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