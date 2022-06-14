const app = require("./app");
const dotenv= require("dotenv");
const connectdatabase = require("./config/database")
//handling uncaught exception
process.on("uncaughtException",(err)=>{

console.log(`error : ${err.message}`);
console.log(`shutting down the server due to uncaught exception `);
process.exit(1);
})

//config
dotenv.config({path:"./backend/config/config.env"});

//connection of database
connectdatabase()
const server = app.listen(process.env.PORT,()=>{  
    console.log(`server is working on http://localhost:${process.env.PORT}`) 
    });
    //console.log(outube);
//unhandled promice rejection

process.on("unhandledRejection",(err)=>{
  
    console.log(`error:${err.message}`)
    console.log(`shutting down the server due to unhandled promise rejection `);
    server.close(()=>{

        process.exit(1)
    })
})



