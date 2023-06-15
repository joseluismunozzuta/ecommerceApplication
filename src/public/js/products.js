let pagina = document.getElementById("pagina").value;
let queryParams = {};
let nextBtn = document.getElementById("nextButton");
let prevBtn = document.getElementById("prevButton");
let prodContainer = document.getElementById("productContainer");
let sortSelector = document.getElementById("sortSelector");
let sortSelectorLabel = document.getElementById("sortLabel");
let sortOptions = document.getElementById("sortOptions");
let modalBg = document.getElementById("modalBg");
let modalPanel = document.getElementById("modalPanel");
let modalDeleteBg = document.getElementById("modalDeleteBg");
let modalDeletePanel = document.getElementById("modalDeletePanel");
let modalTitle = document.getElementById("modalTitle");
let modalPrice = document.getElementById("modalPrice");
let modalDescription = document.getElementById("modalDescription");
let modalImage = document.getElementById("modalImage");
let modalStock = document.getElementById("modalStock");
let modalCategory = document.getElementById("modalCategory");
let cartLength1 = document.getElementById("cartl1");
let cartLength2 = document.getElementById("cartl2");

/*************************PRODUCTS LIST****************************/

function highlightSortOptions() {
    const list = document.getElementById("sortOptions");
    const items = list.getElementsByTagName("li");

    for (let i = 0; i < items.length; i++) {

        let sortText = items[i].getElementsByTagName("div")[0].getElementsByTagName("span")[0].textContent;
        let sortValue = items[i].getElementsByTagName("div")[0].getElementsByTagName("span")[0].getAttribute("data-value");

        items[i].addEventListener("mouseover", function () {
            this.classList.add("bg-indigo-600");
            this.classList.add("text-white");
            this.classList.remove("text-gray-900");
        });

        items[i].addEventListener("mouseout", function () {
            this.classList.remove("bg-indigo-600");
            this.classList.remove("text-white");
            this.classList.add("text-gray-900");
        });

        items[i].addEventListener("click", function () {
            if (sortSelectorLabel.textContent !== sortText || sortSelectorLabel.textContent === "-") {
                sortSelectorLabel.textContent = sortText;
                queryParams.sort = sortValue;
                //pagina = 1;
                renderProducts();
            }
            hideSort();
        });
    }
}

function showSort() {
    if (sortOptions.classList.contains("show")) {
        hideSort();
    } else {
        sortOptions.classList.add("show");
    }
}

function hideSort() {
    sortOptions.classList.remove('show');
}

function renderNext() {
    pagina++;
    renderProducts();
}

function renderPrev() {
    pagina--;
    renderProducts();
}

const renderProducts = async () => {
    const prods = await getProducts();

    if (!prods.hasPrevPage) {
        prevBtn.disabled = true
    }
    if (prods.hasNextPage) {
        nextBtn.disabled = false
    }
    if (!prods.hasNextPage) {
        nextBtn.disabled = true
    }
    if (prods.hasPrevPage) {
        prevBtn.disabled = false
    }

    document.getElementById("paginationText").textContent = "Page " + prods.page + " of " + prods.totalPages;

    render(prods);

}

const render = (prods) => {
    prodContainer.innerHTML = "";
    prods.docs.map(prod => {
        const item = document.createElement('div');
        item.innerHTML = `<div class="group relative h-[26rem] my-10 cardImage">
        <div class="min-h-max aspect-w-1 aspect-h-1 w-full overflow-hidden
        rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none
        lg:h-full">
            <img
                src=${prod.thumbnail}
                alt="#" class="h-full w-full
                object-cover object-center lg:h-full lg:w-full">
                
            </div>
            <button type="button" id="${prod._id}" class="z-10 w-3/4 rounded-md bg-white bg-opacity-100 py-2 px-4 text-sm text-black quickview group-hover:opacity-100">
            Quick View
            </button>
            <div class="mt-4 flex justify-between">
                <div class="px-2">
                    <h3 class="text-sm text-gray-700">
                    <a>
                        <span aria-hidden="true" class="absolute inset-0"></span>
                        ${prod.title}
                    </a>
                    </h3>
                    <p class="mt-1 text-sm text-gray-500">${prod.stock} units</p>
                </div>
                <p class="text-sm font-medium text-gray-900">$${prod.price}</p>
            </div>
        </div>`;
        prodContainer.appendChild(item);
        const btnAdd = document.getElementById(prod._id);
        btnAdd.addEventListener('click', () => showModal(prod._id));

    })
}

