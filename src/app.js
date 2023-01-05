import express, { application } from "express";
import ProductManagerExternal from "./ProductManager.js";

const app = express();
const PORT = 3000;
const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const ProductManager = new ProductManagerExternal("./productos.json");


app.get("/products", async (req, res) => {
    const { limit } = req.query;
    const productos = await ProductManager.getProducts();
    let limitedProducts;
    if (limit) {
        limitedProducts = productos.slice(0, limit);
        res.send(limitedProducts);
    } else {
        res.send(productos);
    }
});

app.get("/products/:pid?", async (req, res) => {
    const { pid } = req.params;
    ProductManager.getProducts().then((data) => {
        let productSearched;
        if (pid) {
            productSearched = data.find(e => e.id == pid);
            if (productSearched) {
                res.send(productSearched);
            } else {
                res.sendStatus(404);
                return;
            }
        } else {
            res.send(data);
        }
    })
})

app.get("/productoRandom", async (req, res) => {
    let cantProds = await ProductManager.countAllProds();
    let random = Math.floor(Math.random() * cantProds + 1);
    let randObj = await ProductManager.getProductById(random);
    res.send(randObj);
});

app.post('/api/products', (req, res) => {
    let product = req.body;

    if (!product.title || !product.description || !product.price || !product.category || !product.code || !product.stock) {
        return res.status(400).send({ status: "error", error: "Incomplete values" })
    }

    const p = ProductManager.crearProducto(product.title, product.description, product.price, product.category, product.thumbnail, product.code, product.stock, true);

    ProductManager.addProduct(p).then((data) => {
        console.log("Product created with ID ", data)
        res.send({ status: "success", message: "Product created" })
    }).catch((e) => {
        console.log(e.message);
        return res.status(500).send({ status: "error", error: e.message })
    })
})

app.put('/api/products/:pid', (req, res) => {
    let product = req.body;
    let productToUpdate = req.params.pid;

    if (!product.title || !product.description || !product.price || !product.category || !product.code || !product.stock) {
        return res.status(400).send({ status: "error", error: "Incomplete values" })
    }

    const p = ProductManager.crearProducto(product.title, product.description, product.price, product.category, product.thumbnail, product.code, product.stock, true);

    console.log(p);

    ProductManager.updateProduct(productToUpdate, p).then((data) => {
        if (data === true) {
            console.log("Successful update for product with ID ", productToUpdate);
            res.send({ status: "success", message: "Product updated" })
        }else{
            return res.status(404).send({ status: "error", error:"Product not found"})
        }
    }).catch((e) => {
        console.log(e.message);
        return res.status(500).send({ status: "error", error: e.message })
    })

})

app.delete("/api/products/:pid", (req, res) => {
    const productToDelete = req.params.pid;
    ProductManager.deleteProduct(productToDelete).then((data) => {
        if(data === true){
            console.log("Deleted product with ID ", productToDelete);
            res.send({ status: "success", message: "Product deleted" })
        }else{
            return res.status(404).send({ status: "error", error:"Product not found"})
        }
    }).catch((e) => {
        console.log(e.message);
        return res.status(500).send({ status: "error", error: e.message })
    })
})

app.get("/", async (req, res) => {
    res.send("You have to enter /products, /products/<idsearched> or /productoRandom");
});


