"use client"
"use client"
import { Input, Button, Textarea, Select, SelectItem, Table, TableBody, TableHeader, TableRow, TableColumn, TableCell, Spinner, Tooltip } from "@nextui-org/react"
import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from "next/navigation"; 
import { Toaster, toast } from 'sonner'
import CloseIcon from "./icons/CloseIcon";
import Link from "next/link";
import Trash from "./icons/Trash";
import Search from "./icons/Search";
export default function ConfigForm() {

    const [mostrarPerfil, setMostrarPerfil] = useState(false);
    const [mostrarFacturacion, setMostrarFacturacion] = useState(false);
    const [mostrarCategorias, setMostrarCategorias] = useState(false);
    const [mostrarMarcas, setMostrarMarcas] = useState(false);
    const [mostrarDescuentos, setMostrarDescuentos] = useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    const router = useRouter();
    const form = useRef(null);
    const [profile, setProfile] = useState({
        nombre: "",
        rtn: "",
        telefono: "",
        correo: "",
        direccion: "",
        pagina: ""
        
    });

    const [dataFacturacion, setDataFacturacion] = useState({
        cai: "",
        fechaLimite: "",
        FacturacionInicial: "",
        FacturacionFinal: "",
        papel: ""        
    });

    const [dataCategorias, setCategorias] = useState([]);
    const [dataMarcas, setMarcas] = useState([]);
    const [dataDescuentos, setDescuentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dataCategoriasInput, setCategoriasInput] = useState({id:0, categoria:""});
  const [dataMarcasInput, setMarcasInput] = useState({id:0, marca:""});
  const [dataDescuentosInput, setDescuentosInput] = useState({id:0, nombre:"", tasa:""});
    
    useEffect(() => {
        axios.get("/api/perfil").then((res) => {
        setProfile({
            nombre: res.data[0].nombre,
            rtn: res.data[0].rtn,
            telefono: res.data[0].telefono,
            correo: res.data[0].correo,
            direccion: res.data[0].direccion,
            pagina: res.data[0].pagina
            });
        });
        axios.get("/api/facturacion").then((res) => {
            const facturacionData = res.data[0];
            console.log(res.data);
            setDataFacturacion({
                cai: facturacionData.cai,
                fechaLimite: facturacionData.fechaLimite.slice(0, 10),
                FacturacionInicial: facturacionData.FacturacionInicial,
                FacturacionFinal: facturacionData.FacturacionFinal,
                papel: facturacionData.papel
            });
            console.log(facturacionData.cai);
            
        });
        axios.get("/api/categorias").then((res) => {
          const categoriasData = res.data;
          console.log(res.data);
          setCategorias(categoriasData);   
          setIsLoading(false);       
      });
      axios.get("/api/marcas").then((res) => {
        const marcasData = res.data;
        console.log(res.data);
        setMarcas(marcasData);   
        setIsLoading(false);       
    });
    axios.get("/api/descuentos").then((res) => {
      const descuentosData = res.data;
      console.log(res.data);
      setDescuentos(descuentosData);   
      setIsLoading(false);       
  });
    }, [])
    
    const handleSearch = (event: { target: { value: React.SetStateAction<string>; }; }) => {
      setSearchTerm(event.target.value);
    };
    const perfil = () => {
        
        
        const handleChange = (e:any) => {
            setProfile({
              ...profile,
              [e.target.name]: e.target.value,
            });
            console.log([e.target.name] + e.target.value)

          };
          
          const handleSubmit = async (e:any) => {
            e.preventDefault();
            
            try {
    
              const formData = new FormData();
              formData.append("nombre", profile.nombre);
              formData.append("rtn", profile.rtn);
              formData.append("correo", profile.correo);
              formData.append("telefono", profile.telefono);
              formData.append("pagina", profile.pagina);
              formData.append("direccion", profile.direccion);
          
          
              const res = await axios.put("/api/perfil" , {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  }
                });
                toast.success('Datos Ingresados Correctamente')
              }
            catch {
              toast.error('Error al Ingresar los Datos')
              router.refresh();
            }
          };
        return (
            <div className="absolute top-0 w-full p-12 h-screen bg-[#E4E9F7]">
          <Toaster richColors  />
          <div className="absolute top-0 right-0 m-3 text-xl transition-all hover:rotate-45 cursor-pointer" onClick={() => setMostrarPerfil(false)}>
           <CloseIcon />
          </div>
            <p className="text-4xl text-center font-semibold">Perfil de la Empresa</p>
            <form onSubmit={handleSubmit}>         
            <div className="grid grid-cols-2 gap-10 mt-6 ">
                <div>
                    <label htmlFor="">Nombre de la Empresa</label>
                    <Input name="proveedor" value={profile.nombre} size="sm" type="text" placeholder="Ingrese el nombre de la empresa" onChange={handleChange} isRequired />
                </div>
                <div>
                <label htmlFor="">RTN de la Empresa</label>
                    <Input name="contacto" value={profile.rtn} type="text" size="sm" placeholder="Ingrese el rtn de la empresa" onChange={handleChange} isRequired/>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-10 mt-6">
              <div>
                <label htmlFor="">Telefono de la Empresa</label>
                    <Input name="telefono" value={profile.telefono} type="text" size="sm" placeholder="Ingrese el telefono de la empresa" onChange={handleChange} isRequired/>
                </div>
                <div>
                    <label htmlFor="">Correo Electrónico (Opcional)</label>
                    <Input name="correo" value={profile.correo} type="text" size="sm" placeholder="Ingrese el correo electrónico" onChange={handleChange}/>
                </div>
            </div>
            <div className="grid gap-10 mt-6">
                <div>
                    <label htmlFor="">Dirección (Opcional):</label>
                    <Textarea name="direccion" onChange={handleChange}
                    placeholder="Escribe aqui la dirección"
                    maxRows={2}
                    value={profile.direccion}
                    />
                </div>
            </div>
            <div className="pt-14 flex justify-center pb-5"><Button type="submit" size="md" className="bg-[#1d1b31] text-white">Ingresar Datos</Button></div>
            </form>
        </div>
        );
    }

    const facturacion = () => {
        
        
        const handleChange = (e:any) => {
            setDataFacturacion({
              ...dataFacturacion,
              [e.target.name]: e.target.value,
            });
            console.log([e.target.name] + e.target.value)
          };
          
          const handleSubmit = async (e:any) => {
            e.preventDefault();
            
            try {
    
              const formData = new FormData();
              formData.append("cai", dataFacturacion.cai);
              formData.append("fechaLimite", dataFacturacion.fechaLimite);
              formData.append("FacturacionInicial", dataFacturacion.FacturacionInicial);
              formData.append("FacturacionFinal", dataFacturacion.FacturacionFinal);
              formData.append("papel", dataFacturacion.papel);
          
          
              const res = await axios.put("/api/facturacion" ,  formData, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  }
                });
                toast.success('Datos Guardados Correctamente')
              }
            catch {
              toast.error('Error al Guardar los Datos')
              router.refresh();
            }
          };
        return (
            <div className="absolute top-0 w-full p-12 h-screen bg-[#E4E9F7]">
          <Toaster richColors  />
          <div className="absolute top-0 right-0 m-3 text-xl transition-all hover:rotate-45 cursor-pointer" onClick={() => setMostrarFacturacion(false)}>
           <CloseIcon />
          </div>
            <p className="text-4xl text-center font-semibold">Datos de Facturación</p>
            <form onSubmit={handleSubmit}>         
            <div className="grid grid-cols-2 gap-10 mt-6 ">
                <div>
                    <label htmlFor="">Cai:</label>
                    <Input name="cai" value={dataFacturacion.cai} size="sm" type="text" placeholder="Ingrese el cai de su empresa" onChange={handleChange} isRequired />
                </div>
                <div>
                <label htmlFor="">Fecha Limite de Emision</label>
                <Input
                      name="fechaLimite"
                      value={dataFacturacion.fechaLimite}
                      type="date"
                      size="sm"
                      onChange={handleChange}
                      required
                  />

                </div>
            </div>
            <div className="grid grid-cols-2 gap-10 mt-6">
              <div>
                <label htmlFor="">Rango de Facturacion Inicial</label>
                    <Input name="FacturacionInicial" value={dataFacturacion.FacturacionInicial} type="text" size="sm" placeholder="Ingrese el rango inicial de facturación" onChange={handleChange} isRequired/>
                </div>
                <div>
                    <label htmlFor="">Rango de Facturacion Final</label>
                    <Input name="FacturacionFinal" value={dataFacturacion.FacturacionFinal} type="text" size="sm" placeholder="Ingrese el rango final de facturación" onChange={handleChange}/>
                </div>
            </div>
            <div className="grid gap-10 mt-6">
                <div>
                    <label htmlFor="">Papel:</label>
                    <Select name="papel"
                    size="sm" onChange={handleChange}
                    label="Seleccione un Tipo de Papel" 
                    selectedKeys={[dataFacturacion.papel]} isRequired>
                        <SelectItem key={'ticket'} value={"ticket"}>
                            ticket
                        </SelectItem>
                        <SelectItem key={'carta'} value={"carta"}>
                            carta
                        </SelectItem>
                    </Select>
                </div>
            </div>
            <div className="pt-14 flex justify-center pb-5"><Button type="submit" size="md" className="bg-[#1d1b31] text-white">Ingresar Datos</Button></div>
            </form>
        </div>
        );
    }

    const categorias = () => {

      const filteredCategorias = dataCategorias.filter((dataCategorias:any) =>
      dataCategorias.categoria.toLowerCase().includes(searchTerm.toLowerCase()) 
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
          </div>
        </div>
      );
    }
      const handleDeleteCategory = async (id:any) => {
        try {
          if (confirm('¿Estás seguro de eliminar esta categoría?')) {
            await axios.delete(`/api/categorias/${id}`); // Hacer la petición DELETE para eliminar la categoría
            // Actualizar la lista de categorías eliminando la categoría
            setCategorias(prevCategorias => prevCategorias.filter((categoria:any) => categoria.id !== id));
          }
        } catch (error) {
          console.error("Error deleting category:", error);
        }
      };
      const handleChange = (e:any) => {
          setCategoriasInput({
            ...dataCategoriasInput,
            [e.target.name]: e.target.value,
          });
          console.log([e.target.name] + e.target.value)

        };
        
        const handleSubmit = async (e:any) => {
          e.preventDefault();
          
          try {
            const formData = new FormData();
            formData.append("categoria", dataCategoriasInput.categoria);
        
            const res = await axios.post("/api/categorias" , formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                }
              });
            
            // Después de enviar el formulario, establece el valor del input en una cadena vacía
              
            toast.success('Categoria Ingresada Correctamente');
            if (form.current) {
              (form.current as any).reset(); // Utiliza 'any' para evitar problemas de tipo
            } else {
              console.warn("form.current is null. Unable to reset form.");
            }
            
              
            // Realizar una nueva solicitud GET para obtener la lista actualizada de categorías
            axios.get("/api/categorias").then((res) => {
              const categoriasData = res.data;
              setCategorias(categoriasData); // Actualizar el estado con las nuevas categorías
              setIsLoading(false); // Asegurarse de establecer isLoading en false si fuera necesario
            });
          } catch {
            toast.error('Error al Ingresar los Datos');
            router.refresh();
          }
        };
      return (
          <div className="absolute top-0 w-full p-12 h-screen bg-[#E4E9F7]">
            <Toaster richColors  />
            <div className="absolute top-0 right-0 m-3 text-xl transition-all hover:rotate-45 cursor-pointer" onClick={() => setMostrarCategorias(false)}>
            <CloseIcon />
            </div>
            <p className="text-4xl text-center font-semibold">Categorias</p>
            <div className="relative flex">
              <div className="ml-0 mr-10 w-[90%]">
                <form ref={form} onSubmit={handleSubmit}>         
                  <div className="grid gap-10 mt-6 ">
                    <div>
                      <label htmlFor="">Nombre de la Categoria:</label>
                      <Input name="categoria" id="input-categoria" size="sm" type="text" placeholder="Ingrese el nombre de la categoria" onChange={handleChange} required />
                    </div>
                    <div className="flex justify-center"><Button type="submit" size="md" className="bg-[#1d1b31] text-white">Ingresar Categoria</Button></div>
                  </div>
                </form>
              </div>
              <div className="w-full">
              <Table
                isStriped
                aria-label="Tabla de productos"
                topContent={topContent()}
                topContentPlacement="outside"
                className=" max-h-[500px] mt-[18px]"
              >
                <TableHeader>
                  <TableColumn>Nombre</TableColumn>
                  <TableColumn>Acciones</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"."} isLoading={isLoading} loadingContent={<Spinner label="Cargando Categorias..." />} className=" overflow-scroll">
                {filteredCategorias.map((categoria:any) => (
                  <TableRow key={categoria.id}>
                  <TableCell>{categoria.categoria}</TableCell>
                  <TableCell>
                    <Tooltip content="Eliminar Categoria">
                      <Link href="#" onClick={() => handleDeleteCategory(categoria.id)}><Trash/></Link>
                    </Tooltip>
                  </TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </div>
      </div>
      );
  }

  const marcas = () => {

    const filteredMarcas = dataMarcas.filter((dataMarcas:any) =>
    dataMarcas.marca.toLowerCase().includes(searchTerm.toLowerCase()) 
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
        </div>
      </div>
    );
  }
    const handleDeleteMarcas = async (id:any) => {
      try {
        if (confirm('¿Estás seguro de eliminar esta marca?')) {
          await axios.delete(`/api/marcas/${id}`); // Hacer la petición DELETE para eliminar la categoría
          // Actualizar la lista de categorías eliminando la categoría
          setMarcas(prevMarcas => prevMarcas.filter((marca:any) => marca.id !== id));
        }
      } catch (error) {
        console.error("Error deleting marcas:", error);
      }
    };
    const handleChange = (e:any) => {
        setMarcasInput({
          ...dataMarcasInput,
          [e.target.name]: e.target.value,
        });
        console.log([e.target.name] + e.target.value)

      };
      
      const handleSubmit = async (e:any) => {
        e.preventDefault();
        
        try {
          const formData = new FormData();
          formData.append("marca", dataMarcasInput.marca);
      
          const res = await axios.post("/api/marcas" , formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              }
            });
          
          // Después de enviar el formulario, establece el valor del input en una cadena vacía
            
          toast.success('Marca Ingresada Correctamente');
          if (form.current) {
            (form.current as any).reset(); // Utiliza 'any' para evitar problemas de tipo
          } else {
            console.warn("form.current is null. Unable to reset form.");
          }
            
          // Realizar una nueva solicitud GET para obtener la lista actualizada de categorías
          axios.get("/api/marcas").then((res) => {
            const marcasData = res.data;
            setMarcas(marcasData); // Actualizar el estado con las nuevas categorías
            setIsLoading(false); // Asegurarse de establecer isLoading en false si fuera necesario
          });
        } catch {
          toast.error('Error al Ingresar los Datos');
          router.refresh();
        }
      };
    return (
        <div className="absolute top-0 w-full p-12 h-screen bg-[#E4E9F7]">
          <Toaster richColors  />
          <div className="absolute top-0 right-0 m-3 text-xl transition-all hover:rotate-45 cursor-pointer" onClick={() => setMostrarMarcas(false)}>
          <CloseIcon />
          </div>
          <p className="text-4xl text-center font-semibold">Marcas</p>
          <div className="relative flex">
            <div className="ml-0 mr-10 w-[90%]">
              <form ref={form} onSubmit={handleSubmit}>         
                <div className="grid gap-10 mt-6 ">
                  <div>
                    <label htmlFor="">Nombre de la Marca:</label>
                    <Input name="marca" id="input-marca" size="sm" type="text" placeholder="Ingrese el nombre de la marca" onChange={handleChange} required />
                  </div>
                  <div className="flex justify-center"><Button type="submit" size="md" className="bg-[#1d1b31] text-white">Ingresar Marca</Button></div>
                </div>
              </form>
            </div>
            <div className="w-full">
            <Table
              isStriped
              aria-label="Tabla de productos"
              topContent={topContent()}
              topContentPlacement="outside"
              className=" max-h-[500px] mt-[18px]"
            >
              <TableHeader>
                <TableColumn>Nombre</TableColumn>
                <TableColumn>Acciones</TableColumn>
              </TableHeader>
              <TableBody emptyContent={"."} isLoading={isLoading} loadingContent={<Spinner label="Cargando Marcas..." />} className=" overflow-scroll">
              {filteredMarcas.map((marca:any) => (
                <TableRow key={marca.id}>
                <TableCell>{marca.marca}</TableCell>
                <TableCell>
                  <Tooltip content="Eliminar Marca">
                    <Link href="#" onClick={() => handleDeleteMarcas(marca.id)}><Trash/></Link>
                  </Tooltip>
                </TableCell>
                </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </div>
    </div>
    );
}
const descuentos = () => {

  const filteredDescuentos = dataDescuentos.filter((dataDescuentos:any) =>
  dataDescuentos.nombre.toLowerCase().includes(searchTerm.toLowerCase()) 
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
      </div>
    </div>
  );
}
  const handleDeleteDescuento = async (id:any) => {
    try {
      if (confirm('¿Estás seguro de eliminar este descuento?')) {
        await axios.delete(`/api/descuentos/${id}`); // Hacer la petición DELETE para eliminar la categoría
        // Actualizar la lista de categorías eliminando la categoría
        setDescuentos(prevDescuentos => prevDescuentos.filter((descuento:any) => descuento.id !== id));
      }
    } catch (error) {
      console.error("Error deleting descuentos:", error);
    }
  };
  const handleChange = (e:any) => {
      setDescuentosInput({
        ...dataDescuentosInput,
        [e.target.name]: e.target.value,
      });
      console.log([e.target.name] + e.target.value)

    };
    
    const handleSubmit = async (e:any) => {
      e.preventDefault();
      
      try {
        const formData = new FormData();
        formData.append("nombre", dataDescuentosInput.nombre);
        formData.append("tasa", dataDescuentosInput.tasa);
    
        const res = await axios.post("/api/descuentos" , formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            }
          });
        
        // Después de enviar el formulario, establece el valor del input en una cadena vacía
          
        toast.success('Descuento Ingresado Correctamente');
        if (form.current) {
          (form.current as any).reset(); // Utiliza 'any' para evitar problemas de tipo
        } else {
          console.warn("form.current is null. Unable to reset form.");
        }
          
        // Realizar una nueva solicitud GET para obtener la lista actualizada de categorías
        axios.get("/api/descuentos").then((res) => {
          const descuentosData = res.data;
          setDescuentos(descuentosData); // Actualizar el estado con las nuevas categorías
          setIsLoading(false); // Asegurarse de establecer isLoading en false si fuera necesario
        });
      } catch {
        toast.error('Error al Ingresar los Datos');
        router.refresh();
      }
    };
  return (
      <div className="absolute top-0 w-full p-12 h-screen bg-[#E4E9F7]">
        <Toaster richColors  />
        <div className="absolute top-0 right-0 m-3 text-xl transition-all hover:rotate-45 cursor-pointer" onClick={() => setMostrarDescuentos(false)}>
        <CloseIcon />
        </div>
        <p className="text-4xl text-center font-semibold">Descuentos</p>
        <div className="relative flex">
          <div className="ml-0 mr-10 w-[90%]">
            <form ref={form} onSubmit={handleSubmit}>         
              <div className="grid gap-10 mt-6 ">
                <div>
                  <label htmlFor="">Nombre del Descuento:</label>
                  <Input name="nombre" id="input-descuento" size="sm" type="text" placeholder="Ingrese el nombre del descuento" onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="">Tasa del Descuento:</label>
                  <Input name="tasa" id="input-tasa" size="sm" type="text" placeholder="Ingrese la tasa en decimales = 0.1" onChange={handleChange} required />
                </div>
                <div className="flex justify-center"><Button type="submit" size="md" className="bg-[#1d1b31] text-white">Ingresar Descuento</Button></div>
              </div>
            </form>
          </div>
          <div className="w-full">
          <Table
            isStriped
            aria-label="Tabla de descuentos"
            topContent={topContent()}
            topContentPlacement="outside"
            className=" max-h-[500px] mt-[18px]"
          >
            <TableHeader>
              <TableColumn>Nombre</TableColumn>
              <TableColumn>Tasa</TableColumn>
              <TableColumn>Acciones</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"."} isLoading={isLoading} loadingContent={<Spinner label="Cargando Descuentos..." />} className=" overflow-scroll">
            {filteredDescuentos.map((descuento:any) => (
              <TableRow key={descuento.id}>
              <TableCell>{descuento.nombre}</TableCell>
              <TableCell>{descuento.tasa}</TableCell>
              <TableCell>
                <Tooltip content="Eliminar Descuento">
                  <Link href="#" onClick={() => handleDeleteDescuento(descuento.id)}><Trash/></Link>
                </Tooltip>
              </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </div>
  </div>
  );
}
    return(
        <div className="relative left-[220px] w-4/5 p-12 h-screen">
            <h1 className="text-4xl text-center font-semibold">Configuración</h1>
            <div className="grid grid-cols-2 gap-7 my-20">
                <div className="bg-white flex flex-col p-10 gap-6 rounded-xl">
                    <p className="text-2xl text-center font-semibold">Empresa</p>
                    <Button 
                    className="bg-white text-xl font-semibold hover:bg-slate-200" 
                    onClick={() => setMostrarPerfil(true)}>
                        Perfil de Empresa
                    </Button>
                    <Button className="bg-white text-xl font-semibold hover:bg-slate-200" onClick={() => setMostrarFacturacion(true)}>Datos de Facturacion</Button>
                </div>
                <div className="bg-white flex flex-col p-10 gap-6 rounded-xl">
                    <p className="text-2xl text-center font-semibold">Otros Ajustes</p>
                    <Button className="bg-white text-xl font-semibold hover:bg-slate-200"  
                    onClick={() => setMostrarCategorias(true)}>Categorias</Button>
                    <Button className="bg-white text-xl font-semibold hover:bg-slate-200" onClick={() => setMostrarMarcas(true)}>Marcas</Button>
                    <Button className="bg-white text-xl font-semibold hover:bg-slate-200" onClick={() => setMostrarDescuentos(true)}>Descuentos</Button>
                </div>
            </div>
            {mostrarPerfil && perfil()}
            {mostrarFacturacion && facturacion()}
            {mostrarCategorias && categorias()}
            {mostrarMarcas && marcas()}
            {mostrarDescuentos && descuentos()}
            
        </div>
)}