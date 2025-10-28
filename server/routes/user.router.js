const express  = require("express")
const { registerUser, loginUser, updateName, updatePassword } = require("../controllers/user.controller")
const userAuthentication = require("../middleware/auth.user")

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)

userRouter.get("/me", userAuthentication, (req, res) => {
  res.json(req.user)   // send user details (without password)

  
})

userRouter.put("/update-name", userAuthentication, updateName);
userRouter.put("/update-password", userAuthentication, updatePassword);


module.exports = userRouter