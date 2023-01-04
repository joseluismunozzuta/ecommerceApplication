import fs from 'fs';

const crearProducto = (title, descripcion, price, thumbnail, code, stock) => {
    const p = new Object();
    p.title = title;
    p.descripcion = descripcion;
    p.price = price;
    p.thumbnail = thumbnail;
    p.code = code;
    p.stock = stock;
    return p;
};
class ProductManager {
    constructor(filename) {
        this.filename = filename;
    }

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
                maxId = ob.id;
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

                    return;
                } catch (err) {
                    console.log(err.message);
                }
            }
            index++;
        }
        console.log("There is no product with the specified ID");
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