import { productModel } from "../models/products.model.js";

export default class Product {
    async getProducts(queryParams) {

        if (queryParams.limit)
            queryParams.limit = parseInt(queryParams.limit);
        else {
            queryParams.limit = 10;
        }

        if (queryParams.page) {
            queryParams.page = parseInt(queryParams.page);
        } else {
            queryParams.page = 1;
        }

        let paginateOptions = { limit: queryParams.limit, page: queryParams.page };

        if (queryParams.sort) {
            if (queryParams.sort == "asc") {
                paginateOptions.sort = { price: 1 };
            } else if (queryParams.sort == "desc") {
                paginateOptions.sort = { price: -1 };
            }
        }

        let query = {};

        if (queryParams.queryCategory) {
            query.category = queryParams.queryCategory;
        }

        try {
            const products = await productModel.paginate(query, paginateOptions);
            return products;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getTotalPagesProds(){
        try {
            const products = await productModel.paginate();
            return products.totalPages;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getProductById(id) {
        try {
            const product = await productModel.findById(id);
            return product;
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
            const updatedProduct = await productModel.findByIdAndUpdate(
                id,
                newProduct,
                { new: true }
            );
            return updatedProduct;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async delete(id) {
        try {
            const deletedProduct = await productModel.findByIdAndDelete(id);
            return deletedProduct;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}