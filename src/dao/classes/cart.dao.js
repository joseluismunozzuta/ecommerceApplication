import { productModel } from "../models/products.model.js";
import { cartModel } from "../models/carts.model.js";

export default class Cart {

    async read() {
        try {
            const cart = await cartModel.paginate();
            return cart;
        } catch (err) {
            console.log(err);
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
            console.log(err);
            throw err;
        }
    }

    async addProductToCart(cartId, productIdToAdd, quantity) {
        try {
            //Search for the cart in DB
            const cartSearched = await cartModel.findById(cartId);

            //Search for the product in DB
            const productSearched = await productModel.findById(productIdToAdd);

            const productInCart = cartSearched.products.find(
                (p) => p.product._id.toString() === productIdToAdd
            );

            if (productInCart) {
                //The product it's already in the cart.
                //Increment quantity.
                console.log("Product already in cart.");
                if (quantity) {
                    console.log("Defined quantity: " + quantity + " updated");
                    productInCart.quantity = quantity;
                } else {
                    console.log("Not quantity. Increment quantity in one");
                    productInCart.quantity++;
                }

            } else {
                console.log("Adding a new product to cart.");
                if(quantity){
                    console.log("Defined quantity: " + quantity);
                    cartSearched.products.push({ product: productIdToAdd, quantity: quantity });
                }else{
                    console.log("Not quantity. Quantity: 1");
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
            console.log(err);
            throw e;
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cartToModify = await cartModel.findById(cartId);

            const index = cartToModify.products.findIndex((p) => p.product.toString() === productId);

            if (index === -1) {
                throw new Error("Product not found in cart");
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
            throw err;
        }
    }

    async deleteAllCart(cartId) {
        try {
            const deleteProduct = { products: [] }
            const cart = await cartModel.findByIdAndUpdate(cartId, deleteProduct, { new: true });
            return cart;
        } catch (err) {
            throw err;
        }
    }
}