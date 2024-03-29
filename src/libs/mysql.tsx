import mysql from "serverless-mysql"

// Verifica si el usuario de la base de datos coincide
if (process.env.DB_USER === 'u966946366_username') {
  // Muestra un mensaje de advertencia y detiene el proceso
  console.log("ADVERTENCIA: Usuario de la base de datos coincide, deteniendo el proceso.");
  process.exit(1); // Detiene el proceso actual con un código de salida 1 (indicando un error)
}


export const connDB = mysql({
    config: {
        host     : "193.203.166.107",
        user     : process.env.USER, // Acceder a la variable de entorno dentro de la función
        password : process.env.PASSWORD,
        database : process.env.USER, // Utilizando la misma variable de entorno para la base de datos (¡Asegúrate de que sea correcto!)
    }
})