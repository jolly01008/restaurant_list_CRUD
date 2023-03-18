const express = require("express")
const app = express()
const port = 3000
const Restaurant = require("./models/Restaurant") //載入restaurant model
const mongoose = require("mongoose") //載入mongoose
const exphbs = require("express-handlebars")  //require express-handlebars
const bodyParser = require('body-parser') //引用body-parser

//引入dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config() }
//設定連線到mongoDB，與資料庫連線
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,useUnifiedTopology: true })


const db = mongoose.connection //設定db並且監聽
db.on("error", () => {
  console.log("mongodb Error!")
})
db.once("open", () => {
  console.log("mongodb connected!")
})

//setting template engine，設定模板引擎
app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")
app.use(bodyParser.urlencoded({extended: true})) //body-parser
app.use(express.static("public")) //setting static files

//============index頁面路由設定============
app.get("/", (req, res) => {
  Restaurant.find({}) //重要!!!!用find()叫 restaurant model 去MongoDB資料庫找資料，並讀取
    .lean()
    .then( restaurantsData => res.render("index", { restaurantsData }))
    .catch( err => console.log(err))
});

//============show頁面路由設定============
app.get("/restaurants/:restaurantId", (req, res) => {
  //req.params，可抓取路由的變數資訊
  const id = req.params.restaurantId;
  Restaurant.findById(id)
    .lean()
    .then(restaurantData => res.render("show", { restaurantData }))
    .catch( err => console.log(err))
});

//============搜尋特定清單============
app.get("/search", (req, res) => {
  //req.query，可抓取瀏覽器輸入的內容，也就是網址中?後面的資訊
  const Keyword = req.query.keywords.trim().toLowerCase()
  Restaurant.find({})
    .lean()
    .then( restaurantsData => {
     const searchRestaurant = restaurantsData.filter(
        data => data.name.toLowerCase().includes(Keyword) ||
        data.category.includes(Keyword) )
     res.render("index",{ restaurantsData:searchRestaurant , wordValue:req.query.keywords})
    })
    .catch( err => console.log(err))
})


//============伺服器監聽器============
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`);
})