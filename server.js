const path =require('path')
const fs=require('fs')
const express =require('express')
const server=express()
const multer =require('multer')
const upload =multer()
const cors=require('cors')
const { v4: uuidv4 } = require('uuid');
const mongodb=require('./mongo/mongodb')
const mongoose = require('mongoose')

server.use(express.json())
server.use(express.urlencoded({extended:true}))
server.use(express.static(path.join(__dirname,'./public')))
server.use(cors())
server.set('view engine','ejs')
server.set('views',path.join(__dirname,'./views'))

server.get('/',(req,res)=>{
    res.render('index')
})

server.post('/posted',upload.single('file'),(req,res)=>{
    mongodb.mongodbConnection()
    const formBody=req.body
    const formFiles=req.file
    const pathParse=path.parse(req.file.originalname)
    const fileExt=pathParse.ext
    const fileBuffer=Buffer.from(req.file.buffer)
    const fileSchema =new mongodb.MyFileSchema ({
        writer:req.body.name,
        surname:req.body.surname,
        registerTime:new Date(),
        file:fileBuffer
    })
    fileSchema.save()
        .then(res=>{
            console.log('file saved db')
        })
        .catch(err=>{
            console.log(err)
        })
    // Stream Way
    const writeStrem=fs.createWriteStream(`./db/newFile_${uuidv4()}_${fileExt}`).write(fileBuffer)
    // Async Way
    // fs.writeFile(`./db/newWayFile${fileExt}`,fileBuffer,(err)=>{
    //     if (err) {
    //         console.log(err)
    //         return
    //     }
    // })
    res.redirect('/posted')
})

server.get('/posted',(req,res)=>{
    res.render('posted')
})

server.get('/multi-file',(req,res)=>{
    res.render('multifile')
})

server.post('/multiposted',upload.fields([{name:'video'},{name:'picture'},{name:'other'}]),(req,res)=>{
    const video=req.files.video
    const picture=req.files.picture
    const others=req.files.other
    if (video != undefined) {
        const videoBuffer=video[0].buffer
        const fileExt=path.parse(video[0].originalname).ext
        const writeStrem=fs.createWriteStream(`./data/video_${uuidv4()}_${fileExt}`)
        writeStrem.write(videoBuffer)
    }
    if (picture != undefined) {
        const pictureBuffer=picture[0].buffer
        const fileExt=path.parse(picture[0].originalname).ext 
        const writeStream=fs.createWriteStream(`./data/picture_${uuidv4()}_${fileExt}`)
        writeStream.write(pictureBuffer)
    }
    if (others != undefined) {
        const othersBuffer=others[0].buffer
        const fileExt=path.parse(others[0].originalname).ext 
        const writeStream=fs.createWriteStream(`./data/others_${uuidv4()}_${fileExt}`)
        writeStream.write(othersBuffer)
    }
    res.redirect('/multiposted')
})

server.get('/multiposted',(req,res)=>{
    res.render('multiposted')
})

server.listen(3000,()=>{
    console.log('///////////////////////////////////////////////////////////////////////////////////////////')
})