import "dotenv/config";

import app from "./app";
import {connectDb} from "../src/config/dbconfig";
import ENV_CONFIG from "./config/env.config";

const PORT = ENV_CONFIG.PORT;
const DB_URI = ENV_CONFIG.DB_URI;

// * connect database
connectDb(DB_URI);


app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`)
});


