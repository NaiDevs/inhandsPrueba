import { conn } from "@/libs/mysql";
import { NextResponse } from "next/server";


export async function GET() {
    try {
      const results = await conn.query("SELECT MAX(id) + 1 AS id FROM `cotizaciones`");
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

  export async function POST(request: any) {
    try {
        const formData2 = await request.formData();
        const id = formData2.get("id");
        const rows = formData2.get("rows");

        console.log(rows)

        // Obtener los datos del array 'productos[]' del formulario
        const productosArray = formData2;
        let ultimoNumero = 0;

        console.log("Contenido de 'productos[]':", productosArray);

        // Iterar sobre los productos enviados en el formulario
        for (let i = 0; i <= rows; i++) {
            const codigo = formData2.get(`productos[${i}][codigo]`);
            const nombre = formData2.get(`productos[${i}][nombre]`);
            const precio = formData2.get(`productos[${i}][precio]`);
            const cantidad = formData2.get(`productos[${i}][cantidad]`);

            // Insertar los datos en la base de datos
            const results = await conn.query("INSERT INTO detalleCotizacion SET ?", {
                id: id,
                codigoProducto: codigo,
                producto: nombre, // Cambia esto según tu estructura de base de datos
                cantidad: cantidad,
                precio: precio,
            });

            console.log(`Producto ${i + 1} insertado en la base de datos.`);
        }

        return NextResponse.json({ message: "Datos insertados correctamente." });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json(
            { message: "Error al insertar datos en la base de datos." },
            { status: 500 }
        );
    }
}
