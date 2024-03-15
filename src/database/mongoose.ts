/*import mongoose, { Connection } from 'mongoose';

const connectToDatabase = async (): Promise<Connection> => {
    try {
        const connection = await mongoose.connect('mongodb://0.0.0.0:27017/Demouser');
        console.log('Connection Successful');
        return connection.connection;
    } catch (e) {
        console.log('Not connected');
        throw e;
    }
};

export default connectToDatabase;*/

import mongoose from 'mongoose';
mongoose.connect("mongodb+srv://alifiyasafdari2152:avu5Bc7BCpWGSrGa@tsdemocluster1.nfzwzi5.mongodb.net/tsDemo")

.then(()=>{

    console.log("Connection Successful");

}).catch((e)=>{

    console.log("Not connected");

})
export default mongoose;







/*import mongoose from 'mongoose';
//import config from '../config';

const mongoose = require("mongoose");

mongoose.connect("mongodb://0.0.0.0:27017/Demouser")

.then(()=>{

    console.log("Connection Successful");

}).catch((e)=>{

    console.log("Not connected");

})

export default mongoose;*/
