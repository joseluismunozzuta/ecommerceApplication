const socket = io();
socket.emit('message', 'Im writing from a socket');

socket.on('generalevent', (arg1, arg2) => {
    console.log(arg1);
    console.log(arg2);
})

socket.on('productdeleted', productid => {
    let divtoDelete = document.getElementById("product" + productid);
    divtoDelete.remove();
})

socket.on('productadded', product => {
    addProduct(product);
})

function addProduct(product){
    let str = `<div class="img-card iCard-style1" id="product` + product.id + `">
    <div class="card-content">
        <div class="card-image">
            <span class="card-title">`+ product.title + `</span>
            <img src="` + product.thumbnail + `" alt="#">
            </div>
            <div class="card-text">
                <ul>
                    <li>ID: ` + product.id + `</li>
                    <li>Price: ` + product.price +`</li>
                    <li>Description: ` + product.descripcion + `</li>
                    <li>Category: ` + product.category +`</li>
                    <li>Status: ` + product.status + `</li>
                    <li>Stock: ` + product.stock + ` units</li>
                    </ul>
                </div>            
            </div>
        </div>`;

        console.log(str);

        let container = document.getElementById("container");
        let originalHtml = container.getInnerHTML();
        let lastHtml = str.concat(originalHtml);

        console.log(lastHtml);
        container.innerHTML = lastHtml;
    
}