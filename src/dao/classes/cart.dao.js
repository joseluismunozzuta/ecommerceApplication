import { productModel } from "../models/products.model.js";
import { cartModel } from "../models/carts.model.js";
import EErrors from "../../services/errors/enums.js";
import CustomError from "../../services/errors/CustomError.js";

export default class Cart {

    async read() {
        try {
            const cart = await cartModel.paginate();
            return cart;
        } catch (err) {
            throw err;
        }
    }

    async create(cart) {
        try {
            const newCart = new cartModel(cart);
            let result = await newCart.save();
            return result;
        } catch (err) {
            throw e;
        }
    }

    async searchById(id) {
        try {
            const cart = await cartModel.findById(id).populate('products.product');
            return cart;
        } catch (err) {
            throw err;
        }
    }

    async addProductToCart(req, cartId, productIdToAdd, quantity) {
        try {
            //Search for the cart in DB
            const cartSearched = await cartModel.findById(cartId);

            if (!cartSearched) {
                CustomError.createError({
                    name: "CartId does not exist",
                    cause: `The cart id is not registered in DB.`,
                    message: "Error adding product to cart",
                    code: EErrors.DATABASE_ERROR
                });
            }

            //Search for the product in DB
            const productSearched = await productModel.findById(productIdToAdd);

            if (!productSearched) {
                CustomError.createError({
                    name: "Product does not exist",
                    cause: `Product selected does not exist`,
                    message: "Error adding product to cart",
                    code: EErrors.DATABASE_ERROR
                });
            }

            const productInCart = cartSearched.products.find(
                (p) => p.product._id.toString() === productIdToAdd
            );

            if (productInCart) {
                //The product it's already in the cart.
                //Increment quantity.
                req.logger.debug("Product already in cart.");
                if (quantity) {
                    req.logger.debug("Defined quantity: " + quantity + " updated");
                    productInCart.quantity = quantity;
                } else {
                    req.logger.debug("Not quantity. Increment quantity in one");
                    productInCart.quantity++;
                }

            } else {
                req.logger.debug("Adding a new product to cart.");
                if (quantity) {
                    req.logger.debug("Defined quantity: " + quantity);
                    cartSearched.products.push({ product: productIdToAdd, quantity: quantity });
                } else {
                    req.logger.debug("Not quantity. Quantity: 1");
                    cartSearched.products.push({ product: productIdToAdd, quantity: 1 });
                }

            }

            //Update the cart in DB
            const updatedCart = await cartModel.findByIdAndUpdate(
                cartId,
                { $set: { products: cartSearched.products } },
                { new: true }
            );
            return updatedCart;
        } catch (err) {
            req.logger.fatal(err.cause);
            throw err;
        }


    }

    async deleteProductFromCart(req, cartId, productId) {

        try {
            const cartToModify = await cartModel.findById(cartId);

            if (!cartToModify) {
                CustomError.createError({
                    name: "CartId does not exist",
                    cause: `The cart id is not registered in DB.`,
                    message: "Error deleting product from cart",
                    code: EErrors.DATABASE_ERROR
                });
            }

            const index = cartToModify.products.findIndex((p) => p.product.toString() === productId);

            if (index === -1) {
                CustomError.createError({
                    name: "Product is not in the cart",
                    cause: `The product selected is not in the cart.`,
                    message: "Error deleting product from cart",
                    code: EErrors.DATABASE_ERROR
                });
            } else {
                cartToModify.products.splice(index, 1);
                const updatedCart = await cartModel.findByIdAndUpdate(
                    cartId,
                    { $set: { products: cartToModify.products } },
                    { new: true }
                );
                return updatedCart;
            }

        } catch (err) {
            req.logger.fatal(err.cause);
            throw err;
        }

    }

    async deleteAllCart(req, cartId) {
        try {
            const deleteProduct = { products: [] }
            const cart = await cartModel.findByIdAndUpdate(cartId, deleteProduct, { new: true });
            return cart;
        } catch (err) {
            req.logger.fatal(err);
            throw err;
        }
    }
}