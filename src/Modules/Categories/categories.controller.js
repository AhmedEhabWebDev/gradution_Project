import slugify from "slugify";
// Models
import { Category, User } from "../../../DB/Models/index.js";
// Utils
import { ErrorClass } from "../../Utils/index.js";



/**
* @param {object} req
* @param {object} res
* @param {object} next
* @returns {object} return response { status, message, data }
* @api {POST} /categories/create Create a new category
* @description Create a new category
*/

export const createCategory = async (req, res, next) => {
  // destructuring the request body
  const { name } = req.body;
  // destructuring the user id
  const { _id } = req.authUser;

  // find user
  const user = await User.findById(_id)

  // ckeck if user exists
  if (!user)
    return next( new ErrorClass("User not found", 404,"User not found"))

  // Generating category slug
  const slug = slugify(name, {
    replacement: "_",
    lower: true
  })

  // Creating new category
  const category = {
    name, 
    slug,
    createdBy: _id
  }

  const newCategory = await Category.create(category)

  // response
  res.status(201).json({
    status: "successfully",
    massage: "Category created successfully",
    data: newCategory
  })
}

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { status, message, data }
 * @api {GET} /categories/get?_id&name&slug Get Category 
 * @description Get Category by id || name || slug
 */

export const getCategory = async (req, res, next) => {
  // destructuring the request query
  const { id, name, slug } = req.query
  const queryFilter = {};

  // check if id, name or slug is provided
  if (id) {
    queryFilter._id = id;
  } else if (name) {
    queryFilter.name = name;
  } else if (slug) {
    queryFilter.slug = slug;
  }

  // find category
  const category = await Category.findOne( queryFilter )

  // ckeck if category exists
  if (!category)
    return next( new ErrorClass("Category not found", 404,"Category not found"))

  res.status(200).json({
    status: "successfully",
    massage: "Category fetched successfully",
    data: category
  })
}

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { status, message, data }
 * @api {PUT} /categories/update/:_id Update Category
 * @description Update Category
 */
export const updateCategory = async (req, res, next) => {
  const { _id } = req.params
  const { name } = req.body;
  const { _id: userId } = req.authUser

  // find user
  const user = await User.findById(userId)

  // ckeck if user exists
  if (!user)
    return next( new ErrorClass("User not found", 404,"User not found"))

  // find category
  const category = await Category.findById(_id)

  // ckeck if category exists
  if (!category)
    return next( new ErrorClass("Category not found", 404,"Category not found"))
  

  if (name) {
    const slug = slugify(name, {
      replacement: "_",
      lower: true
    })

    category.name = name 
    category.slug = slug
  }

  await category.save()

  res.status(200).json({
    status: "successfully",
    massage: "Category updated successfully",
    data: category
  })
}


/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { status, message }
 * @api {DELETE} /categories/delete/:_id Delete Category
 * @description Delete Category
 */
export const deleteCategory = async (req, res, next) => {
  const { _id } = req.params
  const { _id: userId } = req.authUser

  // find user
  const user = await User.findById(userId)

  // ckeck if user exists
  if (!user)
    return next( new ErrorClass("User not found", 404,"User not found"))

  // delete category
  const category = await Category.findByIdAndDelete(_id)

  // ckeck if category exists
  if (!category)
    return next( new ErrorClass("Category not found", 404,"Category not found"))

  res.status(200).json({
    status: "successfully",
    massage: "Category deleted successfully",
  })
}

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { status, message, data }
 * @api {GET} /categories/get Get all categories
 * @description Get all categories
 */

export const getAllCategories = async (req, res, next) => {
  const { _id } = req.authUser;

  // find user
  const user = await User.findById(_id);

  // ckeck if user exists
  if (!user)
    return next( new ErrorClass("User not found", 404,"User not found"));

  // find all categories
  const categories = await Category.find();

  res.status(200).json({
    status: "successfully",
    massage: "Categories fetched successfully",
    data: categories
  })
}