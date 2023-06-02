import ProductDTO from "../dao/DTOs/product.dto.js";
import Product from "../dao/classes/product.dao.js";

const productService = new Product();

export const getProducts_controller = async (req, res) => {
    const queryParams = req.query;
    try {
        const productos = await productService.getProducts(queryParams);
        res.send(productos);
    } catch (err) {
        res.status(500).send(err.message);
    }

}

export const getProductById_controller = async (req, res) => {
    const { pid } = req.params;
    if (pid) {
        await productService.getProductById(pid).then((data) => {
            res.send(data);
        }).catch((err) => {
            res.status(500).send(err.message);
        })

    }
    else {
        res.status(404).send("Not ID");
    }
}

export const createProduct_controller = async (req, res) => {

    const product = { ...req.body };

    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.category || !product.code || !product.stock) {
        return res.status(400).send({ status: "error", error: "Incomplete values" })
    }

    const newProd = new ProductDTO(product);

    // console.log(newProd);
    // res.send({ status: "success", message: "Success" });
    await productService.create(newProd).then((data) => {
        console.log(`Product succesfully created with ID: ` + data.id);
        res.send({ status: "success", payload: data });
    }).catch((e) => {
        console.log(e.message);
        res.status(500).send(e.message);
    })

}

export const updateProduct_controller = async (req, res) => {
    const product = { ...req.body };
    let productToUpdate = req.params.pid;

    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.category || !product.code || !product.stock) {
        return res.status(400).send({ status: "error", error: "Incomplete values" })
    }

    await productService.update(productToUpdate, product).then((data) => {
        console.log(`Product succesfully updated with ID: ` + data.id);
        res.send({ status: "success", payload: data });
    }).catch((e) => {
        console.log(e.message);
        res.status(500).send(e.message);
    })
}

export const deleteProduct_controller = async (req, res) => {

    let productToDelete = req.params.pid;

    await productService.delete(productToDelete).then((data) => {
        console.log(`Product succesfully deleted with ID: ` + data.id);
        res.send({ status: "success", payload: data });
    }).catch((e) => {
        console.log(e.message);
        res.status(500).send(e.message);
    })
    
}