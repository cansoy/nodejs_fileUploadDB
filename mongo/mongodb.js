const mongoose=require('mongoose')


const uri= "PATH"
const dbOptions= { useNewUrlParser: true, useUnifiedTopology: true,  }

const mongodbConnection=async()=>{
    try {
        const connection=await mongoose.connect(uri,dbOptions)
        console.log('mongo db connection is ok')
    } catch (error) {
        console.log(error)
    }

}

const myFileSchema=new mongoose.Schema({
    writer:String,
    surname:String,
    registerTime:Date,
    file:Buffer
})

const MyFileSchema=mongoose.model('MyFileSchema',myFileSchema)

module.exports={
    mongodbConnection,
    MyFileSchema
}