async function showModal(id) {
    document.getElementById("loading").style.display = "flex";
    const result = await fetch(`/api/products/${id}`);
    document.getElementById("loading").style.display = "none";
    const prod = await result.json();
    modalTitle.innerText = prod.title;
    modalPrice.innerText = "$ " + prod.price;
    modalStock.innerText = prod.stock + " units";
    modalDescription.innerText = prod.description;
    modalCategory.innerText = prod.category;
    modalImage.src = prod.thumbnail;
    
    if (document.getElementById("modalActionContent")) {
        //If it exists, we are premium
        let modalContentContainer = document.getElementById("modalActionContent");
        modalContentContainer.innerHTML ="";
        let userid = document.getElementById("userId").value;

        if (userid == prod.owner) {

            modalContentContainer.innerHTML = `<div class="w-full">
            <h2 class="text-2xl p-12 text-center font-bold text-green-900 sm:p-10">
            This product is managed by you
            </h2></div>
            <div class="w-full flex flex-row justify-evenly items-center gap-2">
            <button type="submit" class="w-1/3 mt-6 flex
            items-center justify-center rounded-md
            border border-transparent bg-teal-600 py-2
            px-2 text-base font-medium text-white
            hover:bg-teal-600-700 focus:outline-none
            focus:ring-2 focus:ring-teal-500
            focus:ring-offset-2" id="prodActionBtn" data-value=${prod._id}
            onclick="editProd()">Edit</button>
    
            <button type="submit" class="w-1/3 mt-6 flex
            items-center justify-center rounded-md
            border border-transparent bg-red-600 py-2
            px-2 text-base font-medium text-white
            hover:bg-red-700 focus:outline-none
            focus:ring-2 focus:ring-red-500
            focus:ring-offset-2" id="deleteProdBtn" data-value=${prod._id}
            onclick="showDeleteModal()">Delete</button></div>`;
        } else {

            modalContentContainer.innerHTML = `<div class="w-full flex flex-row justify-evenly items-start gap-2">
            <button type="submit" class="mt-6 flex w-5/12
            items-end justify-center rounded-md
            border border-transparent bg-indigo-600 py-3
            px-8 text-base font-medium text-white
            hover:bg-indigo-700 focus:outline-none
            focus:ring-2 focus:ring-indigo-500
            focus:ring-offset-2 disabled:btn-disabled"
            id="prodActionBtn" data-value=${prod._id}
            onclick="addToCart()" disabled>Add to bag</button>

            <div class="form-control w-4/12 mt-6">
            <select class="select text-black bg-transparent 
            select-primary w-full max-w-xs"
                onchange="handleQuantity(this)" id="quantitySelect">
                <option class="text-black" disabled selected>Quantity</option>
                <option class="text-black">1</option>
                <option class="text-black">2</option>
                <option class="text-black">3</option>
                <option class="text-black">4</option>
                <option class="text-black">5</option>
                <option class="text-black">6</option>
                <option class="text-black">7</option>
                <option class="text-black">8</option>
                <option class="text-black">9</option>
                <option class="text-black">10</option>
            </select>
            <label class="label">
                <span class="text-black label-text-alt">Quantity</span>
            </label>
            </div></div>`
        }
    }else{
        document.getElementById("prodActionBtn").setAttribute("data-value", prod._id);
    }

    modalBg.classList.add("show");
    modalPanel.classList.add("show");

}

function hideModal() {
    modalBg.classList.remove('show');
    modalPanel.classList.remove('show');
    let modalactionbtn = document.getElementById("prodActionBtn");
    if (document.getElementById("quantitySelect")) {
        document.getElementById("quantitySelect").selectedIndex = 0;
        modalactionbtn.classList.add('disabled:btn-disabled');
        modalactionbtn.disabled = true;
    }
}

function showDeleteModal() {
    modalDeleteBg.classList.add("show");
    modalDeletePanel.classList.add("show");
}

function hideDeleteModal() {
    modalDeleteBg.classList.remove('show');
    modalDeletePanel.classList.remove('show');
}

function handleQuantity(select) {
    let selectValue = select.value;
    let modalactionbtn = document.getElementById("prodActionBtn");
    if (selectValue > 0) {
        modalactionbtn.classList.remove('disabled:btn-disabled');
        modalactionbtn.disabled = false;
    } else {
        modalactionbtn.classList.add('disabled:btn-disabled');
        modalactionbtn.disabled = true;
    }
}

async function addToCart() {
    document.getElementById("loading").style.display = "flex";
    let prodid = document.getElementById("prodActionBtn").getAttribute("data-value");
    let cartId = document.getElementById("cartId").value;

    await fetch(`/api/carts/${cartId}/products/${prodid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quantity: document.getElementById("quantitySelect").value
        })
    }).then((response) => response.json())
        .then((data) => {
            document.getElementById("loading").style.display = "none";
            if (data.status == "success") {
                let cartLength = data.payload.products.length;
                updateCartProductsLength(cartLength);
                alert('Se agregó el producto al carrito');
            } else {
                alert(data.error.cause);
            }
        }).catch((e) => {
            console.log(e);
        });

    hideModal();

}

function editProd() {
    let prodid = document.getElementById("prodActionBtn").getAttribute("data-value");
    window.location.href = `/views/editprod/${prodid}`;
}

async function deleteProd() {
    document.getElementById("loading").style.display = "flex";
    let prodid = document.getElementById("prodActionBtn").getAttribute("data-value");
    await fetch(`/api/products/${prodid}`, {
        method: "DELETE",
    }).then((response) => response.json())
        .then((data) => {
            if (data.status == "success") {
                document.getElementById("loading").style.display = "none";
                alert("Product successfully deleted");
                window.location.replace(`/views/products/${pagina}`);
            } else {
                alert(data.error);
            }
        })
        .catch((error) => console.log(error));
}

function updateCartProductsLength(l) {
    cartLength1.innerText = l;
    cartLength2.innerText = l + " products";
}

async function getProducts() {

    let limit = 10;

    if (queryParams.limit) {
        limit = parseInt(queryParams.limit);
    }

    let url = `/api/products?limit=${limit}&page=${pagina}`;

    if (queryParams.sort) {
        url = url.concat(`&sort=${queryParams.sort}`);
    }

    if (queryParams.queryCategory) {
        url = url.concat(`&query=${queryParams.queryCategory}`);
    }

    const products = await fetch(url);
    const result = await products.json();
    return result;
}

renderProducts();
highlightSortOptions();
