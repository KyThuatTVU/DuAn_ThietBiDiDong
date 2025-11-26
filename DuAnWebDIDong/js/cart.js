// ==================== LOAD CART ====================
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCartElement = document.getElementById('emptyCart');
    const orderSummaryElement = document.getElementById('orderSummary');

    if (cart.length === 0) {
        if (cartItemsContainer) cartItemsContainer.style.display = 'none';
        if (emptyCartElement) emptyCartElement.style.display = 'block';
        if (orderSummaryElement) orderSummaryElement.style.display = 'none';
        return;
    }

    if (cartItemsContainer) cartItemsContainer.style.display = 'block';
    if (emptyCartElement) emptyCartElement.style.display = 'none';
    if (orderSummaryElement) orderSummaryElement.style.display = 'block';

    // Render cart items
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="row align-items-center">
                    <div class="col-md-2 col-3">
                        <img src="${item.image}" alt="${item.name}" class="img-fluid rounded">
                    </div>
                    <div class="col-md-4 col-9">
                        <h6 class="mb-1">${item.name}</h6>
                        <p class="text-muted small mb-0">${item.brand}</p>
                    </div>
                    <div class="col-md-2 col-4">
                        <div class="fw-bold text-danger">${formatCurrency(item.price)}</div>
                    </div>
                    <div class="col-md-2 col-4">
                        <div class="input-group input-group-sm quantity-input">
                            <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="form-control" value="${item.quantity}" min="1" 
                                   onchange="updateQuantity(${item.id}, this.value)">
                            <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-2 col-4 text-end">
                        <div class="fw-bold mb-2">${formatCurrency(item.price * item.quantity)}</div>
                        <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${item.id})">
                            <i class="fas fa-trash"></i> Xóa
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateOrderSummary(cart);
}

// ==================== UPDATE ORDER SUMMARY ====================
function updateOrderSummary(cart) {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discount = 0;
    const total = subtotal - discount;

    const subtotalElement = document.getElementById('subtotal');
    const discountElement = document.getElementById('discount');
    const totalElement = document.getElementById('total');

    if (subtotalElement) subtotalElement.textContent = formatCurrency(subtotal);
    if (discountElement) discountElement.textContent = formatCurrency(discount);
    if (totalElement) totalElement.textContent = formatCurrency(total);
}

// ==================== UPDATE QUANTITY ====================
function updateQuantity(productId, newQuantity) {
    newQuantity = parseInt(newQuantity);
    
    if (newQuantity < 1) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
        updateCartCount();
    }
}

// ==================== REMOVE ITEM ====================
function removeItem(productId) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
    showNotification('Đã xóa sản phẩm khỏi giỏ hàng!', 'info');
}

// ==================== APPLY VOUCHER ====================
function applyVoucher() {
    const voucherInput = document.getElementById('voucherInput');
    const voucherCode = voucherInput.value.trim().toUpperCase();

    // Sample vouchers
    const vouchers = {
        'SALE10': 10,
        'SALE20': 20,
        'FREESHIP': 0
    };

    if (vouchers[voucherCode]) {
        showNotification(`Áp dụng mã giảm giá ${voucherCode} thành công!`, 'success');
        
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const discount = subtotal * (vouchers[voucherCode] / 100);
        
        const discountElement = document.getElementById('discount');
        const totalElement = document.getElementById('total');
        
        if (discountElement) discountElement.textContent = formatCurrency(discount);
        if (totalElement) totalElement.textContent = formatCurrency(subtotal - discount);
    } else {
        showNotification('Mã giảm giá không hợp lệ!', 'danger');
    }
}

// ==================== CHECKOUT ====================
function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        showNotification('Giỏ hàng của bạn đang trống!', 'warning');
        return;
    }

    // Chuyển đến trang checkout (sẽ kiểm tra đăng nhập ở đó)
    window.location.href = 'checkout.html';
}

// ==================== FORMAT CURRENCY ====================
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// ==================== UPDATE CART COUNT ====================
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('#cartCount').forEach(el => {
        el.textContent = cartCount;
    });
}

// ==================== NOTIFICATION ====================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3`;
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'times-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCartCount();
});
