/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-async-client-component */
"use client"
import { Input, Button, Textarea } from "@nextui-org/react"
import axios from 'axios'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from "next/navigation"; 
import { Toaster, toast } from 'sonner'

  export default function customerForm() {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [customer, setCustomer] = useState({
        dni: "",
        rtn: "",
        nombre: "",
        telefono: "",
        correo: "",
        direccion: "",
      });
    
    // Define el hook useRouter para acceder al objeto router
    const router = useRouter();
    const params = useParams();
  
    const handleChange = (e:any) => {
        setCustomer({
          ...customer,
          [e.target.name]: e.target.value,
        });
      };

      useEffect(() => {
        if (params.dni) {
          axios.get("/api/clientes/" + params.dni).then((res) => {
            setCustomer({
              dni: res.data.dni,
              rtn: res.data.rtn,
              nombre: res.data.nombre,
              telefono: res.data.telefono,
              correo: res.data.correo,
              direccion: res.data.direccion,
            });
          });
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      const handleSubmit = async (e:any) => {
        e.preventDefault();
        
        try {

          const formData = new FormData();
          formData.append("dni", customer.dni);
          formData.append("nombre", customer.nombre);
          formData.append("rtn", customer.rtn);
          formData.append("correo", customer.correo);
          formData.append("telefono", customer.telefono);
          formData.append("direccion", customer.direccion);
      
      
          if (!params.dni) {
            const res = await axios.post("/api/clientes", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            toast.success('Cliente Creado Correctamente')
          } else {
            const res = await axios.put("/api/clientes/" + params.dni, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              }
            });
            toast.success('Cliente Actualizado Correctamente')
          }
        }
        catch {
          toast.error('Error al Crear el Cliente')
          router.refresh();
        }
      };
    
    
    return(
        <div className="relative left-[220px] w-4/5 p-12 h-screen">
          <Toaster richColors  />
            <p className="text-4xl text-center font-semibold">{params.dni ? "Actualizar Información del Cliente" : "Registrar Nuevo Cliente"}</p>
            <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-10 mt-6">
                <div>
                    <label htmlFor="">Número de Identidad</label>
                    <Input name="dni" value={customer.dni} size="sm" type="text" placeholder="Ingrese el número de identidad del Cliente" onChange={handleChange} isRequired />
                </div>
                <div>
                <label htmlFor="">RTN del Cliente (Opcional)</label>
                    <Input name="rtn" value={customer.rtn} type="text" size="sm" placeholder="Ingrese el rtn del cliente" onChange={handleChange}/>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-10 mt-6">
              <div>
                <label htmlFor="">Nombre del Cliente</label>
                    <Input name="nombre" value={customer.nombre} type="text" size="sm" placeholder="Ingrese el nombre del cliente" onChange={handleChange} isRequired/>
                </div>
                <div>
                    <label htmlFor="">Número de Telefono</label>
                    <Input name="telefono" value={customer.telefono} type="text" size="sm" placeholder="Ingrese el telefono del cliente" onChange={handleChange} isRequired/>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-10 mt-6">
                <div>
                <label htmlFor="">Correo Electronico (Opcional)</label>
                    <Input name="correo" value={customer.correo} type="email" size="sm" placeholder="Ingrese el correo electrónico del cliente" onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor="">Dirección del Cliente (Opcional):</label>
                    <Textarea name="direccion" onChange={handleChange}
                    placeholder="Escribe aqui la descripción del customero"
                    maxRows={2}
                    value={customer.direccion}
                    />
                </div>
            </div>
            <div className="pt-14 flex justify-center pb-5"><Button type="submit" size="md" className="bg-[#1d1b31] text-white">{params.dni ? "Actualizar Cliente" : "Crear Cliente"}</Button></div>
            </form>
        </div>
)}