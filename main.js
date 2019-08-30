const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bodyParser = require('body-parser')
const app = express()

//middlewares
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser('secret'))
app.use(session({cookie: {maxAge: null}}))

//flash message middleware
app.use((req, res, next)=>{
  res.locals.message = req.session.message
  delete req.session.message
  next()
})

const handlebars = require('express3-handlebars').create()
app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')

app.get('/', (req, res)=>{
  res.render('home')
})

app.post('/', (req, res)=>{
  if(req.body.name == '' || req.body.email=='' || req.body.password=='' || req.body.confirm == ''){
    req.session.message = {
      type: 'danger',
      intro: 'Empty fields! ',
      message: 'Please insert the requested information.'
    }
    res.redirect('/')
  }
  else if(req.body.password != req.body.confirm){
    req.session.message = {
      type: 'danger',
      intro: 'Passwords do not match! ',
      message: 'Please make sure to insert the same password.'
    }
    res.redirect('/')
  }
  else{
    req.session.message = {
      type: 'success',
      intro: 'You are now registered! ',
      message: 'Please log in.'
    }

    console.log(req.body.name, req.body.email, req.body.password)
    res.redirect('/')
  }
})

app.listen(3000, ()=>{
  console.log('Server started at port 3000')
})
