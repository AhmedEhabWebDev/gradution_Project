// models
import { 
  Cart, 
  Property 
} from "../../../DB/Models/index.js";
// utils
import { ErrorClass } from "../../Utils/index.js";

/**
* @param {object} req
* @param {object} res
* @param {object} next
* @returns {object} return response { status, message, data }
* @api {POST} /cart/add/:propertyId add a property to cart
* @description add a property to cart
*/

export const addToCart = async (req, res, next) => {
  const { _id : userId } = req.authUser;
  const { propertyId } = req.params;

  const property = await Property.findById(propertyId);

  if (!property) {
    return next(new ErrorClass("Property not found", 404, "Property not found"));
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    const newCart = new Cart({
      userId,
      properties: [
        {
          propertyId: property._id,
        },
      ],
    });
    await newCart.save();
    res.status(201).json({
      status: "success",
      message: "Property added to cart successfully",
      data: newCart,
    });
  }

  const isPropertyInCart = cart.properties.find((p) => p.propertyId == propertyId);

  if (isPropertyInCart) {
    return next(new ErrorClass("Property already in cart", 400, "Property already in cart"));
  }

  cart.properties.push({ propertyId: property._id });

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Property added to cart successfully",
    data: cart,
  });
}

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { status, message, data }
 * @api {GET} /cart/get get cart
 * @description get cart
 */

export const getCart = async (req, res, next) => {
  const { _id: userId } = req.authUser;

  const cart = await Cart.findOne({ userId }).populate("properties.propertyId", "title price images");
  if (!cart) {
    return next(new ErrorClass("Cart not found", 404, "Cart not found"));
  }

  res.status(200).json({ cart });
}

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { status, message, data }
 * @api {DELETE} /cart/remove/:propertyId remove property from cart
 * @description remove property from cart
 */

export const removeFromCart = async (req, res, next) => {
  const { _id: userId } = req.authUser;
  const { propertyId } = req.params;

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return next(new ErrorClass("Cart not found", 404, "Cart not found"));
  }

  const isPropertyInCart = cart.properties.find((p) => p.propertyId == propertyId);

  if (!isPropertyInCart) {
    return next(new ErrorClass("Property not found in cart", 404, "Property not found in cart"));
  }

  cart.properties = cart.properties.filter((p) => p.propertyId != propertyId);

  
  if (cart.properties.length === 0) {
    await Cart.deleteOne({ userId });
    return res.status(200).json({message: 'Property Removed From Cart'})
  }

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Property removed from cart successfully",
    data: cart,
  });
}