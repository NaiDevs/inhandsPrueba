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

async function loadProviders() {
  try {
    const { data } = await axios.get("http://localhost:3000/api/proveedores");
    return data;
  } catch (error) {
    console.error("Error loading customers:", error);
    return [];
  }
}

export default function TableForm() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [selectedProvider, setSelectedProvider] = useState({
    proveedor: '',
    contacto: '',
    telefono: '',
    correo: '',
    direccion: '',
  });
  const fetchProviders = async () => {
    const providersData = await loadProviders();
    setProviders(providersData);
    setIsLoading(false);
  };

  const handleEyeClick = async (id:any) => {
    try {
      const response = await axios.get(`https://inhands-mu.vercel.app/api/proveedores/${id}`);
      setSelectedProvider(response.data); // Almacena los detalles del producto en el estado
      onOpen(); // Abre el modal // Aquí puedes manejar la respuesta de la API como desees
    } catch (error) {
      console.error("Error fetching provider details:", error);
    }
  };

  
  interface provider {
    id: number;
    proveedor: string;
    contacto: string;
    telefono: string;
    correo: string;
    direccion: string;
  }

  const handleSearch = (event:any) => {
    setSearchTerm(event.target.value);
  };

  const filteredProviders = providers.filter((provider:provider) =>
    provider.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.telefono.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProvider = async (id:any) => {
    try {
      if (confirm('¿Estás seguro de eliminar este proveedor?')) {
        await axios.delete(`/api/proveedores/${id}`);
        // Actualizar la lista de productos eliminando el producto
        setProviders(prevProvider => prevProvider.filter((provider:any) => provider.id !== id));
      }
    } catch (error) {
      console.error("Error deleting provider:", error);
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
          <Link href="/proveedores/nuevo-proveedor">
            <Button className="bg-[#1d1b31] text-white" endContent={"+"}>Agregar Proveedor</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Cargar los productos al montar el componente
  React.useEffect(() => {
    fetchProviders();
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
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Contacto</TableColumn>
          <TableColumn>Telefono</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"."} isLoading={isLoading} loadingContent={<Spinner label="Cargando Proveedores..." />} className=" overflow-scroll">
          {filteredProviders.map((provider:provider) => (
            <TableRow key={provider.id}>
              <TableCell>{provider.proveedor}</TableCell>
              <TableCell>{provider.contacto}</TableCell>
              <TableCell>{provider.telefono}</TableCell>
              <TableCell className="flex">
                <Tooltip content="Ver Proveedor">
                  <Link href="#" onClick={() => handleEyeClick(provider.id)} className="bg-transparent"><Eye /></Link>
                </Tooltip>
                <Tooltip content="Editar Proveedor">
                 <Link href={`/proveedores/editar-proveedor/${provider.id}`}><Pen/></Link>
                </Tooltip>
                <Tooltip content="Eliminar Proveedor">
                <Link href="#" onClick={() => handleDeleteProvider(provider.id)}><Trash/></Link>
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
          {selectedProvider && (
            <React.Fragment>
              <ModalHeader className="flex flex-col gap-1">{selectedProvider.proveedor}</ModalHeader>
              <ModalBody>
                <p>Contacto: {selectedProvider.contacto}</p>
                <p>Telefono: {selectedProvider.telefono}</p>
                <p>Correo Electrónico: {selectedProvider.correo}</p>
                <p>Dirección: {selectedProvider.direccion}</p>
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
