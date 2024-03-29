import mysql from "serverless-mysql"

export const connGlobal = mysql({
    config: {
        host     : "193.203.166.107",
        user     : "u966946366_inhands",
        password : "inyellowes01.A",
        database : "u966946366_inhands",
    } 
})