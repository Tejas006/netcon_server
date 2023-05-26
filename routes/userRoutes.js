const { register, login, setAvatar, getAllUsers } = require("../controllers/usersController")

const router = require("express").Router()

router.post("/register", register)
router.post("/login", login)
router.post("/setAvatar/:id", setAvatar)   // "POST" means putting data into Database
router.get("/allusers/:id", getAllUsers)   // "GET" can be considered as "READ"

module.exports = router