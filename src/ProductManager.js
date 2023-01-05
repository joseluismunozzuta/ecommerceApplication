import fs from 'fs';


class ProductManager {
    constructor(filename) {
        this.filename = filename;
    }

    crearProducto = (title, descripcion, price, category, thumbnail, code, stock, status) => {
        const p = new Object();
        p.title = title;
        p.descripcion = descripcion;
        p.price = price;
        p.category = category;
        p.thumbnail = thumbnail;
        p.code = code;
        p.stock = stock;
        p.status = status;
        return p;
    };

    async getProducts() {
        try {
            const contenido = await fs.promises.readFile(this.filename, "utf-8");
            const vacio = [];
            if (contenido === "") {
                console.log("No products");
                return vacio;
            } else {
                const obj = JSON.parse(contenido);
                console.log("Function getProducts()");
                return obj;
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    checkIfFileExists() {
        fs.open("./productos.txt", "r", 0o666, async (fileExists, file) => {
            if (file) {
                console.log("File alredy exists");
                return;
            } else {
                try {
                    await fs.promises.writeFile(this.filename, "");
                    console.log("productos.txt file created");
                    return;
                } catch (err) {
                    console.log(err.message);
                }
            }
        });
    }

    async addProduct(o) {
        const jsonObjects = [];
        let objetos = await this.getProducts();
        let maxId = 0;
        for (let ob of objetos) {
            jsonObjects.push(ob);
            if (ob.id > maxId) {
                maxId = parseInt(ob.id);
            }
        }
        if (maxId == 0) {
            o.id = 1;
            jsonObjects.push(o);
        } else {
            o.id = maxId + 1;
            jsonObjects.push(o);
        }

        let jsonString = JSON.stringify(jsonObjects);

        try {
            await fs.promises.writeFile(this.filename, jsonString);
            console.log("Product saved with ID: ");
            console.log(o.id);
            return o.id;
        } catch (err) {
            console.log(err.message);
        }
    }

    async getProductById(searchedId) {
        const obj = await this.getProducts();
        for (let o of obj) {
            if (o.id == searchedId) {
                console.log("The product searched is:");
                console.log(o);
                return o;
            }
        }
        console.log("There is no product with the specified ID");
        return null;
    }

    async updateProduct(searchedId, newProduct) {
        console.log(newProduct);
        const obj = await this.getProducts();
        const index = obj.findIndex((o) => o.id == searchedId);
        if(index === -1){
            console.log("Product not found");
            return false;
        }
        newProduct.id = searchedId;
        obj[index] = newProduct;
        let jsonString = JSON.stringify(obj);
        try {
            await fs.promises.writeFile(this.filename, jsonString);
            return true;
        }
        catch (err) {
            console.log(err.message);
        }
    }

    async deleteProduct(searchedId) {
        const obj = await this.getProducts();
        let index = 0;
        for (let o of obj) {
            if (o.id == searchedId) {
                obj.splice(index, 1);
                let jsonString = JSON.stringify(obj);
                try {
                    await fs.promises.writeFile(this.filename, jsonString);
                    console.log("Object deleted");
                    return true;
                } catch (err) {
                    console.log(err.message);
                }
            }
            index++;
        }
        console.log("There is no product with the specified ID");
        return false;
    }

    async countAllProds() {
        const objs = await this.getProducts();
        let cant = 0;
        for (let o of objs) {
            cant++;
        }
        return cant;
    }

    async deleteAll() {
        try {
            await fs.promises.writeFile(this.filename, "");
        } catch (err) {
            console.log(err.message);
        }
    }
}

const c = new ProductManager("./productos.json");

export default ProductManager;