const express = require('express')
const axios=require('axios')
const route = express.Router()

var sessionChecker = (req, res, next) => {    
    console.log(`Session Checker: ${req.session.id}`.green);
    console.log(req.session);
    if (req.session.profile) {
        console.log(`Found User Session`.green);
        next();
    } else {
        console.log(`No User Session Found`.red);
        res.redirect('/login');
    }
};

route.get('/', (req, res) =>{
    axios.get('http://localhost:8080/posts/all')
    .then((response)=>{
        res.render('index',{obj:response.data});
    })
    .catch( (err)=>{
        res.send(err);
    })

})

route.get('/register', (req, res) =>{
    res.render('register')
})

route.get('/login', (req, res) =>{
    res.render('login')
})

route.get('/test', sessionChecker, (req,res)=>{
    console.log(sessionChecker)
})

// route.get('/dodaj', (req, res) =>{
//     res.render('dodaj')
//  })

//  route.get('/edytuj/:id', (req, res) =>{
    
//     axios.get(`http://localhost:8080/one/${req.params.id}`)
//     .then((response)=>{
//         res.render('edytuj',{obj:response.data});
//     })
//     .catch( (err)=>{
//         res.send(err);
//     })
    
//  })
module.exports=route;