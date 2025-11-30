// ==================== CHECKOUT & ORDER MANAGEMENT ====================

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

function clearUserCart() {
    const cartKey = getCartKey();
    localStorage.removeItem(cartKey);
}

// Load thông tin giỏ hàng khi vào trang checkout
function loadCheckoutSummary() {
    const cart = getUserCart();
    const orderSummary = document.getElementById('orderSummary');
    
    if (!orderSummary) return;
    
    if (cart.length === 0) {
        orderSummary.innerHTML = '<p class="text-muted">Giỏ hàng trống</p>';
        return;
    }
    
    let subtotal = 0;
    let html = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        html += `
            <div class="d-flex gap-3 mb-3 pb-3 border-bottom">
                <img src="${item.image}" alt="${item.name}" class="rounded" style="width: 60px; height: 60px; object-fit: contain;">
                <div class="flex-fill">
                    <h6 class="mb-1">${item.name}</h6>
                    <p class="text-muted small mb-1">x${item.quantity}</p>
                    <p class="text-danger fw-bold mb-0">${formatCurrency(itemTotal)}</p>
                </div>
            </div>
        `;
    });
    
    orderSummary.innerHTML = html;
    
    // Cập nhật tổng tiền
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('totalAmount').textContent = formatCurrency(subtotal);
    
    // Load thông tin user nếu đã đăng nhập
    const user = checkLogin();
    if (user) {
        document.getElementById('customerName').value = user.name || '';
        document.getElementById('customerEmail').value = user.email || '';
        document.getElementById('customerPhone').value = user.phone || '';
    }
}

// Đặt hàng
function placeOrder() {
    // Kiểm tra đăng nhập
    const user = requireLogin();
    if (!user) return;
    
    // Validate form
    const form = document.getElementById('checkoutForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Lấy giỏ hàng
    const cart = getUserCart();
    if (cart.length === 0) {
        alert('Giỏ hàng trống!');
        return;
    }
    
    // Lấy thông tin đơn hàng
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const customerCity = document.getElementById('customerCity').value;
    const customerDistrict = document.getElementById('customerDistrict').value;
    const customerWard = document.getElementById('customerWard').value;
    const orderNote = document.getElementById('orderNote').value;
    
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const paymentNames = {
        'cod': 'Thanh toán khi nhận hàng',
        'banking': 'Chuyển khoản ngân hàng',
        'momo': 'Ví MoMo',
        'card': 'Thẻ tín dụng/ghi nợ'
    };
    
    // Tính tổng tiền
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });
    
    // Tạo đơn hàng
    const order = {
        id: Date.now(),
        userId: user.id,
        orderNumber: 'DH' + Date.now(),
        customerName: customerName,
        customerPhone: customerPhone,
        customerEmail: customerEmail,
        address: `${customerAddress}, ${customerWard}, ${customerDistrict}, ${customerCity}`,
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity
        })),
        subtotal: total,
        shippingFee: 0,
        discount: 0,
        total: total,
        paymentMethod: paymentMethod,
        paymentMethodName: paymentNames[paymentMethod],
        status: 'Chờ xác nhận',
        note: orderNote,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Lưu đơn hàng
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Xóa giỏ hàng của user
    clearUserCart();
    
    // Chuyển đến trang xác nhận
    sessionStorage.setItem('lastOrderId', order.id);
    window.location.href = 'order-success.html';
}

// Load trang thành công
function loadOrderSuccess() {
    const orderId = sessionStorage.getItem('lastOrderId');
    if (!orderId) {
        window.location.href = 'index.html';
        return;
    }
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.id == orderId);
    
    if (!order) {
        window.location.href = 'index.html';
        return;
    }
    
    const container = document.getElementById('orderSuccessDetails');
    if (!container) return;
    
    let itemsHtml = '';
    order.items.forEach(item => {
        itemsHtml += `
            <div class="d-flex gap-3 mb-3 pb-3 border-bottom">
                <img src="${item.image}" alt="${item.name}" class="rounded" style="width: 60px; height: 60px; object-fit: contain;">
                <div class="flex-fill">
                    <h6 class="mb-1">${item.name}</h6>
                    <p class="text-muted small mb-1">Số lượng: ${item.quantity}</p>
                    <p class="text-danger fw-bold mb-0">${formatCurrency(item.price * item.quantity)}</p>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = `
        <div class="card shadow-sm border-0 rounded-3">
            <div class="card-body p-4">
                <div class="text-center mb-4">
                    <div class="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
                        <i class="fas fa-check fa-3x"></i>
                    </div>
                    <h3 class="text-success mb-2">Đặt hàng thành công!</h3>
                    <p class="text-muted">Cảm ơn bạn đã mua hàng tại Thế Giới Di Động</p>
                </div>
                
                <div class="bg-light p-3 rounded-3 mb-4">
                    <div class="row">
                        <div class="col-md-6 mb-2">
                            <strong>Mã đơn hàng:</strong>
                            <span class="text-primary">${order.orderNumber}</span>
                        </div>
                        <div class="col-md-6 mb-2">
                            <strong>Ngày đặt:</strong>
                            <span>${new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                        </div>
                        <div class="col-md-6 mb-2">
                            <strong>Trạng thái:</strong>
                            <span class="badge bg-warning">${order.status}</span>
                        </div>
                        <div class="col-md-6 mb-2">
                            <strong>Thanh toán:</strong>
                            <span>${order.paymentMethodName}</span>
                        </div>
                    </div>
                </div>
                
                <h5 class="mb-3 border-bottom pb-2">Thông tin nhận hàng</h5>
                <div class="mb-4">
                    <p class="mb-1"><strong>Người nhận:</strong> ${order.customerName}</p>
                    <p class="mb-1"><strong>Số điện thoại:</strong> ${order.customerPhone}</p>
                    <p class="mb-1"><strong>Địa chỉ:</strong> ${order.address}</p>
                </div>
                
                <h5 class="mb-3 border-bottom pb-2">Sản phẩm đã đặt</h5>
                <div class="mb-4">
                    ${itemsHtml}
                </div>
                
                <div class="border-top pt-3">
                    <div class="d-flex justify-content-between mb-2">
                        <span>Tạm tính:</span>
                        <span class="fw-bold">${formatCurrency(order.subtotal)}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Phí vận chuyển:</span>
                        <span class="text-success fw-bold">Miễn phí</span>
                    </div>
                    <div class="border-top pt-3 d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Tổng cộng:</h5>
                        <h4 class="mb-0 text-danger fw-bold">${formatCurrency(order.total)}</h4>
                    </div>
                </div>
                
                <div class="alert alert-info mt-4">
                    <i class="fas fa-info-circle"></i> 
                    Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.
                </div>
                
                <div class="d-grid gap-2 mt-4">
                    <a href="account.html" class="btn btn-primary">
                        <i class="fas fa-list"></i> Xem đơn hàng của tôi
                    </a>
                    <a href="index.html" class="btn btn-outline-secondary">
                        <i class="fas fa-home"></i> Về trang chủ
                    </a>
                </div>
            </div>
        </div>
    `;
    
    // Xóa session
    sessionStorage.removeItem('lastOrderId');
}

// Khởi tạo
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        // Nếu ở trang checkout
        if (document.getElementById('checkoutForm')) {
            // Kiểm tra đăng nhập
            const user = requireLogin();
            if (user) {
                loadCheckoutSummary();
            }
        }
        
        // Nếu ở trang order success
        if (document.getElementById('orderSuccessDetails')) {
            loadOrderSuccess();
        }
    });
}
