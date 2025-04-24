import { nanoid } from "nanoid";
// Models
import { 
  Category,
  Comment,
  Property, 
  User 
} from "../../../DB/Models/index.js";
// Utils
import { 
  cloudinaryConfig, 
  ErrorClass, 
  uploadFile 
} from "../../Utils/index.js";


/**
* @param {object} req
* @param {object} res
* @param {object} next
* @returns {object} return response { status, message, data }
* @api {POST} /properties/add add a new property
* @description add a new property
*/

export const addProperty = async (req, res, next) => {
  // destructuring the request body
  const { title, description, price, location, rooms, bathrooms, area, status, purpose, availabFrom } = req.body;
  const { _id: userId } = req.authUser;
  const { categoryId, subCategoryId } = req.query;

  // find user
  const user = await User.findById(userId);
  // ckeck if user exists
  if (!user) 
    return next(new ErrorClass("User not found", 404, "User not found"));

  // check if the request files is empty
  if (!req.files.length) {
    return next(new ErrorClass("Please upload an image", 400, "Please upload an image"));
  }

  const customId = nanoid(4);

  const folder = `${process.env.UPLOADS_FOLDER}/properties/${customId}`;

  const URLs = []

  for (const file of req.files) {
    const { secure_url, public_id } = await uploadFile({
      file: file.path,
      folder,
    });
    URLs.push({ secure_url, public_id });
  };

  const propertyObject = {
    title,
    description,
    price,
    location,
    rooms,
    bathrooms,
    area,
    images: {
      URLs,
      customId,
    },
    status,
    purpose,
    availabFrom,
    category: categoryId,
    subCategory: subCategoryId,
    addedBy: userId,
  };

  const property = await Property.create(propertyObject);

  res.status(201).json({
    status: "success",
    message: "Property added successfully",
    data: property,
  });
}


/**
* @param {object} req
* @param {object} res
* @param {object} next
* @returns {object} return response { status, message, data }
* @api {GET} /properties/get/:propertyId get a property
* @description get a property
*/

export const getProperty = async (req, res, next) => {
  const { userId: _id } = req.authUser;
  const { propertyId } = req.params;
  const properties = await Property.findById(propertyId)

  if (!properties)
    return next(new ErrorClass("Property not found", 404, "Property not found"));

  res.status(200).json({
    status: "success",
    data: properties,
  });
}


/**
* @param {object} req
* @param {object} res
* @param {object} next
* @returns {object} return response { status, message, data }
* @api {GET} /properties/get-all get all properties
* @description get all properties
*/

export const getProperties = async (req, res, next) => {
  const properties = await Property.find()

  res.status(200).json({
    status: "success",
    data: properties,
  });
}


/**
* @param {object} req
* @param {object} res
* @param {object} next
* @returns {object} return response { status, message, data }
* @api {PUT} /properties/update/:propertyId update a property
* @description update a property
*/

export const updateProperty = async (req, res, next) => {
  const { propertyId } = req.params;
  const { title, description, price, location, rooms, bathrooms, area, status, purpose, availabFrom } = req.body;
  const { _id: userId } = req.authUser;

  // find user
  const user = await User.findById(userId);
  // ckeck if user exists
  if (!user) 
    return next(new ErrorClass("User not found", 404, "User not found"));

  // find property
  const property = await Property.findById(propertyId);
  // ckeck if property exists
  if (!property) 
    return next(new ErrorClass("Property not found", 404, "Property not found"));

  // update property
  if (title) property.title = title;
  if (description) property.description = description;
  if (price) property.price = price;
  if (location) property.location = location;
  if (rooms) property.rooms = rooms;
  if (bathrooms) property.bathrooms = bathrooms;
  if (area) property.area = area;
  if (status) property.status = status;
  if (purpose) property.purpose = purpose;
  if (availabFrom) property.availabFrom = availabFrom;

  await property.save();

  res.status(200).json({
    status: "success",
    message: "Property updated successfully",
    data: property,
  });
}


/**
* @param {object} req
* @param {object} res
* @param {object} next
* @returns {object} return response { status, message, data }
* @api {DELETE} /properties/delete/:propertyId delete a property
* @description delete a property  
*/

export const deleteProperty = async (req, res, next) => {
  const { propertyId } = req.params;
  const { _id: userId } = req.authUser;

  // find user
  const user = await User.findById(userId);
  // ckeck if user exists
  if (!user) 
    return next(new ErrorClass("User not found", 404, "User not found"));

  // find property
  const property = await Property.findByIdAndDelete(propertyId);
  // ckeck if property exists
  if (!property) 
    return next(new ErrorClass("Property not found", 404, "Property not found"));

  // delete property images
  const propertyPath = `${process.env.UPLOADS_FOLDER}/properties/${property?.images.customId}`;

  await cloudinaryConfig().api.delete_resources_by_prefix(propertyPath);
  await cloudinaryConfig().api.delete_folder(propertyPath);

  res.status(200).json({
    status: "success",
    message: "Property deleted successfully",
  });
}

