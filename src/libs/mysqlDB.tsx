import mysql from "serverless-mysql"

export const connGlobal = mysql({
    config: {
        host     : "srv1242.hstgr.io",
        user     : "u966946366_inhands",
        password : "inyellowes01.A",
        database : "u966946366_inhands",
    } 
})