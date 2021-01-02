const express = require('express')
const hbs = require('hbs')
var MongoClient = require('mongodb').MongoClient;
var Regex = require("regex");

const app = express();
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials')
app.use(express.static(__dirname + '/public'))

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

var url = 'mongodb+srv://nhatnkq:Giadinhlaso1@cluster0.iw1oh.mongodb.net/test'

app.get('/',async (req,res) =>{
    let client = await MongoClient.connect(url);
    let dbo = client.db("ToyStoreDB");
    let result = await dbo.collection("Toys").find({}).toArray();
    res.render('index',{model:result})
})
app.get('/insert',(req,res)=>{
    res.render('newProduct');
})
app.post('/doInsert', async (req,res) =>{
    let nameInput = req.body.txtName;
    let priceInput = req.body.txtPrice;
    let ageInput = req.body.txtAge;
    let dateInput = new Date(req.body.txtDate);
    let datetoday = new  Date();
   
        let client = await MongoClient.connect(url);
        let dbo = client.db("ToyStoreDB");
        let newProduct =  {ToysName: nameInput, Price : priceInput, AgeRecommend : ageInput, Dateadd : dateInput};
        await dbo.collection("Toys").insertOne(newProduct)
        res.redirect('/');
    
})
app.get('/search', (req,res) =>{
    res.render('search');
})
app.post('/doSearch', async(req,res) =>{
    let nameInput = req.body.txtName;
    let client = await MongoClient.connect(url);
    let dbo = client.db("ToyStoreDB");
    let result = await dbo.collection("Toys").find({ToysName:{$regex: nameInput,$options:'si'}}).toArray();
    ///////  ^ : ki tu dau ||| aaa$ ki tu cuoi  ||| $option: k phan biet chu hoa chu thuong
    res.render('index',{model:result})

})

app.get('/delete',async (req,res) =>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};

    let client = await MongoClient.connect(url);
    let dbo = client.db("ToyStoreDB");
    await dbo.collection('Toys').deleteOne(condition)
    res.redirect('/');
})

app.get('/edit', async(req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;

    let client = await MongoClient.connect(url);
    let dbo = client.db("ToyStoreDB");
    let result = await dbo.collection("Toys").findOne({ "_id": ObjectID(id) });
    res.render('edit', { model: result });
})
app.post('/doEdit', async(req, res) => {
    let id = req.body.id;
    let name = req.body.txtName;
    let priceInput = req.body.txtPrice;
    let inputAge = req.body.txtAge;
    let inputDate = req.body.txtDate;

    let newValues = { $set: { ToysName: name, Price: priceInput, AgeRecommend: inputAge, Dateadd: inputDate } };
    var ObjectID = require('mongodb').ObjectID;
    let condition = { "_id": ObjectID(id) };

    let client = await MongoClient.connect(url);
    let dbo = client.db("ToyStoreDB");
    await dbo.collection("Toys").updateOne(condition, newValues);

    res.redirect('/');
})
var PORT = process.env.PORT ||3000
app.listen(PORT)
console.log("server is running")