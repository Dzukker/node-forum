const express = require('express')
const axios=require('axios')
const route = express.Router()

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

route.get('/test', (req,res)=>{

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