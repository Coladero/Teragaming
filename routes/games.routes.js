const router = require("express").Router();
const axios = require("axios")
const UserModel = require("../models/User.model")
const GameModel = require("../models/game.model");
const isLoggedIn = require("../middleware/isLoggedIn");

//show the list of the games.
router.get("/game-list", (req, res, next) => {
  axios.get(`https://api.rawg.io/api/games?key=${process.env.GAMES_API_KEY}`)
  .then((response) => {
    // console.log("Hola que tal",response.data.background_image[0])
    res.render("games/game-list", {data:response.data.results})


  })
  .catch((err)=>{
    next(err)
  })
});
//router show the details of the game by Id.
router.get("/game-details/:id", (req, res, next)=>{
  const{id} = req.params //se pone antes del axios para que pueda inicializarse la ID.
  // console.log("hola",id)
  axios.get(`https://api.rawg.io/api/games/${id}?key=${process.env.GAMES_API_KEY}`)
  .then((response)=>{
    // console.log("adios",response.data)
    res.render("games/game-details", {data:response.data})
  })
})
//Edit the information of the game.
router.get("/edit/:id", (req, res, next)=>{
  const{id} = req.params
  axios.get(`https://api.rawg.io/api/games/${id}?key=${process.env.GAMES_API_KEY}`)
  .then((response)=>{
    // console.log("adios",response.data)
    res.render("games/edit", {data:response.data})
  })
})

//create the new details by user
router.post("/create/:id/:name",isLoggedIn, (req, res, next) =>{
  const {id, name} = req.params
  const {score, status,comment,createBy} = req.body
  // console.log("hola",id,name)
  GameModel.create({
      name:name,
      apiId:id,
      score:score,
      status:status,
      comment:comment,
      createBy:createBy
  })
  .then(() =>{
      res.redirect("/auth/profile")

  })
  .catch((err)=>{
      next(err)
  })
})


module.exports = router;