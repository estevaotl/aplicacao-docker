var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var dotenv = require('dotenv');

dotenv.config();

var app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var Message = mongoose.model('Message',{
    name : String,
    message : String
});

app.get('/messages', async (req, res) => {
    // cabeçalho para evitar problema de cors
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    const allUsers = await Message.find();

    res.send(allUsers);
});

app.post('/messages', async (req, res) => {
    // cabeçalho para evitar problema de cors
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var message = new Message({
        "name" : req.body.name,
        "message" : req.body.message

    });

    await message.save();
    res.send();
});

io.on('connection', () =>{
    console.log('a user is connected');
}) 

mongoose.connect(process.env.MONGODB_URL , {
    // opções para nao dar problemas com versões antigas do node
    useNewUrlParser : true,
    useUnifiedTopology : true
});

const db = mongoose.connection;
db.on("error", (error) => {
    console.error(error);
});

db.once("open", () => {
    console.log("connected to the database")
});

var server = app.listen(3000, () => {
    console.log('server is running on port', server.address().port);
});