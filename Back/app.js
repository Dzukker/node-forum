const express = require('express')
const mysql= require('mysql');
const bodyParser=require('body-parser')

const app = express()
const port = 8080

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

app.use(bodyParser.urlencoded({extended:false}));


app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}));

const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'blogsite_JZ'
});


// POSTS

app.get('/posts/all', (req, res) =>{ 
    const q='SELECT * FROM posts'

    db.query(q,(err,data)=>{
        if(err) res.send(err);
        return res.json(data);
    })
})

app.get('/posts/one/:id', (req, res) =>{ 
    const q='SELECT * FROM posts where id='+req.params.id

    db.query(q,(err,data)=>{
        if(err) res.send(err);
        return res.json(data);
    })
})

app.get('/posts/del/:id', (req, res) =>{ 
    const q='DELETE FROM posts WHERE id='+req.params.id

    db.query(q,(err,data)=>{
        if(err) res.send(err);
        return res.redirect('http://localhost:3000/');
    })
})

app.post('/posts/add', (req, res) =>{ 
    const q='INSERT INTO `posts`(`user_id`, `title`, `content`) VALUES (?)';
    const values=[req.body.user_id, req.body.title, req.body.content];

    db.query(q,[values],(err,data)=>{
        if(err) res.send(err);
        return res.redirect('http://localhost:3000/');
    })
})

// COMMENTS

app.get('/comments/post/:id', (req, res) =>{ 
    const q='SELECT * FROM comments where post_id='+req.params.id

    db.query(q,(err,data)=>{
        if(err) res.send(err);
        return res.json(data);
    })
})

app.get('/comments/user/:id', (req, res) =>{ 
    const q='SELECT * FROM comments where user_id='+req.params.id

    db.query(q,(err,data)=>{
        if(err) res.send(err);
        return res.json(data);
    })
})

app.post('/comments/add', (req, res) =>{ 
    const q='INSERT INTO `comments`(`post_id`, `user_id`, `content`) VALUES (?)';
    const values=[req.body.post_id, req.body.user_id, req.body.content];
   
    db.query(q,[values],(err,data)=>{
        if(err) res.send(err);
        return res.redirect('http://localhost:3000/');
    })
})

app.get('/comments/del/:id', (req, res) =>{ 
    const q='DELETE FROM comments WHERE id='+req.params.id

    db.query(q,(err,data)=>{
        if(err) res.send(err);
        return res.redirect('http://localhost:3000/');
    })
})

// USERS

app.get('/users/all', (req, res) =>{ 
    const q='SELECT * FROM users'

    db.query(q,(err,data)=>{
        if(err) res.send(err);
        return res.json(data);
    })
})

app.get('/users/one/:id', (req, res) =>{ 
    const q='SELECT * FROM users where id='+req.params.id

    db.query(q,(err,data)=>{
        if(err) res.send(err);
        return res.json(data);
    })
})

app.get('/users/del/:id', (req, res) =>{ 
    const q='DELETE FROM users WHERE id='+req.params.id

    db.query(q,(err,data)=>{
        if(err) res.send(err);
        return res.redirect('http://localhost:3000/');
    })
})

app.post('/users/login', (req, res) =>{
    let password = req.body.password
    let login = req.body.login

    const q= `SELECT * FROM users WHERE login=${login}`;

    db.query(q, (err,data)=>{
        if(err) res.send(err);
            if(data.password == password){
                var profile = {
                    'id': data.id,
                    'login': data.login,
                    'isAdmin': data.isAdmin
                }
                req.session.profile = profile;
                res.redirect('http://localhost:3000/')
            } else {
                res.redirect('http://localhost:3000/login')
            }
    })
})

app.post('/users/add', (req, res) =>{ 
     const q='INSERT INTO users(login,password) VALUES (?)';
     const values=[req.body.login,req.body.password];
    
     db.query(q,[values],(err,data)=>{
         if(err) res.send(err);
         return res.redirect('http://localhost:3000/');
     })
})

app.post('/users/update/:id', (req, res) =>{ 

    let has=req.body.password;
    const q='UPDATE moja SET login="'+log+'", password="'+has+'" WHERE id='+req.params.id;

    db.query(q,(err,data)=>{
        if(err) res.send(err);
        return res.redirect('http://localhost:3000/');
    })
})


app.listen(port, () => console.log(`Back app listening on port ${port}!`))