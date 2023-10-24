const express = require('express')
const mysql= require('mysql');
const bodyParser=require('body-parser')
const session = require('express-session');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const app = express()
const port = 8080

app.use(bodyParser.urlencoded({extended:false}));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize())
app.use(passport.session())

const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'blogsite_JZ'
});

// Autentication strategy

passport.use(new LocalStrategy(
    (login, password, done) =>{
        const query = 'SELECT * from users WHERE login= (?)'

        db.query(query, [login], (err, result) =>{
            if (err) {
                console.error("Database error: "+err)
                return done(err);
            }
            if (result.length === 0){
                return  done(null, false, {'message': 'Incorrect login'})
            }
            const user = result[0]
            if(user.password !== password) {
                return done(null, false, {'message': 'Incorrect password'})
            }
            return done(null, user)
        })
    }
))
// User serialize and deserialize

passport.serializeUser((user, done) =>{
    done(null, user.id);
})

passport.deserializeUser((id, done) =>{
    const query = 'SELECT * from users WHERE id = (?)'

    db.query(query, [id], (err, result)=>{
        if(err){
            return done(err)
        }
        done(null, result[0])
    })
})
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
    
    passport.authenticate('local', {
        successRedirect: 'http://localhost:3000/',
        failureRedirect: 'http://localhost:3000/login',
        failureFlash: true
    })
})

app.get('/users/logout', (req, res) =>{
    req.logout()
    res.redirect('http://localhost:3000/')
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