/**
* @param {object} req
* @param {object} res
* @param {object} next
* @returns {object} return response { status, message, data }
* @api {GET} /properties/get-by-category/:categoryId get properties by category
* @description get properties by category
*/

export const getPropertyByCategory = async (req, res, next) => {
  const { _id: userId } = req.authUser;
  const { categoryId } = req.params;

  // find user
  const user = await User.findById(userId);
  // ckeck if user exists
  if (!user) 
    return next(new ErrorClass("User not found", 404, "User not found"));

  // find category
  const category = await Category.findById(categoryId);
  // ckeck if category exists
  if (!category) 
    return next(new ErrorClass("Category not found", 404, "Category not found"));

  // find properties
  const properties = await Property.find({ category: categoryId })  
  .populate("category")

  res.status(200).json({
    status: "success",
    data: properties,
  });
}

/**
* @param {object} req
* @param {object} res
* @param {object} next
* @returns {object} return response { status, message, data }
* @api {GET} /properties/get-by-addedby get properties by addedby
* @description get properties by added by
*/

export const getPropertyByAddedBy = async (req, res, next) => {
  const { _id: userId } = req.authUser;

  // find user
  const user = await User.findById(userId);
  // ckeck if user exists
  if (!user) 
    return next(new ErrorClass("User not found", 404, "User not found"));

  // find properties
  const properties = await Property.find({ addedBy: userId })  
  .populate("addedBy")

  if (properties.length === 0) 
    return next(new ErrorClass("Properties not found", 404, "Properties not found"));

  res.status(200).json({
    status: "success",
    data: properties,
  })
}

/**
* @param {object} req
* @param {object} res
* @param {object} next
* @returns {object} return response { status, message, data }
* @api {POST} /properties/:propertyId/add-comment
* @description add a comment to a property
*/

export const addComment = async (req, res, next) => {
  const { content } = req.body;
  const { _id: userId } = req.authUser;
  const { propertyId } = req.params;

  const user = await User.findById(userId);

  if (!user)
    return next(new ErrorClass("User not found", 404, "User not found"));

  const property = await Property.findById(propertyId);

  if (!property)
    return next(new ErrorClass("Property not found", 404, "Property not found"));

  const comment = await Comment.create({
    content,
    createdBy: userId,
    propertyId,
  });

  res.status(200).json({
    status: "success",
    message: "Comment added successfully",
    data: comment,
  });
};

/**
* @param {object} req
* @param {object} res
* @param {object} next
* @returns {object} return response { status, message, data }
* @api {GET} /properties/:propertyId/comments
* @description get comments of a property
*/

export const getComments = async (req, res, next) => {
  const { _id: userId } = req.authUser;
  const { propertyId } = req.params;

  const user = await User.findById(userId);

  if (!user)
    return next(new ErrorClass("User not found", 404, "User not found"));

  const property = await Property.findById(propertyId);

  if (!property)
    return next(new ErrorClass("Property not found", 404, "Property not found"));

  const comments = await Comment.find({ propertyId });

  res.status(200).json({
    status: "success",
    message: "Comments fetched successfully",
    data: comments,
  });
}

/**
* @param {object} req
* @param {object} res
* @param {object} next
* @returns {object} return response { status, message, data }
* @api {DELETE} /properties/:propertyId/comments/:commentId
* @description delete a comment of a property
*/

export const deleteComment = async (req, res, next) => {
  const { commentId } = req.params;
  const { _id: userId } = req.authUser;

  const user = await User.findById(userId);

  if (!user)
    return next(new ErrorClass("User not found", 404, "User not found"));

  const comment = await Comment.findOneAndDelete({ _id: commentId, createdBy: userId })

  if (comment === null) 
    return next(new ErrorClass("Comment not found", 404, "Comment not found"));

  res.status(200).json({
    status: "success",
    message: "Comment deleted successfully",
  });
}

/**
* @param {object} req
* @param {object} res
* @param {object} next
* @returns {object} return response { status, message, data }
* @api {PATCH} /properties/:propertyId/comments/:commentId
* @description update a comment of a property
*/

export const updateComment = async (req, res, next) => {
  const { content } = req.body;
  const { commentId } = req.params;
  const { _id: userId } = req.authUser;

  const user = await User.findById(userId);

  if (!user)
    return next(new ErrorClass("User not found", 404, "User not found"));

  const comment = await Comment.findOneAndUpdate({ _id: commentId, createdBy: userId }, 
    { content }, 
    { new: true });

  if (comment === null) 
    return next(new ErrorClass("Comment not found", 404, "Comment not found"));

  res.status(200).json({
    status: "success",
    message: "Comment deleted successfully",
    data: comment
  });
}