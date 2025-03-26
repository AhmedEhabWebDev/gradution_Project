import slugify from "slugify";

// Models
import { 
  Category, 
  SubCategory, 
  User 
} from "../../../DB/Models/index.js";

// Utils
import { ErrorClass } from "../../Utils/index.js";


/**
* @param {object} req
* @param {object} res
* @param {object} next
* @returns {object} return response { status, message, data }
* @api {POST} /sub-categories/create Create a new sub category
* @description Create a new sub category
*/
export const createSubCategory = async (req, res, next) => {
  // destructuring the request body
  const { name } = req.body
  // destructuring the User Id
  const { _id } = req.authUser

  const user = await User.findById(_id)

  if (!user) 
    return next( new ErrorClass("User not found", 404,"User not found"))

  const slug = slugify(name,{
    replacement: "_",
    lower: true
  })

  const subCategory = {
    name,
    slug,
    createdBy: _id
  }

  const newSubCategory = await SubCategory.create(subCategory);

  res.status(201).json({
    status: "successfully",
    massage: "Sub Category Created Successfully",
    data: newSubCategory
  });
};


/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { status, message, data }
 * @api {GET} /sub-categories/get?_id&name&slug Get Sub Category 
 * @description Get Sub Category by id || name || slug
 */
export const getSubCategory = async (req, res, next) => {
  // destructuring the request query
  const { id, name, slug } = req.query
  const queryFilter = {}; 

  // check if id, name or slug is provided
  if (id) {
    queryFilter._id = id;
  }
  if (name) {
    queryFilter.name = name;
  }
  if (slug) {
    queryFilter.slug = slug;
  }

  // find sub category
  const subCategory = await SubCategory.findOne( queryFilter )

  // ckeck if sub category exists
  if (!subCategory)
    return next( new ErrorClass("Sub Category not found", 404,"Sub Category not found"))

  res.status(200).json({
    status: "successfully",
    massage: "Sub Category fetched successfully",
    data: subCategory
  })
}


/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { status, message, data }
 * @api {PUT} /categories/update/:_id Update Sub Category
 * @description Update Sub Category
 */

export const updateSubCategory = async (req, res, next) => {
  // destructuring the request params
  const { _id } = req.params;
  // destructuring the request body
  const { name } = req.body;
  // destructuring the User Id
  const { _id: userId } = req.authUser;

  // find user
  const user = await User.findById(userId);
  // ckeck if user exists
  if (!user) 
    return next( new ErrorClass("User not found", 404,"User not found"))

  // find sub category
  const subCategory = await SubCategory.findById(_id)
  // ckeck if sub category exists
  if (!subCategory)
    return next ( new ErrorClass("Sub Category not found", 404,"Sub Category not found"))

  // update sub category
  if (name) {
    const slug = slugify(name,{
      replacement: "_",
      lower: true
    });

    subCategory.name = name;
    subCategory.slug = slug;
  }

  // save sub category
  await subCategory.save()

  res.status(200).json({
    status: "successfully",
    massage: "Sub Category updated successfully",
    data: subCategory
  })
};


/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { status, message }
 * @api {DELETE} /sub-categories/delete/:_id Delete Sub Category
 * @description Delete Sub Category
 */

export const deleteSubCategory = async (req, res, next) => {
  // destructuring the request params
  const { _id } = req.params
  // destructuring the User Id
  const { _id: userId } = req.authUser

  // find user
  const user = await User.findById(userId)

  // ckeck if user exists
  if (!user) 
    return next( new ErrorClass("User not found", 404,"User not found"))

  // find sub category
  const subCategory = await SubCategory.findByIdAndDelete(_id)

  // ckeck if sub category exists
  if (!subCategory)
    return next( new ErrorClass("Sub Category not found", 404,"Sub Category not found"))

  res.status(200).json({
    status: "successfully",
    massage: "Sub Category deleted successfully", 
  })
}


/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { status, message, data }
 * @api {GET} /sub-categories/get-all Get All Sub Categories
 * @description Get All Sub Categories
 */

export const getAllSubCategories = async (req, res, next) => {
  const { _id } = req.authUser;

  // find user
  const user = await User.findById(_id);

  // ckeck if user exists
  if (!user)
    return next( new ErrorClass("User not found", 404,"User not found"));
  
  // find all sub categories
  const subCategories = await SubCategory.find()

  res.status(200).json({
    status: "successfully",
    massage: "Sub Categories fetched successfully",
    data: subCategories 
  })
}