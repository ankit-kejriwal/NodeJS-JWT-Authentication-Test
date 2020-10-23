const express  = require('express');
const app = express();
const path = require('path');
const PORT = 3000;
const bodyParser  = require('body-parser');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
const secretKey = 'secret key';

const jwtMw =  exjwt({
    secret: secretKey,
    algorithms: ['HS256']
});


let users = [
    {
        id: 1,
        username: 'ankit',
        password: '12345'
    },
    {
        id: 2,
        username: 'kejriwal',
        password: '6798'
    }
]

app.use((req,res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
    next();
})

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));



app.post('/api/login',(req,res) => {
    const {username, password} = req.body;
    for (let user of users) {
        if(username == user.username  && password == user.password){
            let token = jwt.sign({id: user.id, username:user.username},secretKey,{expiresIn: '3m'});
            res.json({
                success: true,
                err: null,
                token
            });
            break;
        } else {
            res.status(401).json({
                success: false,
                token: null,
                err: 'Username or password is incorrect'
            });
        }
    }
})

app.get('/api/dashboard',jwtMw,(req,res) => {
    res.json({
        success: true,
        myContent: ' Only logged in people can see'
    })
})

app.get('/api/prices',jwtMw,(req,res) => {
    res.json({
        success: true,
        myContent: ' price is $3.99'
    })
})

app.get('/api/settings',jwtMw,(req,res) => {
    res.json({
        success: true,
        myContent: ' Change the settings of your profile'
    })
})

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.use(function(err,req, res, next){
    if(err.name === 'UnauthorizedError'){
        res.status(401).json({
            success: false,
            officialError : err,
            err: 'Username or password is incorrect 2'
        })
    } else {
        next(err)
    }
})

app.listen(PORT, ()=> {
    console.log(`Serving on port ${PORT}`);
})