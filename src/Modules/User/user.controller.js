import jwt from "jsonwebtoken";
import { compareSync, hashSync } from "bcrypt";
import { User } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/index.js";


/**
 * @param {object} req
 * @param {object} res
 * @returns {object} return response { status, message, data }
 * @api {POST} /users/register Register a new user
 * @description Register a new user
 */

export const registerUser = async (req, res, next) => {
  const { username, nationalId, email, password, gender, age, phone } = req.body;

  // check email
  const isEmailExist = await User.findOne({ email });

  if (isEmailExist) {
    return next( new ErrorClass("Email already exist", 400,"Email already exist"));
  }

  // check nationalId
  const isNationalExist = await User.findOne({ nationalId });

  if (isNationalExist) {
    return next( new ErrorClass("National ID already exist", 400,"National ID already exist"));
  }

  // create User Instance
  const userInstance = new User({
    username,
    nationalId,
    email,
    password,
    gender,
    age,
    phone
  })


  // creat user in db
  await userInstance.save();


  res.status(201).json({
    status: "success",
    message: "User created successfully"
  });
};

/**
 * @param {object} req
 * @param {object} res
 * @returns {object} return response { message, token }
 * @description User signin 
 * @api {POST} /user/signin
 */

export const signIn = async (req, res, next) => {
  // destruct email and password from req.body
  const { email, password } = req.body;
  // find user
  const user = await User.findOne({ email });
  if (!user)
    return next(new ErrorClass("invalid email or password", 404, "invalid email or password"));

  // compare password
  const isMatch = compareSync(password, user.password);

  if (!isMatch)
    return  next(new ErrorClass("invalid email or password", 404, "invalid email or password"));

  // generate the access token
  const token = jwt.sign({ userId: user._id, email, userName: user.username, role: user.userType }, process.env.LOGIN_SECRET);

  // response
  res.status(200).json({
    message: "Login success",
    token
  });
};

/**
 * @param {object} req
 * @param {object} res
 * @returns {object} return response {status ,message, data }
 * @api {PUT} /user/update Update username, email
 * @description Update User
 */

export const updateUser = async (req, res, next) => {
  
  const { _id } = req.params;
  const { username, email } = req.body;

// find User by id
  const user = await User.findById(_id);

  if (!user) {
    return next(new ErrorClass("User not found", 404, "User not found"));
  }

  if (email) {
    user.email = email;
  }

  if (username) {
    user.username = username;
  }

  await user.save();

  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: user,
  });
}

/**
 * @param {object} req
 * @param {object} res
 * @returns {object} return response {status ,message, data }
 * @api {PUT} /users/updatePassword Update password
 * @description Update User Password
 */


export const updatePassword = async (req, res, next) => {
  const { _id } = req.params;
  const { password } = req.body;

  // find User by id
  const user = await User.findById(_id);

  if (!user){
    return next(new ErrorClass("User not found", 404, "User not found"));
  }

  if (password) {
    user.password = password
  }

  await user.save()

  res.status(200).json({
    status: "success",
    massage: "User password updated successfully",
    data: user
  })
}
/**
 * @param {object} req
 * @param {object} res
 * @returns {object} return response {status, message }
 * @api {PUT} /users/delete/:_id 
 * @description Delete User
 */

export const deleteUser = async (req, res, next) => {
  const { _id } = req.params;
  await User.findByIdAndDelete(_id);
  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
}