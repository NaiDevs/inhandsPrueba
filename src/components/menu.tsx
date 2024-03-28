"use client"
import { useState } from 'react';
import BoxProduct from './icons/box'
import Dashboard from './icons/dashboard';
import Link from 'next/link';
import Customers from './icons/Customers';
import Providers from './icons/Providers';
import Cart from './icons/Cart';
import Note from './icons/Note';
import PostIt from './icons/PostIt';
import Settings from './icons/Settings';
import LogOut from './icons/Logout';
import Report from './icons/Report';
export default function Menu() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className='fixed left-0 top-0 h-full w-[220px] bg-[#11101D] py-2 px-4 z-50 transition-all'>
     <h1 className='text-3xl text-white font-extrabold m-2'>Inhands</h1>
     <ul className='my-14'>
      <li className='my-2 transition-all text-white rounded-xl hover:bg-white hover:text-slate-900 p-2'>
        <Link href="/inventario" className='flex'>
          <BoxProduct />
          <p className='text-xl font-semibold mx-2'>Inventario</p>
        </Link>
      </li>
      <li className='my-2 transition-all text-white rounded-xl hover:bg-white hover:text-slate-900 p-2'>
        <Link href="/clientes" className='flex'>
          <Customers />
          <p className='text-xl font-semibold mx-2'>Clientes</p>
        </Link>
      </li>
      <li className='my-2 transition-all text-white rounded-xl hover:bg-white hover:text-slate-900 p-2'>
        <Link href="/proveedores" className='flex'>
          <Providers />
          <p className='text-xl font-semibold mx-2'>Proveedores</p>
        </Link>
      </li>
      <li className='my-2 transition-all text-white rounded-xl hover:bg-white hover:text-slate-900 p-2'>
        <Link href="/ventas" className='flex'>
          <Cart />
          <p className='text-xl font-semibold mx-2'>Ventas</p>
        </Link>
      </li>
      <li className='my-2 transition-all text-white rounded-xl hover:bg-white hover:text-slate-900 p-2'>
        <Link href="/cotizaciones" className='flex'>
          <Note />
          <p className='text-xl font-semibold mx-2'>Cotizaciones</p>
        </Link>
      </li>
      <li className='my-2 transition-all text-white rounded-xl hover:bg-white hover:text-slate-900 p-2'>
        <Link href="/reportes" className='flex'>
          <Report />
          <p className='text-xl font-semibold mx-2'>Reportes</p>
        </Link>
      </li>
      <li className='my-2 transition-all text-white rounded-xl hover:bg-white hover:text-slate-900 p-2'>
        <Link href="/configuracion" className='flex'>
          <Settings />
          <p className='text-lg font-semibold mx-2'>Configuración</p>
        </Link>
      </li>
      <li className='my-2 transition-all text-white rounded-xl hover:bg-white hover:text-slate-900 p-2'>
        <Link href="/" className='flex'>
          <LogOut />
          <p className='text-lg font-semibold mx-2'>Cerrar Sesión</p>
        </Link>
      </li>
     </ul>
  </div>
)}