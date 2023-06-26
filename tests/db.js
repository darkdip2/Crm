const mongoose=require('mongoose');
const {MongoMemoryServer}=require('mongodb-memory-server');

let mongod;

module.exports.connect=async()=>
{
    if(!mongod)
    {
        mongod=await MongoMemoryServer.create();
        const uri=mongod.getUri();
        const mongooseOpts=
        {
            maxPoolSize:10,
            useUnifiedTopology:true
        }
        mongoose.connect(uri,mongooseOpts);
    }
}

module.exports.closeDatabase=async()=>
{
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if(mongod)await mongod.stop();
}

module.exports.clearDatabase=async()=>
{
    const collections=await mongoose.connection.collections;

    for(const c in collections)
    {
        const collection=collections[c];
        collection.deleteMany();
    }
}
