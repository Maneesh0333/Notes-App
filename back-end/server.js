import "dotenv/config";
import connectDB from './src/Database/db.js';
import app from './src/app.js'


const PORT = process.env.PORT || 5000;

await connectDB();
app.listen(PORT,()=>{
  console.log(`Serveris running on PORT ${PORT}`);
})