// 🔥 GLOBAL CART (from backend)
let cart = []

// 🚀 LOAD CART FROM BACKEND
async function loadCart() {
    try {
        const res = await fetch("/api/cart")
        cart = await res.json()

        displayCartProduct()
        saveCardValues()
        updateCartCount()
    } catch (error) {
        console.error("Error loading cart:", error)
    }
}


// 🧱 DISPLAY CART PRODUCTS
function displayCartProduct() {
    let results = ""
    const cartProduct = document.getElementById("cart-product")

    cart.forEach((item) => {
        results += `
        <tr class="cart-item">
            <td></td>
            <td class="cart-image">
                <img src="${item.img?.singleImage || ''}" alt="" data-id=${item._id} class="cart-product-image">
                <i class="bi bi-x delete-cart" data-id=${item._id}></i>
            </td>
            <td>${item.name}</td>
            <td>$${Number(item.price).toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
        `
    })

    cartProduct.innerHTML = results

    removeCartItem()
    cartProductRoute()
}


// 🔗 PRODUCT CLICK ROUTE
function cartProductRoute() {
    const images = document.querySelectorAll(".cart-product-image")

    images.forEach((image) => {
        image.addEventListener("click", (e) => {
            const imageId = e.target.dataset.id
            localStorage.setItem("productId", imageId)
            window.location.href = "single-product.html"
        })
    })
}


// ❌ REMOVE ITEM FROM CART (DB)
function removeCartItem() {

    const btnDeleteCart = document.querySelectorAll(".delete-cart")

    btnDeleteCart.forEach((button) => {
        button.addEventListener("click", async (e) => {

            const id = e.target.dataset.id

            try {
                await fetch(`/api/cart/${id}`, {
                    method: "DELETE"
                })

                loadCart() // 🔥 reload updated cart

            } catch (error) {
                console.error("Error removing item:", error)
            }

        })
    })
}


// 🧮 CART TOTAL CALCULATION
function saveCardValues() {

    const cartTotal = document.getElementById("cart-total")
    const subTotal = document.getElementById("subtotal")
    const fastCargo = document.getElementById("fast-cargo")

    const fastCargoPrice = 15
    let itemsTotal = 0

    cart.forEach((item) => {
        itemsTotal += item.price * item.quantity
    })

    subTotal.innerHTML = `₹${itemsTotal.toFixed(2)}`
    cartTotal.innerHTML = `₹${itemsTotal.toFixed(2)}`

    if (fastCargo) {
        fastCargo.addEventListener("change", (e) => {
            if (e.target.checked) {
                cartTotal.innerHTML = `₹${(itemsTotal + fastCargoPrice).toFixed(2)}`
            } else {
                cartTotal.innerHTML = `₹${itemsTotal.toFixed(2)}`
            }
        })
    }
}


// 🔢 UPDATE CART COUNT (HEADER)
async function updateCartCount() {
    try {
        const res = await fetch("/api/cart")
        const data = await res.json()

        document.querySelector(".header-cart-count").innerHTML = data.length
    } catch (error) {
        console.error("Error updating cart count:", error)
    }
}


// 🚀 INITIAL LOAD
loadCart()