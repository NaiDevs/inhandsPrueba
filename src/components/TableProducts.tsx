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
    const { data } = await axios.get("http://localhost:3000/api/productos");
    return data;
  } catch (error) {
    console.error("Error loading products:", error);
    return [];
  }
}

export default function TableForm() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState({
    codigo: '',
    nombre: '',
    existencias: 0,
    marca: '',
    categoria: '',
    proveedor: '',
    costoCompra: 0,
    precio: 0,
    descripcion: '',
  });
  const fetchProducts = async () => {
    const productsData = await loadProducts();
    setProducts(productsData);
    setIsLoading(false);
  };

  interface product {
    codigo: string;
    nombre: string;
    existencias: number;
    marca: string;
    categoria: string;
    proveedor: string;
    costo: number;
    precio: number;
    descripcion: string;
  }

  const handleEyeClick = async (codigo:any) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/productos/${codigo}`);
      setSelectedProduct(response.data); // Almacena los detalles del producto en el estado
      onOpen(); // Abre el modal // Aquí puedes manejar la respuesta de la API como desees
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleSearch = (event:any) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter((product:product) =>
    product.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.precio.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.existencias.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para manejar la eliminación de un producto
  const handleDeleteProduct = async (codigo:any) => {
    try {
      if (confirm('¿Estás seguro de eliminar este producto?')) {
        await axios.delete(`/api/productos/${codigo}`);
        // Actualizar la lista de productos eliminando el producto
        setProducts(prevProducts => prevProducts.filter((product:any) => product.codigo !== codigo));
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
          <Link href="/inventario/nuevo-producto">
            <Button className="bg-[#1d1b31] text-white" endContent={"+"}>Agregar Producto</Button>
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
        aria-label="Tabla de productos"
        topContent={topContent()}
        topContentPlacement="outside"
        className=" max-h-[500px] my-[18px]"
      >
        <TableHeader>
          <TableColumn>Código</TableColumn>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Marca</TableColumn>
          <TableColumn>Categoría</TableColumn>
          <TableColumn>Precio</TableColumn>
          <TableColumn>Existencias</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"."} isLoading={isLoading} loadingContent={<Spinner label="Cargando Productos..." />} className=" overflow-scroll">
          {filteredProducts.map((product:product) => (
            <TableRow key={product.codigo}>
              <TableCell>{product.codigo}</TableCell>
              <TableCell>{product.nombre}</TableCell>
              <TableCell>{product.marca}</TableCell>
              <TableCell>{product.categoria}</TableCell>
              <TableCell>{product.precio}</TableCell>
              <TableCell>{product.existencias}</TableCell>
              <TableCell className="flex">
                <Tooltip content="Ver Producto">
                  <Link href="#" onClick={() => handleEyeClick(product.codigo)} className="bg-transparent"><Eye /></Link>
                </Tooltip>
                <Tooltip content="Editar Producto">
                 <Link href={`/inventario/editar-producto/${product.codigo}`}><Pen/></Link>
                </Tooltip>
                <Tooltip content="Eliminar Producto">
                <Link href="#" onClick={() => handleDeleteProduct(product.codigo)}><Trash/></Link>

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
          {selectedProduct && (
            <React.Fragment>
              <ModalHeader className="flex flex-col gap-1">{selectedProduct.nombre}</ModalHeader>
              <ModalBody>
                <p>Código del Producto: {selectedProduct.codigo}</p>
                <p>Marca: {selectedProduct.marca}</p>
                <p>Categoria: {selectedProduct.categoria}</p>
                <p>Proveedor: {selectedProduct.proveedor}</p>
                <p>Costo: {selectedProduct.costoCompra}</p>
                <p>Precio: {selectedProduct.precio}</p>
                <p>Existencias: {selectedProduct.existencias}</p>
                <p>Descripción: {selectedProduct.descripcion}</p>
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
