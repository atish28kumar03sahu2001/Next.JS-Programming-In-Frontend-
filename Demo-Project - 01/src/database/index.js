import mongoose from 'mongoose';
export const connectToDB = async () => {
    const connectionUrl = "mongodb+srv://kumarsahuatish:TyzfjJK2Ky40AmPj@auth.oziov.mongodb.net/";
    mongoose
        .connect(connectionUrl)
        .then(()=>console.log("Connection Successful!"))
        .catch(e=>console.log(e))
};
