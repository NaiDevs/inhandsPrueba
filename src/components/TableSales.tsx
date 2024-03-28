/* eslint-disable @next/next/no-async-client-component */
"use client"
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Tooltip } from "@nextui-org/react";
import axios from 'axios';
import React, { useState } from 'react';
import Link from "next/link";
import Search from "./icons/Search";
import Eye from "./icons/Eye";
import Printer from "./icons/Printer";
import Trash from "./icons/Trash";

async function loadsales() {
  try {
    const { data } = await axios.get("https://inhands-mu.vercel.app/api/ventas");
    return data;
  } catch (error) {
    console.error("Error loading customers:", error);
    return [];
  }
}

export default function TableForm() {

  interface product {
    producto: string;
    cantidad: number;
    precio: number;
    numFactura: string;
    cliente: string;
    subtotal: number;
    gravado15: number,
    gravado18: number,
    impuesto18: number,
    impuesto15: number,
    total: number,
    descuento: number,
}

  const [isLoading, setIsLoading] = React.useState(true);
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [selectedSales, setSelectedSales] = useState<product | null>(null);


  const fetchsales = async () => {
    const salesData = await loadsales();
    setSales(salesData);
    setIsLoading(false);
  };

  interface sale {
    id: number;
    numFactura: string;
    cliente: string;
    productosVendidos: string;
    total: string;
    codigoProducto: string;
    producto: string;
    cantidad: number;
    precio: number;
    papel: string;
  }

  const handleEyeClick = async (id:number) => {
    try {
      const response = await axios.get(`https://inhands-mu.vercel.app/api/ventas/${id}`);
      setSelectedSales(response.data[0]); // Almacena los detalles del producto en el estado
      onOpen(); // Abre el modal // Aquí puedes manejar la respuesta de la API como desees
    } catch (error) {
      console.error("Error fetching provider details:", error);
    }
  };
  const handlePrint = async (numFactura:any, papel:any) => {
    const facturaLink = `/${papel}/${numFactura}`;
    const windowOptions = 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=600';
    window.open(facturaLink, '_blank', windowOptions);
  };

  const handleSearch = (event:any) => {
    setSearchTerm(event.target.value);
  };

  const formatNumber = (number:any) => {
    return Number(number).toFixed(2);
  };

  const filteredSales = sales.filter((sale:sale) =>
    sale.numFactura.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.productosVendidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.papel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.total.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topContent = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            placeholder="Buscar"
            startContent={<Search />}
            className="w-full sm:max-w-[44%]"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Link href="/ventas/nueva-venta">
            <Button className="bg-[#1d1b31] text-white" endContent={"+"}>Realizar una Venta</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Cargar los productos al montar el componente
  React.useEffect(() => {
    fetchsales();
  }, []);

  return (
    <div className="relative left-[220px] w-4/5 p-14 h-screen">
      <Table
        isStriped
        aria-label="Tabla de clientes"
        topContent={topContent()}
        topContentPlacement="outside"
        className=" max-h-[500px] my-[18px]"
      >
        <TableHeader>
          <TableColumn>Número de Factura</TableColumn>
          <TableColumn>Cliente</TableColumn>
          <TableColumn>Productos Vendidos</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"."} isLoading={isLoading} loadingContent={<Spinner label="Cargando Ordenes de Venta..." />} className=" overflow-scroll">
          {filteredSales.map((sale:sale) => (
            <TableRow key={sale.id}>
              <TableCell>{sale.numFactura}</TableCell>
              <TableCell>{sale.cliente}</TableCell>
              <TableCell>{sale.productosVendidos}</TableCell>
              <TableCell className="flex">
                <Tooltip content="Ver Información de la Venta">
                  <Link href="#" onClick={() => handleEyeClick(sale.id)} className="bg-transparent"><Eye /></Link>
                </Tooltip>
                <Tooltip content="Imprimir el Recibo">
                 <Link href="#" onClick={() => handlePrint(sale.numFactura, sale.papel)}><Printer/></Link>
                </Tooltip>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal size={"full"} isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
        <ModalContent>
        {(onClose) => (
            <>
          {selectedSales && (
            <React.Fragment>
              <ModalHeader className="flex flex-col gap-1">{selectedSales.numFactura}</ModalHeader>
              <ModalBody className=" overflow-scroll">
                  <p>Cliente: {selectedSales.cliente}</p>
                  <table>
                    <thead>
                      <tr className='w-full bg-slate-100'>
                        <th className="px-4 py-2">Producto</th>
                        <th className="px-4 py-2">Precio</th>
                        <th className="px-4 py-2">Cantidad</th>
                        <th className="px-4 py-2">Importe</th>
                      </tr>
                    </thead>
                    <tbody>
                        {selectedSales.producto.split(',').map((producto: string, index: number) => (
                            <tr key={index} className='border-b-small'>
                                <td className="px-4 py-2">{producto}</td>
                                <td className="px-4 py-2">L. {formatNumber(selectedSales.precio)}</td>
                                <td className="px-4 py-2 text-center">{selectedSales.cantidad}</td>
                                <td className="px-4 py-2">L.{formatNumber(selectedSales.cantidad * selectedSales.precio)}</td>
                            </tr>
                        ))}
                    </tbody>

                    <tfoot>
                    <tr className='w-full bg-slate-100'>
                      <td colSpan={3} className="px-4 py-2 text-right">Subtotal:</td>
                      <td colSpan={2} className="px-4 py-2">L. {formatNumber(selectedSales.subtotal)}</td>
                    </tr>
                    <tr className='w-full bg-slate-100'>
                      <td colSpan={3} className="px-4 py-2 text-right">Descuento:</td>
                      <td colSpan={2} className="px-4 py-2">L. {formatNumber(selectedSales.descuento)}</td>
                    </tr>
                    <tr className='w-full bg-slate-100'>
                      <td colSpan={3} className="px-4 py-2 text-right">Imp. Gravado 15%:</td>
                      <td colSpan={2} className="px-4 py-2">L. {formatNumber(selectedSales.gravado15)}</td>
                    </tr>
                    <tr className='w-full bg-slate-100'>
                      <td colSpan={3} className="px-4 py-2 text-right">Imp. Gravado 18%:</td>
                      <td colSpan={2} className="px-4 py-2">L. {formatNumber(selectedSales.gravado18)}</td>
                    </tr>
                    <tr className='w-full bg-slate-100'>
                      <td colSpan={3} className="px-4 py-2 text-right">Impuesto ISV 15%:</td>
                      <td colSpan={2} className="px-4 py-2">L. {formatNumber(selectedSales.impuesto15)}</td>
                    </tr>
                    <tr className='w-full bg-slate-100'>
                      <td colSpan={3} className="px-4 py-2 text-right">Impuesto ISV 18%:</td>
                      <td colSpan={2} className="px-4 py-2">L. {formatNumber(selectedSales.impuesto18)}</td>
                    </tr>
                    <tr className='w-full bg-slate-100'>
                      <td colSpan={3} className="px-4 py-2 text-right">Total:</td>
                      <td colSpan={2} className="px-4 py-2">L. {formatNumber(selectedSales.total)}</td>
                    </tr>
                    </tfoot>
                  </table>
                </ModalBody>
              <ModalFooter>
                <Button className="bg-[#1d1b31] text-white" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </React.Fragment>
          )}
          </>
          )}
        </ModalContent> 
      </Modal>
    </div>
  );
}
