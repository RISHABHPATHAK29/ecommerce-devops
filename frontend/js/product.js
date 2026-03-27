import { product1, product2 } from "./glide.js"

// 🚀 ADD TO CART USING BACKEND ONLY
function addToCart(products) {
    const buttons = [...document.getElementsByClassName("add-to-cart")]

    buttons.forEach((button) => {
        button.addEventListener("click", async function (e) {

            const id = e.currentTarget.dataset.id
            const findProduct = products.find(
                (product) => product.id === Number(id)
            )

            console.log("Adding to backend:", findProduct)

            try {
                await fetch("/api/cart", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        productId: findProduct.id,
                        name: findProduct.name,
                        price: findProduct.price.newPrice
                    })
                })

                button.setAttribute("disabled", "disabled")

                // 🔥 Update cart count from backend
                updateCartCount()

            } catch (error) {
                console.error("Error adding to cart:", error)
            }
        })
    })
}


// 🔥 UPDATE CART COUNT FROM BACKEND
async function updateCartCount() {
    try {
        const res = await fetch("/api/cart")
        const data = await res.json()

        document.querySelector(".header-cart-count").innerHTML = data.length
    } catch (error) {
        console.error("Error updating cart count:", error)
    }
}


// 🔗 PRODUCT PAGE ROUTING (KEEP THIS)
function productRoute() {
    const productLink = document.getElementsByClassName("product-link")

    Array.from(productLink).forEach((button) => {
        button.addEventListener("click", (e) => {
            e.preventDefault()
            const id = e.target.dataset.id
            localStorage.setItem("productId", JSON.stringify(id))
            window.location.href = "single-product.html"
        })
    })
}


// 🔗 IMAGE ROUTE (KEEP THIS)
function productImageRoute() {
    const productImageLink = document.querySelectorAll(".product-image a .img2")

    productImageLink.forEach((item) => {
        item.addEventListener("click", (e) => {
            e.preventDefault()
            const id = e.target.dataset.id
            localStorage.setItem("productId", JSON.stringify(id))
            window.location.href = "single-product.html"
        })
    })
}


// 🚀 MAIN PRODUCT FUNCTION
async function productFunc(products) {

    const productsContainer = document.getElementById("product-list")
    const productsContainer2 = document.getElementById("product-list-2")

    let results = ""

    products.forEach((product) => {
        results += `
            <li class="product-item glide__slide">
                <div class="product-image">
                    <a href="">
                        <img src="${product.img.singleImage}" class="img1" />
                        <img src="${product.img.thumbs[1]}" class="img2" data-id="${product.id}" />
                    </a>
                </div>

                <div class="product-info">
                    <a href="#" class="product-title">${product.name}</a>

                    <ul class="product-star">
                        <li><i class="bi bi-star-fill"></i></li>
                        <li><i class="bi bi-star-fill"></i></li>
                        <li><i class="bi bi-star-fill"></i></li>
                        <li><i class="bi bi-star-fill"></i></li>
                        <li><i class="bi bi-star-half"></i></li>
                    </ul>

                    <div class="product-prices">
                        <strong>$${product.price.newPrice.toFixed(2)}</strong>
                        <span>$${product.price.oldPrice.toFixed(2)}</span>
                    </div>

                    <span>${product.discount}%</span>

                    <div class="product-links">
                        <button class="add-to-cart" data-id="${product.id}">
                            <i class="bi bi-basket-fill"></i>
                        </button>

                        <button><i class="bi bi-heart-fill"></i></button>

                        <a href="#" class="product-link" data-id="${product.id}">
                            <i class="bi bi-eye-fill"></i>
                        </a>

                        <a href="#"><i class="bi bi-share-fill"></i></a>
                    </div>
                </div>
            </li>
        `
    })

    if (productsContainer) productsContainer.innerHTML = results
    if (productsContainer2) productsContainer2.innerHTML = results

    addToCart(products)

    product1()
    product2()

    productRoute()
    productImageRoute()

    // 🔥 Load cart count on page load
    updateCartCount()
}

export default productFunc
