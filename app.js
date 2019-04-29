//require packages uesed in the project
const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");

//設定連線至moongoose
mongoose.connect("mongodb://localhost/restaurant", { useNewUrlParser: true });

//連線後透過moongoose.connetion 拿到 connection 的物件
const db = mongoose.connection;

//連線狀態
db.on("error", () => {
  console.log("mongodb error!");
});

db.once("open", () => {
  console.log("mongodb connection!");
});

//載入model
const Restaurant = require("./models/restaurant");

//require express-handlebars here
const exphbs = require("express-handlebars");

//settting template engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//setting static files
app.use(express.static("public"));

//routes setting
app.get("/", (req, res) => {
  Restaurant.find((err, restaurants) => {
    if (err) return console.error(err);
    return res.render("index", { restaurants: restaurants });
  });
});

app.get("/restaurants/:id", (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err);
    console.log(restaurant);
    return res.render("show", { restaurant: restaurant });
  });
});

// app.get("/search", (req, res) => {
//   const keyword = req.query.keyword;
//   const restaurantName = restaurantList.results.filter(restaurant => {
//     return restaurant.name.toLowerCase().includes(keyword.toLowerCase());
//   });
//   const restaurantNameCategory = restaurantList.results.filter(restaurant => {
//     return restaurant.category.toLowerCase().includes(keyword.toLowerCase());
//   });
//   const restaurants = restaurantName.concat(restaurantNameCategory);
//   console.log(restaurants);
//   res.render("index", { restaurants: restaurants, keyword: keyword });
// });

//start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});
