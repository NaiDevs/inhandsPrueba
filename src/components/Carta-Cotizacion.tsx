/* eslint-disable @next/next/no-async-client-component */
"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from "next/navigation";
import '@/components/carta.css';

export default function CartaCotizacion() {

    interface product {
        producto: string;
        cantidad: number;
        precio: number;
    }

    const [dataperfil, setPerfil] = useState({
        nombre: "",
        rtn: "",
        telefono: "",
        correo: "",
        pagina: "",
        direccion: "",
    });

    const [dataSale, setSales] = useState([]);
    const [dataMore, setMore] = useState({
        cai: '',
        FacturacionInicial: '',
        FacturacionFinal: '',
        fechaLimiteEmision: '',
        cliente: '',
        rtnCliente: '',
        fecha: '',
        metodopago: '',
        subtotal: 0,
        descuento: 0,
        gravado15: 0,
        gravado18: 0,
        impuesto15: 0,
        impuesto18: 0,
        total: 0,
        efectivo: 0,
        cambio: 0,
    });
    const [dataLoaded, setDataLoaded] = useState(false);
    const params = useParams();

    useEffect(() => {
        async function fetchData() {
            try {
                const resPerfil = await axios.get("http://localhost:3000/api/perfil");
                if (resPerfil.data.length > 0) {
                    const data = resPerfil.data[0];
                    setPerfil({
                        nombre: data.nombre,
                        rtn: data.rtn,
                        telefono: data.telefono,
                        correo: data.correo,
                        pagina: data.pagina,
                        direccion: data.direccion,
                    });
                } else {
                    console.error("La respuesta de la API de perfil está vacía");
                }
                
                if (params.id) {
                    const resVentas = await axios.get("/api/cotizaciones/" + params.id);
                    if (resVentas.data.length > 0) {
                        setSales(resVentas.data);
                        setMore(resVentas.data[0]);
                        setDataLoaded(true);
                    }
                }
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        }

        fetchData();

    }, [params.id]);

    useEffect(() => {
        // Si los datos están cargados completamente, realizar la impresión
        if (dataLoaded) {
            window.print();
        }
    }, [dataLoaded]);

    const formatNumber = (number:any) => {
        return Number(number).toFixed(2);
    };

    const formatDate = (dateString:any) => {
        const date = new Date(dateString);
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    };

    const formatDateAndTime = (dateString:any) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hour = date.getHours();
        const minute = date.getMinutes();
    
        const formattedDay = day < 10 ? '0' + day : day;
        const formattedMonth = month < 10 ? '0' + month : month;
        const formattedHour = hour < 10 ? '0' + hour : hour;
        const formattedMinute = minute < 10 ? '0' + minute : minute;
    
        return `${formattedDay}-${formattedMonth}-${year} ${formattedHour}:${formattedMinute}`;
    };

    return (
        <section>
            <section className='header'>
                <p>{dataperfil.nombre}</p>
                <p>{dataperfil.direccion}</p>
                <p>{dataperfil.telefono}</p>
                <p>{dataperfil.correo}</p>
                <p>{dataperfil.pagina}</p>
            </section>
            <hr />
            <section className='informacion-factura'>
                <p>Cliente: {dataMore.cliente}</p>
                <p>RTN: {dataMore.rtnCliente}</p>
                <p>No Compra Exenta:</p>
                <p>No Constancia Registro Exonerado:</p>
                <p>No Registro SAG:</p>
                <hr />
                <p className='text-center'>Fecha y Hora: {formatDateAndTime(dataMore.fecha)}</p>
                <hr />
            </section>
            <section>
                <table>
                    <thead>
                        <tr>
                            <td>Descripción</td>
                            <td>Precio</td>
                            <td>Cantidad</td>
                            <td>Total</td>
                        </tr>
                    </thead>
                    <tbody>
                        {dataSale.map((producto:product, index) => (
                            <tr key={index}>
                                <td>{producto.producto}</td>
                                <td>L. {formatNumber(producto.precio)}</td>
                                <td>{producto.cantidad}</td>
                                <td>L. {formatNumber(producto.precio*producto.cantidad)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3} className='text-right'>Subtotal:</td>
                            <td className='text-left'>L. {formatNumber(dataMore.subtotal)}</td>
                            </tr>
                            <tr>
                            <td colSpan={3} className='text-right'>Descuento:</td> 
                            <td className='text-left'>L. {formatNumber(dataMore.descuento)}</td>
                            </tr>
                            <tr>
                            <td colSpan={3} className='text-right'>Otorgados</td> 
                            <td className='text-left'></td>
                            </tr>
                            <tr>
                            <td colSpan={3} className='text-right'>Exento:</td> 
                            <td className='text-left'>L. 0.00</td>
                            </tr>
                            <tr>
                            <td colSpan={3} className='text-right'>Exonerados:</td> 
                            <td className='text-left'>L. 0.00</td>
                            </tr>
                            <tr>
                            <td colSpan={3} className='text-right'>Imp. Gravado 15%:</td>
                            <td className='text-left'>L. {formatNumber(dataMore.gravado15)}</td>
                            </tr>
                            <tr>
                            <td colSpan={3} className='text-right'>Imp. Gravado 18%:</td> 
                            <td className='text-left'>L. {formatNumber(dataMore.gravado18)}</td>
                            </tr>
                            <tr>
                            <td colSpan={3} className='text-right'>ISV 15%:</td>
                            <td className='text-left'>L. {formatNumber(dataMore.impuesto15)}</td>
                            </tr>
                            <tr>
                            <td colSpan={3} className='text-right'>ISV 18%:</td> 
                            <td className='text-left'>L. {formatNumber(dataMore.impuesto18)}</td>
                            </tr>
                            <tr>
                            <td colSpan={3} className='text-right'>Total a Pagar:</td> 
                            <td className='text-left'>L. {formatNumber(dataMore.total)}</td>
                            </tr>
                        </tfoot>
                </table>
            </section>
        </section>
    );
}
