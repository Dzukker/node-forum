const express = require('express')
const axios=require('axios')
const route = express.Router()
const cookieParser = require('cookie-parser')
route.use(cookieParser())

// GENERAL
route.get('/', (req, res) =>{
    axios.get('http://localhost:8080/posts/all')
    .then((response)=>{
        res.render('index',{obj:response.data});
    })
    .catch( (err)=>{
        res.send(err);
})

route.get('/list', (req, res) =>{
        axios.get('http://localhost:8080/users/all')
        .then((response) => {
            res.render('list', {obj:response.data})
        })
        .catch( (err)=>{
            res.send(err)
        })
        
    })    
})

// POSTS 

route.get('/add', (req, res) =>{
    if(req.cookies["Zalogowany"] != null){
        res.render('newpost')
    }else res.redirect("http://localhost:3000/")
})


// LOGIN MANAGEMENT
route.get('/register', (req, res) =>{
    res.render('register')
})

route.get('/login', (req, res) =>{
    res.render('login')
})

route.get('/logout', (req, res) =>{
    res.clearCookie("Admin")
    res.clearCookie("Zalogowany")
    res.redirect('http://localhost:3000/')
})
// Admin sites

route.get('/admin', (req, res) =>{
    if(req.cookies["Admin"] == 1){
        res.render("admin")
    }else res.redirect("http://localhost:3000/")
    
})

route.get('/admin/users', (req, res) =>{
    if(req.cookies["Admin"] == 1){
        axios.get('http://localhost:8080/users/all')
        .then((response) => {
            res.render('adminlist', {obj:response.data})
        })
        .catch( (err)=>{
            res.send(err)
        })
    }else res.redirect("http://localhost:3000/")
    
})

route.get('/test', (req,res)=>{

})

// route.get('/dodaj', (req, res) =>{
//     res.render('dodaj')
//  })

 route.get('/edit/:id', (req, res) =>{
    axios.get(`http://localhost:8080/users/one/${req.params.id}`)
    .then((response)=>{
        res.render('edit',{obj:response.data});
    })
    .catch( (err)=>{
        res.send(err);
    }) 
})


module.exports=route;