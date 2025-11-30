// ==================== GET PRODUCT ID FROM URL ====================
function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

// ==================== LOAD PRODUCT DETAIL ====================
function loadProductDetail() {
    const productId = getProductIdFromURL();
    const product = products.find(p => p.id === productId);

    if (!product) {
        window.location.href = 'sanpham.html';
        return;
    }

    // Update breadcrumb
    const breadcrumb = document.getElementById('productBreadcrumb');
    if (breadcrumb) {
        breadcrumb.textContent = product.name;
    }

    // Update title
    document.title = `${product.name} - Thế Giới Di Động`;

    // Update main image
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = product.image;
        mainImage.alt = product.name;
    }

    // Generate thumbnails
    const thumbnails = document.querySelector('.image-thumbnails');
    if (thumbnails) {
        const images = [product.image, product.image, product.image, product.image];
        thumbnails.innerHTML = images.map((img, index) => `
            <img src="${img}" alt="${product.name}" 
                 class="${index === 0 ? 'active' : ''}" 
                 onclick="changeMainImage('${img}', this)">
        `).join('');
    }

    // Update product info
    const titleElement = document.getElementById('productTitle');
    if (titleElement) {
        titleElement.textContent = product.name;
    }

    const priceElement = document.getElementById('productPrice');
    if (priceElement) {
        priceElement.textContent = formatCurrency(product.price);
    }

    const oldPriceElement = document.getElementById('oldPrice');
    if (oldPriceElement && product.oldPrice) {
        oldPriceElement.textContent = formatCurrency(product.oldPrice);
    }

    const discountElement = document.getElementById('discount');
    if (discountElement && product.discount) {
        discountElement.textContent = `Giảm ${product.discount}%`;
    }

    // Update specs table
    const specsTable = document.getElementById('specsTable');
    if (specsTable && product.specs) {
        specsTable.innerHTML = Object.entries(product.specs).map(([key, value]) => `
            <tr>
                <td class="fw-bold" style="width: 30%;">${key}</td>
                <td>${value}</td>
            </tr>
        `).join('');
    }

    // Update description
    const descriptionElement = document.getElementById('productDescription');
    if (descriptionElement) {
        descriptionElement.innerHTML = `
            <p class="lead">${product.description}</p>
            <h5 class="mt-4">Đặc điểm nổi bật</h5>
            <ul>
                <li>Thiết kế sang trọng, tinh tế</li>
                <li>Hiệu năng mạnh mẽ, đa nhiệm mượt mà</li>
                <li>Camera chất lượng cao, chụp ảnh đẹp</li>
                <li>Pin trâu, sử dụng cả ngày</li>
                <li>Bảo hành chính hãng 12 tháng</li>
            </ul>
        `;
    }

    // Load related products
    loadRelatedProducts(product.brand, product.id);
}

// ==================== CHANGE MAIN IMAGE ====================
function changeMainImage(imageSrc, thumbnail) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = imageSrc;
    }

    // Update active thumbnail
    document.querySelectorAll('.image-thumbnails img').forEach(img => {
        img.classList.remove('active');
    });
    thumbnail.classList.add('active');
}

// ==================== QUANTITY CONTROLS ====================
function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    }
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput && parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
    }
}

// ==================== ADD TO CART ====================
// Hàm lấy cart key theo user
function getCartKey() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        return `cart_${user.email}`;
    }
    return 'cart_guest';
}

function getUserCart() {
    const cartKey = getCartKey();
    return JSON.parse(localStorage.getItem(cartKey)) || [];
}

function saveUserCart(cart) {
    const cartKey = getCartKey();
    localStorage.setItem(cartKey, JSON.stringify(cart));
}

function addToCart() {
    // Kiểm tra đăng nhập
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        if (confirm('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!\n\nBạn có muốn chuyển đến trang đăng nhập không?')) {
            window.location.href = 'login.html';
        }
        return;
    }

    const productId = getProductIdFromURL();
    const quantityInput = document.getElementById('quantity');
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

    const product = products.find(p => p.id === productId);
    if (!product) return;

    let cart = getUserCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }

    saveUserCart(cart);
    
    // Update cart count
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('#cartCount').forEach(el => {
        el.textContent = cartCount;
    });

    showNotification(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`, 'success');
}

// ==================== LOAD RELATED PRODUCTS ====================
function loadRelatedProducts(brand, excludeId) {
    const relatedContainer = document.getElementById('relatedProducts');
    if (!relatedContainer) return;

    const relatedProducts = products
        .filter(p => p.brand === brand && p.id !== excludeId)
        .slice(0, 4);

    if (relatedProducts.length === 0) {
        relatedContainer.innerHTML = '<p class="text-muted">Không có sản phẩm liên quan</p>';
        return;
    }

    relatedContainer.innerHTML = relatedProducts.map(product => renderProductCard(product)).join('');
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    loadProductDetail();
    updateCartCount();
});
