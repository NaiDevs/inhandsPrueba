/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-async-client-component */
"use client"
import { Input, Button, Textarea } from "@nextui-org/react"
import axios from 'axios'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from "next/navigation"; 
import { Toaster, toast } from 'sonner'

  export default function ProviderForm() {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [provider, setProvider] = useState({
        proveedor: "",
        contacto: "",
        telefono: "",
        correo: "",
        direccion: "",
      });
    
    // Define el hook useRouter para acceder al objeto router
    const router = useRouter();
    const params = useParams();
  
    const handleChange = (e:any) => {
        setProvider({
          ...provider,
          [e.target.name]: e.target.value,
        });
      };

      useEffect(() => {
        if (params.id) {
          axios.get("/api/proveedores/" + params.id).then((res) => {
            setProvider({
              proveedor: res.data.proveedor,
              contacto: res.data.contacto,
              telefono: res.data.telefono,
              correo: res.data.correo,
              direccion: res.data.direccion,
            });
          });
        }
      }, []);

      const handleSubmit = async (e:any) => {
        e.preventDefault();
        
        try {

          const formData = new FormData();
          formData.append("proveedor", provider.proveedor);
          formData.append("contacto", provider.contacto);
          formData.append("correo", provider.correo);
          formData.append("telefono", provider.telefono);
          formData.append("direccion", provider.direccion);
      
      
          if (!params.id) {
            const res = await axios.post("/api/proveedores", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            toast.success('Proveedor Creado Correctamente')
          } else {
            const res = await axios.put("/api/proveedores/" + params.id, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              }
            });
            toast.success('Proveedor Actualizado Correctamente')
          }
        }
        catch {
          toast.error('Error al Crear el Proveedor')
          router.refresh();
        }
      };
    
    
    return(
        <div className="relative left-[220px] w-4/5 p-12 h-screen">
          <Toaster richColors  />
            <p className="text-4xl text-center font-semibold">{params.id ? "Actualizar Información del Proveedor" : "Registrar Nuevo Proveedor"}</p>
            <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-10 mt-6">
                <div>
                    <label htmlFor="">Nombre del Proveedor</label>
                    <Input name="proveedor" value={provider.proveedor} size="sm" type="text" placeholder="Ingrese el nombre del proveedor" onChange={handleChange} isRequired />
                </div>
                <div>
                <label htmlFor="">Nombre del Contacto</label>
                    <Input name="contacto" value={provider.contacto} type="text" size="sm" placeholder="Ingrese el nombre del contacto" onChange={handleChange} isRequired/>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-10 mt-6">
              <div>
                <label htmlFor="">Telefono del Proveedor</label>
                    <Input name="telefono" value={provider.telefono} type="text" size="sm" placeholder="Ingrese el telefono del proveedor" onChange={handleChange} isRequired/>
                </div>
                <div>
                    <label htmlFor="">Correo Electrónico (Opcional)</label>
                    <Input name="correo" value={provider.correo} type="text" size="sm" placeholder="Ingrese el correo electrónico" onChange={handleChange}/>
                </div>
            </div>
            <div className="grid gap-10 mt-6">
                <div>
                    <label htmlFor="">Dirección del Proveedor (Opcional):</label>
                    <Textarea name="direccion" onChange={handleChange}
                    placeholder="Escribe aqui la descripción del providero"
                    maxRows={2}
                    value={provider.direccion}
                    />
                </div>
            </div>
            <div className="pt-14 flex justify-center pb-5"><Button type="submit" size="md" className="bg-[#1d1b31] text-white">{params.id ? "Actualizar Proveedor" : "Crear Proveedor"}</Button></div>
            </form>
        </div>
)}