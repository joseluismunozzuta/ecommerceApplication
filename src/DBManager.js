import mongoose from "mongoose";
import { productModel } from "../src/dao/models/products.model.js";
import { cartModel } from "../src/dao/models/carts.model.js";

class ProductDBManager {

    async read() {
        try {
            const products = await productModel.find().lean();
            return products;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async create(product) {

        try {
            const newProduct = new productModel(product);
            let result = await newProduct.save();
            return result;
        } catch (err) {
            throw err;
        }
    }

    async update(id, newProduct) {

        try {
            const updatedProduct = await productModel.findByIdAndUpdate(id, newProduct, { new: true });
            return updatedProduct;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }

    async delete(id) {
        try {
            const deletedProduct = await productModel.findByIdAndDelete(id);
            return deletedProduct;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }


    // async countAllProds() {
    //     const objs = await this.getProducts();
    //     let cant = 0;
    //     for (let o of objs) {
    //         cant++;
    //     }
    //     return cant;
    // }
    // async getProductById(searchedId) {
    //     const obj = await this.getProducts();
    //     for (let o of obj) {
    //         if (o.id == searchedId) {
    //             console.log("The product searched is:");
    //             console.log(o);
    //             return o;
    //         }
    //     }
    //     console.log("There is no product with the specified ID");
    //     return null;
    // }
}

class CartDBManager {

    createCart = (products) => {
        const cart = new Object();
        cart.products = products;
        return cart;
    }

    async addCart(cart) {

        const jsonObjects = [];

        try {
            const objetos = await this.getAll();
            let maxId = 0;
            for (let ob of objetos) {
                jsonObjects.push(ob);
                if (ob.id > maxId) {
                    maxId = parseInt(ob.id);
                }
            }
            if (maxId == 0) {
                cart.id = 1;
                jsonObjects.push(cart);
            } else {
                cart.id = maxId + 1;
                jsonObjects.push(cart);
            }

            await this.writeAll(jsonObjects);
            return cart;
        } catch (err) {
            throw err;
        }
    }

    async addProductToCart(carts, cartSearched, products, productIdToAdd) {

        //Validate that cart and product id's exist.
        const cart = carts.find((cart) => cart.id === cartSearched);
        if (!cart) {
            return -1;
        }

        const product = products.find((product) => product.id === productIdToAdd);
        if (!product) {
            return -2;
        }

        const productInCart = cart.products.find((p) => p.id === productIdToAdd);

        if (productInCart) {
            //The product it's already in the cart.
            //Increment quantity.
            console.log("Product already in cart. Quantity incremented by one.")
            productInCart.quantity++;
        } else {
            console.log("Adding a new product to cart.")
            cart.products.push({ id: productIdToAdd, quantity: 1 });
        }

        try {
            await this.writeAll(carts);
            return cart;
        } catch (err) {
            throw err;
        }

    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const carts = await this.getAll();

            const cart = carts.find((c) => c.id === cartId);

            if (cart) {
                const index = cart.products.findIndex((p) => p === productId);
                if (index === -1) {
                    throw new Error("Product not found in cart");
                } else {
                    cart.products.splice(index, 1);
                    await this.writeAll(carts);
                }
            } else {
                throw new Error("Cart not found");
            }
        } catch (err) {
            throw err;
        }
    }

}

export { ProductDBManager, CartDBManager };