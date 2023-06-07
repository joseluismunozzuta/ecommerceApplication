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
let modalBtn = document.getElementById("prodActionBtn");
let logoutButton = document.getElementById("logout");
let cartLength1 = document.getElementById("cartl1");
let cartLength2 = document.getElementById("cartl2");

function goChat(){
    window.location.href = "http://localhost:3000/views/chat";
}

function goProfile() {
    window.location.href = "http://localhost:3000/api/sessions/profile";
}

function goLogin() {
    window.location.href = "http://localhost:3000/api/sessions/login";
}

function goSignUp() {
    window.location.href = "http://localhost:3000/api/sessions/signup";
}

function goCreateProd() {
    window.location.href = "http://localhost:3000/views/createproduct";
}

async function goCart() {
    window.location.href = "http://localhost:3000/views/mycart";
}

if (logoutButton) {
    logoutButton.addEventListener('click', async function () {
        await fetch("/api/sessions/logout", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status == "success") {
                    window.location.replace("http://localhost:3000/views/products");
                }
                else {
                    alert("Logout failed");
                }
            })
            .catch((error) => console.log(error));
    })
}


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
    const result = await fetch(`http://localhost:3000/api/products/${id}`);
    const prod = await result.json();
    modalTitle.innerText = prod.title;
    modalPrice.innerText = "$ " + prod.price;
    modalStock.innerText = prod.stock + " units";
    modalDescription.innerText = prod.description;
    modalCategory.innerText = prod.category;
    modalImage.src = prod.thumbnail;
    modalBtn.setAttribute("data-value", prod._id);
    modalBg.classList.add("show");
    modalPanel.classList.add("show");

}

function hideModal() {
    modalBg.classList.remove('show');
    modalPanel.classList.remove('show');
    if (document.getElementById("quantitySelect")) {
        document.getElementById("quantitySelect").selectedIndex = 0;
        modalBtn.classList.add('disabled:btn-disabled');
        modalBtn.disabled = true;
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
    if (selectValue > 0) {
        modalBtn.classList.remove('disabled:btn-disabled');
        modalBtn.disabled = false;
    } else {
        modalBtn.classList.add('disabled:btn-disabled');
        modalBtn.disabled = true;
    }
}

async function addToCart() {
    let prodid = modalBtn.getAttribute("data-value");
    let cartId = document.getElementById("cartId").value;

    await fetch(`http://localhost:3000/api/carts/${cartId}/products/${prodid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quantity: document.getElementById("quantitySelect").value
        })
    }).then((response) => response.json())
        .then((data) => {
            if (data.status == "success") {
                let cartLength = data.payload.products.length;
                updateCartProductsLength(cartLength);
                alert('Se agregó el producto al carrito');
            } else {
                alert('No se pudo agregar el producto al carrito');
            }
        }).catch((error) => console.log(error));

    hideModal();

}

function editProd() {
    let prodid = modalBtn.getAttribute("data-value");
    window.location.href = `http://localhost:3000/views/editprod/${prodid}`;
}

async function deleteProd() {
    let prodid = modalBtn.getAttribute("data-value");
    await fetch(`/api/products/${prodid}`, {
        method: "DELETE",
    }).then((response) => response.json())
        .then((data) => {
            if (data.status == "success") {
                console.log("query params: ");
                console.log(queryParams);
                console.log("page");
                console.log(pagina);
                alert("Product successfully deleted");
                window.location.replace(`http://localhost:3000/views/products/${pagina}`);
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

    console.log("Query params: ");
    console.log(queryParams);
    console.log("Pagina: " + pagina);

    let limit = 10;

    if (queryParams.limit) {
        limit = parseInt(queryParams.limit);
    }

    let url = `http://localhost:3000/api/products?limit=${limit}&page=${pagina}`;

    if (queryParams.sort) {
        url = url.concat(`&sort=${queryParams.sort}`);
    }

    if (queryParams.queryCategory) {
        url = url.concat(`&query=${queryParams.queryCategory}`);
    }
    console.log(url);
    const products = await fetch(url);
    const result = await products.json();
    return result;
}

renderProducts();
highlightSortOptions();
