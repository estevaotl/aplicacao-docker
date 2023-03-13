var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cors = require('cors');

var app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var Message = mongoose.model('Message',{
    name : String,
    message : String
});

var dbUrl = 'mongodb+srv://testeEzops:testeEzops123@cluster0.syf8gyu.mongodb.net/?retryWrites=true&w=majority'

app.get('/messages', async (req, res) => {
    // cabeçalho para evitar problema de cors
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    app.use(cors());

    const allUsers = await Message.find();

    res.send(allUsers);
});

app.post('/messages', async (req, res) => {
    // cabeçalho para evitar problema de cors
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    app.use(cors());

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

mongoose.connect(dbUrl , {
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