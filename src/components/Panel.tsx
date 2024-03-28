
export default function PanelPage() {
    return(
        <div className="relative left-[220px] w-4/5 p-12 h-screen grid grid-cols-2">
            <div className="bg-white p-10 h-36 w-96 rounded-xl">
                <p className="text-xl font-semibold ">Total de Ingresos en Ventas</p>
                <p className="text-lg font-medium my-5">L.9000.00</p>
            </div>
            <div className="bg-white p-10 h-64 w-auto rounded-xl">
                <p className="text-xl font-semibold ">Top Productos más Vendidos</p>
                <p className="text-lg font-medium mt-5">Producto 1</p>
                <p className="text-lg font-medium">Producto 2</p>
                <p className="text-lg font-medium">Producto 3</p>
                <p className="text-lg font-medium">Producto 4</p>
                <p className="text-lg font-medium">Producto 5</p>
            </div>
            <div className="bg-white p-10 h-auto w-96 rounded-xl">
                <p className="text-xl font-semibold ">Promedio Cotizaciones Confirmadas</p>
                <p className="text-lg font-medium mt-5">Producto 1</p>
            </div>  
        </div>
)}