"use client"
import { useState } from 'react';
import { Input, Button } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { EyeFilledIcon } from "./icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "./icons/EyeSlashFilledIcon";
import User from "./icons/User";
import axios from 'axios';

export default function LoginForm() {
  const [isVisible, setIsVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
  console.log("Valores de usuario y contraseña:", username, password);
  try {
    const response = await axios.post('/api/login', { username, password });
      router.push("/inventario")
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      // Manejar errores de inicio de sesión (por ejemplo, mostrar un mensaje de error al usuario)
    }
  };

  return (
    <div className="max-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full my-56">
        <User />
        <h1 className="text-center text-4xl font-bold mb-10">Iniciar Sesión</h1>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block mb-2 font-medium">Usuario:</label>
            <Input 
              id="username" 
              name='username'
              value={username}
              type="text" 
              className="w-full" 
              label="Ingrese su Usuario" 
              
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 font-medium">Contraseña:</label>
            <Input
              id="password"
              name='password'
              value={password}
              label="Ingrese su Contraseña"
              variant="bordered"
              endContent={
                <button type="button" onClick={toggleVisibility} className="focus:outline-none">
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-xl text-gray-500 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-xl text-gray-500 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              className="w-full"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button className="bg-[#1d1b31] text-white" type="submit">Iniciar Sesión</Button>
        </form>
        <p className="text-center text-xl mt-4">Olvidé mi Contraseña</p>
      </div>
    </div>
  );
}
