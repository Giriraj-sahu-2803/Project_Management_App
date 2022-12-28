const express= require('express');
const app = express();
const {graphqlHTTP}=require('express-graphql')
const cors= require('cors')
const Schema=require('./graphql/schema');
const {connectDB}=require('./models/db')

require('dotenv').config()


app.use(cors());
app.use('/graphql',graphqlHTTP({
    schema:Schema,
    graphiql:process.env.DEVELOPMENT==='development'
}))

app.listen(process.env.PORT|| 8080,()=>{
 console.log(`server connected to port :${process.env.PORT}`);
 connectDB();
});