import app from "./app";
import {connectDb} from "../src/config/dbconfig";


const PORT =8000;
const DB_URL = "mongodb://localhost:27017/Project";

// * connect database
connectDb(DB_URL);


app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`)
});


