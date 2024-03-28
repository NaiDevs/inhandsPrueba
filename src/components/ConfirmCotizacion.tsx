"use client"
import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Button, Input, Select, SelectItem, Radio, RadioGroup } from "@nextui-org/react";
import Search from './icons/Search';
import Trash from './icons/Trash';
import { Toaster, toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';


async function loadData(url:string) {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error("Error loading data:", error);
    return [];
  }
}

export default function ConfirmCotizacionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [clienteSeleccionado, setClienteSeleccionado] = useState({});
  const [nombreCliente, setNombreCliente] = useState('');
  const [cotizacion, setCotizacion] = useState({
    id:0,
    cliente:"",
    rtnCliente:"",
    tasaDescuento:0,
  });
  const [rtnCliente, setRtnCliente] = useState('');
  const [products, setProducts] = useState([]);
  const selectedDiscountRef = useRef<HTMLSelectElement>(null);
  const [factura, setFactura] = useState({numeroFactura:""});
  const [facturacion, setFacturacion] = useState({cai:"", fechaLimite: "", papel: "", FacturacionInicial: "", FacturacionFinal: "" });
  const [taxs, setTaxs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [change, setChange] = useState(0);
  const [cash, setCash] = useState(0); 
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Efectivo");
  const [idVentaNumero, setIdVentaNumero] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState('');

  const handleDiscountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const discountRate = parseFloat(event.target.value);
    setSelectedDiscount(discountRate);
  };
  
  
  const handlePaymentMethodChange = (value: string) => {
    setSelectedPaymentMethod(value);
  };
  
  const handleSearch = (event:any) => {
    setSearchTerm(event.target.value);
  };
  const handleCashChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cashAmount = parseFloat(event.target.value); 
    setCash(cashAmount);
    const changeAmount = cashAmount - parseFloat(total); 
    setChange((changeAmount));
  };
  interface Product {
    codigo: string;
    codigoProducto: string;
    nombre: string;
    producto: string;
    marca: string;
    categoria: string;
    precio: number;
    existencias: number;
    cantidad: number;
    importe: number;
    impuesto: number;
  }
  interface Customer {
    dni: string;
    nombre: string;
    rtn: string;
  }
  interface tax {
    nombre: string;
    tasa: number;
  }
  interface factura {
    factura: string;
  }
  interface facturacion {
    cai: string;
    fechaLimite: string;
    papel: string;
    facturacionInicial: string;
    facturacionFinal: string;
  }
  const filteredProducts = products.filter((product : Product) =>
    product.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.precio.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.existencias.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );
  const topContent = () => {
    return (
      <div className=" m-5 flex flex-col gap-4">
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
  React.useEffect(() => {
    const fetchDateTime = () => {
      const currentDate = new Date();
      setCurrentDateTime(currentDate.toString());
    };
    const fetchData = async () => {
      try {
        const cotizacionData = await loadData(`http://localhost:3000/api/cotizaciones/${id}`);
        setSalesProducts(cotizacionData);
        setCotizacion(cotizacionData[0]);
        setSelectedDiscount(cotizacionData[0].tasaDescuento);

        const productsData = await loadData("http://localhost:3000/api/productos");
        setProducts(productsData);

        const taxsData = await loadData("http://localhost:3000/api/descuentos");
        setTaxs(taxsData);

        const customerData = await loadData("http://localhost:3000/api/clientes");
        setCustomers(customerData);

        const facturaDataArray = await loadData("http://localhost:3000/api/facturas");
        const facturaData = facturaDataArray[0]; 
        setFactura({ numeroFactura: facturaData.numeroFactura });

        const facturacionData = await loadData("http://localhost:3000/api/facturacion");
        const fechaLimite = new Date(facturacionData[0].fechaLimite);
        const dia = fechaLimite.getDate();
        const mes = fechaLimite.getMonth() + 1; // Sumamos 1 ya que los meses comienzan desde 0
        const año = fechaLimite.getFullYear();

        // Formatear la fecha como "dd-mm-yyyy"
        const fechaLimiteFormateada = `${dia < 10 ? '0' + dia : dia}-${mes < 10 ? '0' + mes : mes}-${año}`;

        const idVenta = await loadData("http://localhost:3000/api/detalleVenta");
        const idVentaNumber = idVenta[0].id; 

        setIdVentaNumero(idVentaNumber);
        console.log();
        setFacturacion({
          cai: facturacionData[0].cai,
          fechaLimite: facturacionData[0].fechaLimite,
          papel: facturacionData[0].papel,
          FacturacionInicial: facturacionData[0].FacturacionInicial,
          FacturacionFinal: facturacionData[0].FacturacionFinal
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    fetchDateTime();
  }, [id]);

    const [salesProducts, setSalesProducts] = useState<Product[]>([]);
    const addProductToSales = (product:Product) => {
      const existingProduct = salesProducts.find((p : Product) => p.codigo === product.codigo) as any;
      if (existingProduct) {
        existingProduct.cantidad += 1;
        existingProduct.importe = existingProduct.cantidad * existingProduct.precio;
        setSalesProducts([...salesProducts]);
      } else {
        const newProduct = {
          ...product,
          cantidad: 1,
          importe: product.precio,
        };
        setSalesProducts([...salesProducts, newProduct]);
      }
    };
    const formatNumber = (number:any) => {
      return Number(number).toFixed(2);
    };
    const calculateTotals = () => {
      let subtotal = 0;
      let gravado15 = 0;
      let gravado18 = 0;
      let discountRate = 0;
      let discount = 0;
      let discount15 = 0;
      let discount18 = 0;
      const selectedDiscountValue = selectedDiscountRef.current?.value;

  
      salesProducts.forEach((product:Product) => {
          const productTotal = product.precio * product.cantidad;
          if (product.impuesto == 0.15) {
              gravado15 += productTotal;
          } else if (product.impuesto == 0.18) {
              gravado18 += productTotal;
          }
          subtotal += productTotal;
      });
  
      discountRate = selectedDiscountValue ? parseFloat(selectedDiscountValue) : 0;
  
      discount15 = gravado15 * (discountRate); // Calcula el descuento sobre el gravado al 15%
      discount18 = gravado18 * (discountRate); // Calcula el descuento sobre el gravado al 18%
      discount = (discount15 + discount18); // Calcula el descuento total sobre el subtotal gravado
  
      gravado15 -= discount15; // Descuenta el descuento aplicado al gravado al 15%
      gravado18 -= discount18; // Descuenta el descuento aplicado al gravado al 18%
  
      const tax15 = gravado15 * 0.15;
      const tax18 = gravado18 * 0.18;
  
      return {
          subtotal: formatNumber(subtotal),
          discount: formatNumber(discount),
          tax15: formatNumber(tax15),
          tax18: formatNumber(tax18),
          discountRate: discountRate,
          gravado15: formatNumber(gravado15),
          gravado18: formatNumber(gravado18),
          total: formatNumber(gravado15 + gravado18 + tax15 + tax18)
      };
  };
  const handleEyeClick = async () => {
    try {
      onOpen(); // Abre el modal // Aquí puedes manejar la respuesta de la API como desees
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };
    const { subtotal, discount, tax15, tax18, gravado15, gravado18, total, discountRate } = calculateTotals();
    const removeProductFromSales = (index : number) => {
      const updatedSalesProducts = [...salesProducts];
      updatedSalesProducts.splice(index, 1);
      setSalesProducts(updatedSalesProducts);
    };

    const handleCustomerChange = (event: any) => {
      const clienteDNI = event.target.value;
      const clienteSeleccionado = customers.find((customer:Customer) => customer.dni === clienteDNI) as any;
      setClienteSeleccionado(clienteSeleccionado);
      if (clienteSeleccionado) {
        setNombreCliente(clienteSeleccionado.nombre);
        setRtnCliente(clienteSeleccionado.rtn);
      } else {
        setNombreCliente('');
        setRtnCliente('');
      }
    };

    const handleSubmit = async () => {
      try {
        
        const currentDate = new Date();

        // Obtener componentes individuales de la fecha y hora
        const year = currentDate.getFullYear();
        const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Agregar ceros al mes si es necesario
        const day = ('0' + currentDate.getDate()).slice(-2); // Agregar ceros al día si es necesario
        const hours = ('0' + currentDate.getHours()).slice(-2); // Agregar ceros a las horas si es necesario
        const minutes = ('0' + currentDate.getMinutes()).slice(-2); // Agregar ceros a los minutos si es necesario
        const seconds = ('0' + currentDate.getSeconds()).slice(-2); // Agregar ceros a los segundos si es necesario

        // Construir la cadena en el formato deseado
        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        const numRows = salesProducts.length - 1;
        console.log('id '+idVentaNumero)
        const formData = new FormData();
        formData.append("numFactura", factura.numeroFactura);
        formData.append("cai", facturacion.cai);
        formData.append("nombreCliente", cotizacion.cliente);
        formData.append("rtnCliente", cotizacion.rtnCliente);
        formData.append("fechaActual", formattedDateTime);
        formData.append("papel", facturacion.papel);
        formData.append("metodoPago", selectedPaymentMethod);
        formData.append("cash", cash.toString());
        formData.append("change", change.toString());
        formData.append("tasa", selectedDiscount.toString());
        formData.append("subtotal", subtotal.toString());
        formData.append("descuento", discount.toString());
        formData.append("gravado15", gravado15.toString());
        formData.append("gravado18", gravado18.toString());
        formData.append("impuesto15", tax15.toString());
        formData.append("impuesto18", tax18.toString());
        formData.append("total", total.toString());
        formData.append("fechaLimite", facturacion.fechaLimite);
        formData.append("FacturacionInicial", facturacion.FacturacionInicial);
        formData.append("FacturacionFinal", facturacion.FacturacionFinal);

        const formData2 = new FormData();
        salesProducts.forEach((product, index) => {
          console.log(`Agregando producto ${index + 1}`);
          formData2.append("id",  `${idVentaNumero}`);
          formData2.append('rows', `${numRows}`);
          console.log(`Producto ${index + 1} - id: ${idVentaNumero}`);
          formData2.append(`productos[${index}][codigo]`, product.codigo);
          formData2.append(`productos[${index}][nombre]`, product.nombre);
          console.log(`Producto ${index + 1} - Nombre: ${product.nombre}`);
          formData2.append(`productos[${index}][precio]`, product.precio.toString());
          console.log(`Producto ${index + 1} - Precio: ${product.precio}`);
          formData2.append(`productos[${index}][cantidad]`, product.cantidad.toString());
          console.log(`Producto ${index + 1} - Cantidad: ${product.cantidad}`);
        });

        const res1 = await axios.post("/api/detalleVenta", formData2, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const res = await axios.post("/api/ventas", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        
        const res2 = await axios.put(`/api/facturas/${factura.numeroFactura}`, {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        });
        const res3 = await axios.put(`/api/cotizaciones/${cotizacion.id}`, {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        });

        const facturaLink = `/${facturacion.papel}/${factura.numeroFactura}`;
        const windowOptions = 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=600';
        window.open(facturaLink, '_blank', windowOptions);
        router.push('/cotizaciones');
      }
      catch (error) {
        toast.error('Error al Registrar la Venta' + error)
      }
    };
  
  return (
    <div className="relative left-[220px] w-[83.8%] h-screen flex">
        <Toaster />
        <div className='w-[50%] overflow-auto'>   
        {topContent()}
        <div className=' grid grid-cols-3 '>
          {filteredProducts.map((product:Product) => (
              <div key={product.codigo} onClick={() => addProductToSales(product)} className='mx-5 my-5 py-3 px-1 text-[14px] bg-white h-auto rounded-lg shadow-lg hover:shadow-2xl transition-all cursor-pointer'>
                <p>Código: {product.codigo}</p>
                <p>Nombre: {product.nombre}</p>
                <p className='font-bold'>Precio: L.{formatNumber(product.precio)}</p>
                <p className='font-bold'>Existencias: {product.existencias}</p>
              </div>
            ))}
        </div>
        </div>
        <div className='bg-white h-screen w-[50%]'>
          <div>
            <Input placeholder='Nombre del Cliente' label='Nombre del Cliente:'  value={cotizacion.cliente} readOnly/>
          </div>
          <div className='max-h-[535px] overflow-auto'>
          <table className='text-[14px] w-full table-fixed'>
            <thead className='sticky top-0 '>
              <tr className='w-full bg-slate-100'>
                <th className="px-4 py-2">Código</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Precio</th>
                <th className="px-4 py-2">Cantidad</th>
                <th className="px-4 py-2">Importe</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className='h-[259px]'>
              {salesProducts.map((product:Product, index) => (
                <tr key={index} className='border-b-small'>
                  <td className="px-4 py-2">{product.codigo}</td>
                  <td className="px-4 py-2">{product.nombre}</td>
                  <td className="px-4 py-2">{formatNumber(product.precio)}</td>
                  <td className="px-4 py-2">{product.cantidad}</td>
                  <td className="px-4 py-2">{formatNumber(product.cantidad * product.precio)}</td>
                  <td onClick={() => removeProductFromSales(index)} className="px-4 py-2 hover:text-red-600 transition-all">
                    <Trash />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className='bg-white sticky bottom-0'>
              <tr className='w-full bg-slate-100'>
                <td colSpan={4} className="px-4 py-2 text-right">Subtotal</td>
                <td colSpan={2} className="px-4 py-2">L.{subtotal}</td>
              </tr>
              <tr className='w-full bg-slate-100'>
                <td colSpan={4} className="px-4 py-2 text-right">Descuento (<select name="descuento" className='p-1 border' onChange={handleDiscountChange} value={cotizacion.tasaDescuento} disabled>
                        <option value={0}>
                            Ninguno
                        </option>
                        {taxs.map((tax:tax) => (
                        <option key={tax.tasa} value={tax.tasa}>
                            {tax.nombre}
                        </option>
                        ))}
                    </select>)</td>
                <td colSpan={2} className="px-4 py-2">L.{discount}</td>
              </tr>
              <tr className='w-full bg-slate-100'>
                <td colSpan={4} className="px-4 py-2 text-right">Imp. Gravado 15%:</td>
                <td colSpan={2} className="px-4 py-2">L.{gravado15}</td>
              </tr>
              <tr className='w-full bg-slate-100'>
                <td colSpan={4} className="px-4 py-2 text-right">Imp. Gravado 18%:</td>
                <td colSpan={2} className="px-4 py-2">L.{gravado18}</td>
              </tr>
              <tr className='w-full bg-slate-100'>
                <td colSpan={4} className="px-4 py-2 text-right">Impuesto ISV 15%:</td>
                <td colSpan={2} className="px-4 py-2">L.{tax15}</td>
              </tr>
              <tr className='w-full bg-slate-100'>
              <td colSpan={4} className="px-4 py-2 text-right">Impuesto ISV 18%:</td>
                <td colSpan={2} className="px-4 py-2">L.{tax18}</td>
              </tr>
            </tfoot>
          </table>
          </div>
          <Button className='w-full rounded-none bg-[#1d1b31] text-white text-xl h-[46px]'onClick={() => handleEyeClick()}>Facturar L.{total}</Button>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='xl' isDismissable={false}>
        <ModalContent>
        {(onClose) => (
            <>

            <React.Fragment>
              <ModalHeader className="flex flex-col gap-1">Hola Mundo</ModalHeader>
              <ModalBody >
                <div>
                  <p>Nombre del Cliente:</p>
                  <Input placeholder='Nombre del Cliente' value={cotizacion.cliente} readOnly/>
                </div>
                <div>
                  <p>RTN del Cliente:</p>
                  <Input placeholder='RTN del Cliente' value={cotizacion.rtnCliente} readOnly/>
                </div>
                <div>
                  <p>Metodo de Pago</p>
                  <RadioGroup
                    orientation="horizontal"
                    defaultValue={selectedPaymentMethod}
                    onValueChange={handlePaymentMethodChange}
                  >
                    <Radio value="Efectivo">Efectivo</Radio>
                    <Radio value="Tarjeta">Tarjeta</Radio>
                  </RadioGroup>
                </div>
                <div className='flex gap-5'>
                  <div>
                    <p>Total a Pagar:</p>
                    <Input value={total} readOnly/>
                  </div>
                  <div>
                    <p>Efectivo:</p>
                    <Input value={`${cash}`} onChange={handleCashChange}/>
                  </div>
                  <div>
                    <p>Cambio:</p>
                    <Input value={formatNumber(change)} readOnly/>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button className="bg-slate-300 text-black" onPress={onClose}>
                  Cancelar
                </Button>
                <Button className="bg-[#1d1b31] text-white" onPress={handleSubmit}>
                  Guardar Venta e Imprimir Recibo
                </Button>
              </ModalFooter>
            </React.Fragment>
          </>
          )}
        </ModalContent> 
      </Modal>
    </div>
  );
}
