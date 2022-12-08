const express = require('express')
const exphbs = require('express-handlebars')
const flash = require('express-flash')
const session = require('express-session')
const FileStore = require('session-file-store')(session)

const app = express()

const conn = require('./db/conn')

//Models
const User = require('./models/User')
const Account = require('./models/Account')
const Transaction = require('./models/Transaction')

//Import Routs
const authRoutes = require('./routes/authRoutes')
const servicesRoutes = require('./routes/servicesRoutes')

//Import Controller
const AuthController = require('./controllers/AuthController')

//template engine
app.engine('handlebars', exphbs.engine({
        defaultLayout: "main",
        runtimeOptions: {
          allowProtoPropertiesByDefault: true,
          allowProtoMethodsByDefault: true,
        }
    }))
app.set('view engine', 'handlebars')

//receber resposta do body
app.use(
    express.urlencoded({
        extended: true
    })
)

//session middeware
app.use(
    session({
        name:"session",
        secret:"you_shaw_not_pass",
        resave: false,
        saveUninitialized: false,
        Store: new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'sessions')
        }),
    cookie:{
        secure: false,
        maxAge: 360000,
        expires: new Date(Date.now + 360000),
        httpOnly: true
    }
    })
)

//flash messages
app.use(flash())

//public path
app.use(express.static('public'))

app.use(express.json())

//set session to res
app.use((req,res,next) =>{

    if(req.session.userid){
        res.locals.session = req.session
    }

    next()
})

//Routes
app.use('/', authRoutes)
app.use('/', servicesRoutes)

app.get('/', AuthController.login)  


conn
.sync()
// .sync( {force: true})
.then(() =>{
    app.listen(3000)
}).catch((error) => console.log(error))