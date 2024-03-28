/* eslint-disable @next/next/no-async-client-component */
"use client"
import { Input, Button, Select, SelectItem, Textarea } from "@nextui-org/react"
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useRouter } from "next/navigation"; 
import { Toaster, toast } from 'sonner'

  export default function ProductForm() {
    // Define el estado para almacenar las categorías, marcas e impuestos
    const [categories, setCategories] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [brands, setBrands] = useState([]);
    const [taxs, setTaxs] = useState([]);

    const [product, setProduct] = useState({
        codigo: "",
        nombre: "",
        precio: "",
        costoCompra: "",
        existencias: "",
        categoria: "",
        proveedor: "",
        marca: "",
        impuesto: "",
        descripcion: "",
      });
    
    // Define el hook useRouter para acceder al objeto router
    const router = useRouter();
    const params = useParams();

    // Carga las categorías, marcas e impuestos cuando el componente se monta
    useEffect(() => {
      async function fetchData() {
        try {
          const categoriesResponse = await axios.get("https://inhands-mu.vercel.app/api/categorias");
          const brandsResponse = await axios.get("https://inhands-mu.vercel.app/api/marcas");
          const taxsResponse = await axios.get("https://inhands-mu.vercel.app/api/impuestos");
          const proveedoresResponse = await axios.get("https://inhands-mu.vercel.app/api/proveedores");
          
          setCategories(categoriesResponse.data);
          setBrands(brandsResponse.data);
          setTaxs(taxsResponse.data);
          setProveedores(proveedoresResponse.data);
        } catch (error) {
          console.error("Error loading data:", error);
        }
      }
  
      fetchData();
    }, []);

    const handleChange = (e:any) => {
        setProduct({
          ...product,
          [e.target.name]: e.target.value,
        });
      };

      useEffect(() => {
        if (params.codigo) {
          axios.get("/api/productos/" + params.codigo).then((res) => {
            setProduct({
              codigo: res.data.codigo,
              nombre: res.data.nombre,
              precio: res.data.precio,
              costoCompra: res.data.costoCompra,
              existencias: res.data.existencias,
              categoria: res.data.categoria,
              proveedor: res.data.proveedor,
              marca: res.data.marca,
              impuesto: res.data.impuesto,
              descripcion: res.data.descripcion,
            });
          });
        }
      }, [params.codigo]);

      const handleSubmit = async (e:any) => {
        e.preventDefault();
        
        try {

          const formData = new FormData();
          formData.append("codigo", product.codigo);
          formData.append("nombre", product.nombre);
          formData.append("precio", product.precio);
          formData.append("existencias", product.existencias);
          formData.append("categoria", product.categoria);
          formData.append("costoCompra", product.costoCompra);
          formData.append("proveedor", product.proveedor);
          formData.append("marca", product.marca);
          formData.append("impuesto", product.impuesto);
          formData.append("descripcion", product.descripcion);
      
      
          if (!params.codigo) {
            const res = await axios.post("/api/productos", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            toast.success('Producto Creado Correctamente')
          } else {
            const res = await axios.put("/api/productos/" + params.codigo, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              }
            });
            toast.success('Producto Actualizado Correctamente')
          }
        }
        catch {
          toast.error('Error al Crear el Producto')
          router.refresh();
        }
      };
    
    
    return(
        <div className="relative left-[220px] w-4/5 p-12">
          <Toaster richColors  />
            <p className="text-4xl text-center font-semibold">{params.codigo ? "Actualizar Información del Producto" : "Registrar Nuevo Producto"}</p>
            <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-10 mt-6">
                <div>
                    <label htmlFor="">Código del Producto</label>
                    <Input name="codigo" value={product.codigo} size="sm" type="text" placeholder="Ingrese el codigo pueden ser letras o números" onChange={handleChange} isRequired />
                </div>
                <div>
                <label htmlFor="">Nombre del Producto</label>
                    <Input name="nombre" value={product.nombre} type="text" size="sm" placeholder="Ingrese el nombre del producto" onChange={handleChange} isRequired/>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-10 mt-6">
                <div>
                    <label htmlFor="">Costo del Producto</label>
                    <Input name="costoCompra" value={product.costoCompra} type="number" size="sm" placeholder="Ingrese el costo del producto" onChange={handleChange} isRequired/>
                </div>
                <div>
                    <label htmlFor="">Precio del Producto</label>
                    <Input name="precio" value={product.precio} type="number" size="sm" placeholder="Ingrese el precio del producto" onChange={handleChange} isRequired/>
                </div>
                <div>
                <label htmlFor="">Existencias</label>
                    <Input name="existencias" value={product.existencias} type="number" size="sm" placeholder="Ingrese el número de existencias en el inventario" onChange={handleChange} isRequired/>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-10 mt-6">
              <div>
                    <label htmlFor="">Proveedor:</label>
                    <Select name="proveedor"
                    size="sm" onChange={handleChange}
                    label="Seleccione un Proveedor" 
                    selectedKeys={[product.proveedor]}
                    isRequired>
                        {proveedores.map((proveedor:any) => (
                        <SelectItem key={proveedor.proveedor} value={proveedor.proveedor}>
                            {proveedor.proveedor}
                        </SelectItem>
                        ))}
                    </Select>
                </div>
                <div>
                    <label htmlFor="">Categoria:</label>
                    <Select name="categoria"
                    size="sm" onChange={handleChange}
                    label="Seleccione una Categoria" 
                    selectedKeys={[product.categoria]}
                    isRequired>
                        {categories.map((categorie:any) => (
                        <SelectItem key={categorie.categoria} value={categorie.categoria}>
                            {categorie.categoria}
                        </SelectItem>
                        ))}
                    </Select>
                </div>
                <div>
                    <label htmlFor="">Marca:</label>
                    <Select name="marca"
                    size="sm" onChange={handleChange}
                    label="Seleccione una Marca" 
                    selectedKeys={[product.marca]}
                    isRequired>
                        {brands.map((brand:any) => (
                        <SelectItem key={brand.marca} value={brand.marca}>
                            {brand.marca}
                        </SelectItem>
                        ))}
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-10 mt-6">
                <div>
                    <label htmlFor="">Impuesto:</label>
                    <Select name="impuesto"
                    size="sm" onChange={handleChange}
                    label="Seleccione un Tipo de Impuesto" 
                    selectedKeys={[product.impuesto]}
                    isRequired>
                        {taxs.map((tax:any) => (
                        <SelectItem key={tax.tasa} value={tax.tasa}>
                            {tax.nombre}
                        </SelectItem>
                        ))}
                    </Select>
                </div>
                <div>
                    <label htmlFor="">Descripción del Producto (Opcional):</label>
                    <Textarea name="descripcion" onChange={handleChange}
                    placeholder="Escribe aqui la descripción del producto"
                    maxRows={2}
                    value={product.descripcion}
                    />
                </div>
                
            </div>
            <div className="pt-14 flex justify-center pb-5"><Button type="submit" size="md" className="bg-[#1d1b31] text-white">{params.codigo ? "Actualizar Producto" : "Crear Producto"}</Button></div>
            </form>
        </div>
)}