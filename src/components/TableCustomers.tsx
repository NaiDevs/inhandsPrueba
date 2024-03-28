/* eslint-disable @next/next/no-async-client-component */
"use client"
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Tooltip } from "@nextui-org/react";
import axios from 'axios';
import React, { useState } from 'react';
import Link from "next/link";
import Search from "./icons/Search";
import Eye from "./icons/Eye";
import Pen from "./icons/Pen";
import Trash from "./icons/Trash";

async function loadProducts() {
  try {
    const { data } = await axios.get("http://localhost:3000/api/clientes");
    return data;
  } catch (error) {
    console.error("Error loading customers:", error);
    return [];
  }
}

export default function TableForm() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [selectedCustomer, setSelectedCustomer] = useState({
    nombre: '',
    dni: '',
    rtn: '',
    telefono: '',
    correo: '',
    direccion: ''
  });
  const fetchProducts = async () => {
    const customersData = await loadProducts();
    setCustomers(customersData);
    setIsLoading(false);
  };

  interface customer {
    dni: string;
    rtn: string;
    nombre: string;
    telefono: string;
    correo: string;
    direccion: string;
  }

  const handleEyeClick = async (dni: any) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/clientes/${dni}`);
      setSelectedCustomer(response.data); // Almacena los detalles del producto en el estado
      onOpen(); // Abre el modal // Aquí puedes manejar la respuesta de la API como desees
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleSearch = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearchTerm(event.target.value);
  };

  const filteredCustomers = customers.filter((customer:customer) =>
    customer.dni.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.telefono.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteCustomer = async (dni: any) => {
    try {
      if (confirm('¿Estás seguro de eliminar este cliente?')) {
        await axios.delete(`/api/clientes/${dni}`);
        // Actualizar la lista de productos eliminando el producto
        setCustomers(prevCustomer => prevCustomer.filter((customer:any) => customer.dni !== dni));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

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
          <Link href="/clientes/nuevo-cliente">
            <Button className="bg-[#1d1b31] text-white" endContent={"+"}>Agregar Cliente</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Cargar los productos al montar el componente
  React.useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="relative left-[220px] w-4/5 p-14">
      <Table
        isStriped
        aria-label="Tabla de clientes"
        topContent={topContent()}
        topContentPlacement="outside"
        className=" max-h-[500px] my-[18px]"
      >
        <TableHeader>
          <TableColumn>DNI</TableColumn>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Telefono</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"."} isLoading={isLoading} loadingContent={<Spinner label="Cargando Clientes..." />} className=" overflow-scroll">
          {filteredCustomers.map((customer:customer) => (
            <TableRow key={customer.dni}>
              <TableCell>{customer.dni}</TableCell>
              <TableCell>{customer.nombre}</TableCell>
              <TableCell>{customer.telefono}</TableCell>
              <TableCell className="flex">
                <Tooltip content="Ver Cliente">
                  <Link href="#" onClick={() => handleEyeClick(customer.dni)} className="bg-transparent"><Eye /></Link>
                </Tooltip>
                <Tooltip content="Editar Cliente">
                 <Link href={`/clientes/editar-cliente/${customer.dni}`}><Pen/></Link>
                </Tooltip>
                <Tooltip content="Eliminar Cliente">
                <Link href="#" onClick={() => handleDeleteCustomer(customer.dni)}><Trash/></Link>
                </Tooltip>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
        <ModalContent>
        {(onClose) => (
            <>
          {selectedCustomer && (
            <React.Fragment>
              <ModalHeader className="flex flex-col gap-1">{selectedCustomer.nombre}</ModalHeader>
              <ModalBody>
                <p>DNI: {selectedCustomer.dni}</p>
                <p>RTN: {selectedCustomer.rtn}</p>
                <p>Telefono: {selectedCustomer.telefono}</p>
                <p>Correo Electrónico: {selectedCustomer.correo}</p>
                <p>Dirección: {selectedCustomer.direccion}</p>
                {/* Otros campos del producto */}
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
