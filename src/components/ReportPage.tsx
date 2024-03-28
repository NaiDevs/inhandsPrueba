"use client"
"use client"
import { Input, Button, Textarea, Select, SelectItem, Table, TableBody, TableHeader, TableRow, TableColumn, TableCell, Spinner, Tooltip } from "@nextui-org/react"
import axios from 'axios'
import * as XLSX from 'xlsx';
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from "next/navigation"; 
import { Toaster, toast } from 'sonner'
import CloseIcon from "./icons/CloseIcon";
import Link from "next/link";
import Trash from "./icons/Trash";
import Search from "./icons/Search";
import PDFPeriodo from "./PdfPeriodo";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import PDFRentabilidad from "./PdfRentabilidad";

export default function ReportPage() {

  interface ReporteVentas {
    id: number;
    cliente: string;
    numFactura: string;
    fecha: string;
    productosVendidos: number;
    total: number;
  }

  interface Rentabilidad {
    codigo: string;
    nombre: string;
    costoCompra: number;
    precio: number;
    unidadesVendidas: number;
    ingresosVentas: number;
    costosTotales: number;
    margenGanancia: number;
    gananciaUnidad: number;
  }
  
  interface PDFPropsVentas {
    data: ReporteVentas[];
    inicio: string;
    final: string;
  }
  

    const [mostrarReporteVentas, setMostrarReporteVentas] = useState(false);
    const [mostrarReporteRentabilidad, setMostrarReporteRentabilidad] = useState(false);
    const [mostrarReporteClientes, setMostrarReporteClientes] = useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [dataFechas, setFechas] = useState({ inicio: '', final: ''});
    const [dataFechasReporte, setFechasReporte] = useState([]);
    const [dataRentabilidadProducto, setRentabilidadProductos] = useState([]);
    const [inicio, setInicio] = useState('');
    const [final, setFinal] = useState('');


    const router = useRouter();
    const form = useRef(null);

    const ventas = () => {
      const handleChange = (e:any) => {
        setFechas({
          ...dataFechas,
          [e.target.name]: e.target.value,
        });
        if (e.target.name === 'inicio') {
          setInicio(e.target.value);
        } else if (e.target.name === 'final') {
          setFinal(e.target.value);
        }

      };
        const handleSubmit = async (e:any) => {
          e.preventDefault();
          
          try {
            const formData = new FormData();
            formData.append("inicio", dataFechas.inicio + " 00:00:00");
            formData.append("final", dataFechas.final + " 23:59:59");
        
            const res = await axios.post("/api/reportes/ventasPeriodo" , formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }).then((res) => {
              const reporteData = res.data;
              setFechasReporte(reporteData);
            });
            
          } catch {
            toast.error('Error al Ingresar los Datos');
            router.refresh();
          }
        };
        const formatFecha = (fecha: any) => {
          const date = new Date(fecha);
          const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          };
          return date.toLocaleDateString("es-ES", options);
        };

        const exportToXLSX = () => {
          const workbook = XLSX.utils.book_new();
      
          const worksheetData = dataFechasReporte.map((reporte: ReporteVentas) => [
            reporte.numFactura,
            reporte.cliente,
            formatFecha(reporte.fecha),
            reporte.productosVendidos,
            reporte.total,
          ]);
      
          const worksheet = XLSX.utils.aoa_to_sheet([
            ['No. Factura', 'Cliente', 'Fecha y Hora', 'Productos Vendidos', 'Total'],
            ...worksheetData,
          ]);
      
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte de Ventas');
      
          const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
          const blob = new Blob([wbout], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'reporte-de-ventas.xlsx';
          a.click();
        };
        
        return (
            <div className="absolute top-0 w-full p-12 h-screen bg-[#E4E9F7]">
            <Toaster richColors  />
            <div className="absolute top-0 right-0 m-3 text-xl transition-all hover:rotate-45 cursor-pointer" onClick={() => setMostrarReporteVentas(false)}>
            <CloseIcon />
            </div>
              <p className="text-4xl text-center font-semibold">Reporte de Ventas</p>
              <div className="relative flex">
                <div className="ml-0 mr-10 w-[90%]">
                  <form onSubmit={handleSubmit}>         
                    <div className="grid gap-10 grid-cols-3 mt-6 ">
                      <div>
                        <label htmlFor="">Fecha Inicio del Reporte:</label>
                        <Input name="inicio" type="date" onChange={handleChange} required />
                      </div>
                      <div>
                        <label htmlFor="">Fecha Final del Reporte:</label>
                        <Input name="final" type="date" onChange={handleChange} required />
                      </div>
                      <div className="flex justify-center items-center mt-6"><Button type="submit" size="md" className="bg-[#1d1b31] text-white">Generar Reporte</Button></div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="relative flex">
                <div className="ml-0 mr-10 w-[90%]">
                  <div className="grid grid-cols-2 mt-6 ">
                    <div className="flex justify-center mt-6">
                      <PDFDownloadLink document={<PDFPeriodo data={dataFechasReporte} inicio={inicio} final={final} />} fileName="reporte-de-ventas.pdf">
                        {({ blob, url, loading, error }) =>
                          loading ? <Button type="submit" size="md" className="bg-[#1d1b31] text-white">Cargando</Button> : <Button type="submit" size="md" className="bg-[#1d1b31] text-white">Exportar PDF</Button>
                        }
                      </PDFDownloadLink>
                    </div>
                    <div className="flex justify-center mt-6">
                      <Button type="button" size="md" className="bg-[#1d1b31] text-white" onClick={exportToXLSX}>Exportar XLSX</Button></div>
                  </div>
                </div>
              </div>
              <div>
              <Table
                isStriped
                aria-label="Tabla de clientes"
                className=" max-h-[300px] my-[18px]"
              >
                <TableHeader>
                  <TableColumn>No. Factura</TableColumn>
                  <TableColumn>Cliente</TableColumn>
                  <TableColumn>Fecha y Hora</TableColumn>
                  <TableColumn>Productos Vendidos</TableColumn>
                  <TableColumn>Total</TableColumn>
                </TableHeader>
                <TableBody emptyContent={""} className=" overflow-scroll">
                  {dataFechasReporte.map((reporte: ReporteVentas) => (
                    <TableRow key={reporte.id}>
                      <TableCell>{reporte.numFactura}</TableCell>
                      <TableCell>{reporte.cliente}</TableCell>
                      <TableCell>{formatFecha(reporte.fecha)}</TableCell>
                      <TableCell>{reporte.productosVendidos}</TableCell>
                      <TableCell>L.{reporte.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>

              </Table>
              </div>
          </div>
          
        );
    }

    const rentabilidad = () => {
        const handleSubmit = async (e:any) => {
          try {     
            const res = await axios.get("/api/reportes/rentabilidadProducto/").then((res) => {
              const reporteData = res.data;
              setRentabilidadProductos(reporteData);
            });
            
          } catch {
            toast.error('Error al Ingresar los Datos');
            router.refresh();
          }
        };

        const formatNumber = (number: any) => {
          const formattedNumber = Number(number).toFixed(2); // Formatear número con dos decimales
          return `L. ${formattedNumber}`; // Agregar "L." al número formateado
        };
        
        const exportToXLSX = () => {
          const workbook = XLSX.utils.book_new();
      
          const worksheetData = dataRentabilidadProducto.map((reporte: Rentabilidad) => [
            reporte.codigo,
            reporte.nombre,
            reporte.costoCompra,
            reporte.precio,
            reporte.unidadesVendidas,
            reporte.ingresosVentas,
            reporte.costosTotales,
            reporte.margenGanancia,
            reporte.gananciaUnidad,
          ]);
      
          const worksheet = XLSX.utils.aoa_to_sheet([
            ['Codigo', 'Nombre', 'Costo de Compra', 'Precio de Venta', 'Unidades Vendidas', 'Ingresos de Ventas', 'Costos Totales', 'Margen de Ganancia', 'Margen de Ganancia por Unidad'],
            ...worksheetData,
          ]);
      
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte de Rentabilidad');
      
          const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
          const blob = new Blob([wbout], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'reporte-de-retanbilidad-por-productos.xlsx';
          a.click();
        };
        
        return (
            <div className="absolute top-0 w-full p-12 h-screen bg-[#E4E9F7]">
            <Toaster richColors  />
            <div className="absolute top-0 right-0 m-3 text-xl transition-all hover:rotate-45 cursor-pointer" onClick={() => setMostrarReporteVentas(false)}>
            <CloseIcon />
            </div>
              <p className="text-4xl text-center font-semibold">Reporte de Rentabilidad por Producto</p>
              <div className="relative flex">
                <div className="ml-0 mr-10 w-[90%]">
                  <form onSubmit={handleSubmit}>         
                    <div className="grid gap-10 grid-cols-3 mt-6 ">
                     
                      
                    </div>
                  </form>
                </div>
              </div>
              <div className="relative flex">
                <div className="ml-0 mr-10 w-[90%]">
                  <div className="grid grid-cols-3 mt-6 ">
                    <div className="flex justify-center items-center mt-6"><Button onClick={handleSubmit} size="md" className="bg-[#1d1b31] text-white">Generar Reporte</Button></div>
                    <div className="flex justify-center mt-6">
                      <PDFDownloadLink document={<PDFRentabilidad data={dataRentabilidadProducto} />} fileName="reporte-de-retanbilidad-por-productos.pdf">
                        {({ blob, url, loading, error }) =>
                          loading ? <Button type="submit" size="md" className="bg-[#1d1b31] text-white">Cargando</Button> : <Button type="submit" size="md" className="bg-[#1d1b31] text-white">Exportar PDF</Button>
                        }
                      </PDFDownloadLink>
                    </div>
                    <div className="flex justify-center mt-6">
                      <Button type="button" size="md" className="bg-[#1d1b31] text-white" onClick={exportToXLSX}>Exportar XLSX</Button></div>
                  </div>
                </div>
              </div>
              <div>
              <Table
                isStriped
                aria-label="Tabla de clientes"
                className=" max-h-[300px] my-[18px]"
              >
                <TableHeader>
                  <TableColumn>Codigo</TableColumn>
                  <TableColumn>Nombre</TableColumn>
                  <TableColumn>Costo de Compra</TableColumn>
                  <TableColumn>Precio de Venta</TableColumn>
                  <TableColumn>Unidades Vendidas</TableColumn>
                  <TableColumn>Ingresos de Ventas</TableColumn>
                  <TableColumn>Costos Totales</TableColumn>
                  <TableColumn>Margen de Ganancia</TableColumn>
                  <TableColumn>Ganancia por Unidad</TableColumn>
                </TableHeader>
                <TableBody emptyContent={""} className=" overflow-scroll">
                  {dataRentabilidadProducto.map((reporte: Rentabilidad) => (
                    <TableRow key={reporte.codigo}>
                      <TableCell>{reporte.codigo}</TableCell>
                      <TableCell>{reporte.nombre}</TableCell>
                      <TableCell>{formatNumber(reporte.costoCompra)}</TableCell>
                      <TableCell>{formatNumber(reporte.precio)}</TableCell>
                      <TableCell>{reporte.unidadesVendidas}</TableCell>
                      <TableCell>{formatNumber(reporte.ingresosVentas)}</TableCell>
                      <TableCell>{formatNumber(reporte.costosTotales)}</TableCell>
                      <TableCell>{formatNumber(reporte.margenGanancia)}</TableCell>
                      <TableCell>{formatNumber(reporte.gananciaUnidad)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>

              </Table>
              </div>
          </div>
          
        );
    }
    return(
        <div className="relative left-[220px] w-4/5 p-12 h-screen">
            <h1 className="text-4xl text-center font-semibold">Reportes</h1>
            <div className="grid grid-cols-2 gap-7 my-20">
                <div className="bg-white flex flex-col p-10 gap-6 rounded-xl">
                    <Button 
                    className="bg-white text-lg font-semibold hover:bg-slate-200" 
                    onClick={() => setMostrarReporteVentas(true)}>
                        Reporte de Ventas por Período de Tiempo
                    </Button>
                    <Button 
                    className="bg-white text-lg font-semibold hover:bg-slate-200" 
                    onClick={() => setMostrarReporteRentabilidad(true)}>
                        Reporte de Rentabilidad del Producto
                    </Button>
                </div>
            </div>
            {mostrarReporteVentas && ventas()}
            {mostrarReporteRentabilidad && rentabilidad()}
        </div>
)}