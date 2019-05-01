//require packages uesed in the project
const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//設定 bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

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
//首頁
app.get("/", (req, res) => {
  Restaurant.find((err, restaurants) => {
    if (err) return console.error(err);
    return res.render("index", { restaurants: restaurants });
  });
});

//單筆餐廳詳細內容
app.get("/restaurant/:id", (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err);
    return res.render("show", { restaurant: restaurant });
  });
});

//新增餐廳頁面
app.get("/restaurants/new", (req, res) => {
  return res.render("new");
});

//新增一筆餐廳資料
app.post("/restaurants", (req, res) => {
  const restaurant = Restaurant({
    name: req.body.name,
    category: req.body.category,
    image: req.body.image,
    location: req.body.location,
    google_map: req.body.google_map,
    phone: req.body.phone,
    rating: req.body.rating,
    description: req.body.description
  });
  restaurant.save(err => {
    if (err) return console.error(err);
    const id = encodeURI(restaurant.id);
    return res.redirect(`/restaurant/${restaurant.id}`);
  });
});

//修改餐廳頁面
app.get("/restaurant/:id/edit", (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err);
    return res.render("edit", { restaurant: restaurant });
  });
});

//修改餐廳
app.post("/restaurant/:id", (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) console.error(err);
    restaurant.name = req.body.name;
    restaurant.category = req.body.category;
    restaurant.image = req.body.image;
    restaurant.location = req.body.location;
    restaurant.google_map = req.body.google_map;
    restaurant.phone = req.body.phone;
    restaurant.rating = req.body.rating;
    restaurant.description = req.body.description;
    restaurant.save(err => {
      if (err) return comsole.error(err);
      return res.redirect(`/restaurant/${req.params.id}`);
    });
  });
});

//刪除餐廳
app.post("/restaurant/:id/delete", (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err);
    restaurant.remove(err => {
      if (err) return console.error(err);
      return res.redirect("/");
    });
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
