// Kiểm tra đăng nhập
function checkAuth() {
    if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'admin-login.html';
    } else {
        const username = sessionStorage.getItem('adminUsername');
        if (username) {
            document.getElementById('adminName').textContent = username;
        }
    }
}

// Đăng xuất
function logout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminUsername');
        window.location.href = 'admin-login.html';
    }
}

// Toggle sidebar (mobile)
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

// Hiển thị section
function showSection(sectionName) {
    // Ẩn tất cả sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Hiển thị section được chọn
    document.getElementById('section-' + sectionName).style.display = 'block';
    
    // Cập nhật active menu
    const menuItems = document.querySelectorAll('.sidebar-menu a');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('a').classList.add('active');
    
    // Cập nhật tiêu đề
    const titles = {
        'dashboard': 'Dashboard',
        'products': 'Quản lý sản phẩm',
        'orders': 'Quản lý đơn hàng',
        'customers': 'Danh sách khách hàng',
        'reviews': 'Quản lý đánh giá',
        'banners': 'Quản lý Banner',
        'settings': 'Cài đặt hệ thống'
    };
    document.getElementById('pageTitle').textContent = titles[sectionName];
}

// Load dữ liệu dashboard
function loadDashboard() {
    // Load từ localStorage nếu có
    const storedProducts = JSON.parse(localStorage.getItem('products'));
    if (storedProducts) {
        window.products = storedProducts;
    }
    
    // Đếm sản phẩm
    const totalProducts = window.products ? window.products.length : 0;
    document.getElementById('totalProducts').textContent = totalProducts;
    
    // Đếm đơn hàng từ localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    document.getElementById('totalOrders').textContent = orders.length;
    
    // Đếm khách hàng
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    document.getElementById('totalCustomers').textContent = customers.length;
    
    // Tính tổng doanh thu
    let totalRevenue = 0;
    orders.forEach(order => {
        if (order.total) {
            totalRevenue += order.total;
        }
    });
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
    
    // Hiển thị đơn hàng gần đây
    loadRecentOrders();
}

// Load đơn hàng gần đây
function loadRecentOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const tbody = document.getElementById('recentOrdersTable');
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Chưa có đơn hàng nào</td></tr>';
        return;
    }
    
    // Sắp xếp và lấy 5 đơn mới nhất
    const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    
    tbody.innerHTML = recentOrders.map(order => `
        <tr>
            <td>${order.orderNumber || '#' + order.id}</td>
            <td>${order.customerName || 'Khách hàng'}</td>
            <td>${order.items ? order.items.length : 0} sản phẩm</td>
            <td>${formatCurrency(order.total || 0)}</td>
            <td><span class="badge bg-${getStatusColor(order.status)}">${order.status || 'Chờ xác nhận'}</span></td>
            <td>${new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
        </tr>
    `).join('');
}

// Load sản phẩm
function loadProducts() {
    // Load từ localStorage nếu có
    const storedProducts = JSON.parse(localStorage.getItem('products'));
    if (storedProducts) {
        // Update global products array
        window.products = storedProducts;
    }
    
    const tbody = document.getElementById('productsTable');
    
    if (!window.products || window.products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Chưa có sản phẩm nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = window.products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: contain;"></td>
            <td>${product.name}</td>
            <td>${product.brand}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${product.stock || 'Còn hàng'}</td>
            <td><span class="badge bg-success">Hoạt động</span></td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Chỉnh sửa sản phẩm
function editProduct(id) {
    const product = window.products.find(p => p.id === id);
    if (product) {
        // Điền dữ liệu vào form
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productBrand').value = product.brand;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productOldPrice').value = product.oldPrice || '';
        document.getElementById('productRam').value = product.ram;
        document.getElementById('productStorage').value = product.storage;
        document.getElementById('productRating').value = product.rating || 5;
        document.getElementById('productImage').value = product.image;
        document.getElementById('productCategory').value = product.category || '';
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productHot').checked = product.hot || false;
        document.getElementById('productBestSelling').checked = product.bestSelling || false;
        
        // Đổi tiêu đề modal
        document.getElementById('productModalTitle').textContent = 'Chỉnh sửa sản phẩm';
        
        // Hiển thị modal
        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();
    }
}

// Hiển thị modal thêm sản phẩm
function showAddProductModal() {
    // Reset form
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productModalTitle').textContent = 'Thêm sản phẩm mới';
    
    // Hiển thị modal
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

// Lưu sản phẩm (thêm mới hoặc cập nhật)
function saveProduct() {
    const form = document.getElementById('productForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const productId = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('productName').value,
        brand: document.getElementById('productBrand').value,
        price: parseInt(document.getElementById('productPrice').value),
        oldPrice: parseInt(document.getElementById('productOldPrice').value) || null,
        ram: document.getElementById('productRam').value,
        storage: document.getElementById('productStorage').value,
        rating: parseFloat(document.getElementById('productRating').value),
        image: document.getElementById('productImage').value,
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        hot: document.getElementById('productHot').checked,
        bestSelling: document.getElementById('productBestSelling').checked,
        specs: {
            'Màn hình': 'Chưa cập nhật',
            'Camera sau': 'Chưa cập nhật',
            'Camera trước': 'Chưa cập nhật',
            'CPU': 'Chưa cập nhật',
            'RAM': document.getElementById('productRam').value,
            'Bộ nhớ trong': document.getElementById('productStorage').value,
            'Pin': 'Chưa cập nhật'
        }
    };
    
    if (productId) {
        // Cập nhật sản phẩm
        const index = window.products.findIndex(p => p.id == productId);
        if (index !== -1) {
            productData.id = parseInt(productId);
            productData.discount = productData.oldPrice ? Math.round(((productData.oldPrice - productData.price) / productData.oldPrice) * 100) : 0;
            window.products[index] = { ...window.products[index], ...productData };
            showNotification('Cập nhật sản phẩm thành công!', 'success');
        }
    } else {
        // Thêm sản phẩm mới
        const newId = Math.max(...window.products.map(p => p.id)) + 1;
        productData.id = newId;
        productData.discount = productData.oldPrice ? Math.round(((productData.oldPrice - productData.price) / productData.oldPrice) * 100) : 0;
        window.products.push(productData);
        showNotification('Thêm sản phẩm thành công!', 'success');
    }
    
    // Lưu vào localStorage để đồng bộ
    localStorage.setItem('products', JSON.stringify(products));
    
    // Đóng modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    modal.hide();
    
    // Reload dữ liệu
    loadProducts();
    loadDashboard();
}

// Xóa sản phẩm
function deleteProduct(id) {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        const index = window.products.findIndex(p => p.id === id);
        if (index !== -1) {
            window.products.splice(index, 1);
            // Lưu vào localStorage
            localStorage.setItem('products', JSON.stringify(window.products));
            loadProducts();
            loadDashboard();
            showNotification('Đã xóa sản phẩm thành công!', 'success');
        }
    }
}

// Notification helper
function showNotification(message, type = 'success') {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8',
        warning: '#ffc107'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Load đơn hàng
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const tbody = document.getElementById('ordersTable');
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Chưa có đơn hàng nào</td></tr>';
        return;
    }
    
    // Sắp xếp theo thời gian mới nhất
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    tbody.innerHTML = orders.map((order, index) => `
        <tr>
            <td>${order.orderNumber || '#' + order.id}</td>
            <td>${order.customerName || 'Khách hàng'}</td>
            <td>${order.customerPhone || 'N/A'}</td>
            <td>${formatCurrency(order.total || 0)}</td>
            <td><span class="badge bg-${getStatusColor(order.status)}">${order.status || 'Chờ xác nhận'}</span></td>
            <td>${new Date(order.createdAt).toLocaleString('vi-VN')}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewOrder(${index})" title="Xem chi tiết">
                    <i class="fas fa-eye"></i>
                </button>
                ${order.status === 'Chờ xác nhận' ? `
                    <button class="btn btn-sm btn-success" onclick="approveOrder(${index})" title="Duyệt đơn">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="rejectOrder(${index})" title="Từ chối">
                        <i class="fas fa-times"></i>
                    </button>
                ` : order.status === 'Đã xác nhận' ? `
                    <button class="btn btn-sm btn-primary" onclick="shipOrder(${index})" title="Đang giao">
                        <i class="fas fa-shipping-fast"></i>
                    </button>
                ` : order.status === 'Đang giao' ? `
                    <button class="btn btn-sm btn-success" onclick="completeOrder(${index})" title="Hoàn thành">
                        <i class="fas fa-check-circle"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

// Duyệt đơn hàng
function approveOrder(index) {
    if (!confirm('Xác nhận duyệt đơn hàng này?')) return;
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (index >= 0 && index < orders.length) {
        orders[index].status = 'Đã xác nhận';
        orders[index].updatedAt = new Date().toISOString();
        orders[index].approvedBy = sessionStorage.getItem('adminUsername') || 'Admin';
        orders[index].approvedAt = new Date().toISOString();
        
        localStorage.setItem('orders', JSON.stringify(orders));
        loadOrders();
        loadRecentOrders();
        loadDashboard();
        showNotification('Đã duyệt đơn hàng thành công!', 'success');
    }
}

// Từ chối đơn hàng
function rejectOrder(index) {
    const reason = prompt('Nhập lý do từ chối đơn hàng:');
    if (!reason) return;
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (index >= 0 && index < orders.length) {
        orders[index].status = 'Đã hủy';
        orders[index].updatedAt = new Date().toISOString();
        orders[index].rejectedBy = sessionStorage.getItem('adminUsername') || 'Admin';
        orders[index].rejectedAt = new Date().toISOString();
        orders[index].rejectReason = reason;
        
        localStorage.setItem('orders', JSON.stringify(orders));
        loadOrders();
        loadRecentOrders();
        loadDashboard();
        showNotification('Đã từ chối đơn hàng!', 'info');
    }
}

// Chuyển sang đang giao
function shipOrder(index) {
    if (!confirm('Xác nhận đơn hàng đang được giao?')) return;
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (index >= 0 && index < orders.length) {
        orders[index].status = 'Đang giao';
        orders[index].updatedAt = new Date().toISOString();
        orders[index].shippedAt = new Date().toISOString();
        
        localStorage.setItem('orders', JSON.stringify(orders));
        loadOrders();
        loadRecentOrders();
        showNotification('Đã cập nhật trạng thái đang giao!', 'success');
    }
}

// Hoàn thành đơn hàng
function completeOrder(index) {
    if (!confirm('Xác nhận đơn hàng đã hoàn thành?')) return;
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (index >= 0 && index < orders.length) {
        orders[index].status = 'Hoàn thành';
        orders[index].updatedAt = new Date().toISOString();
        orders[index].completedAt = new Date().toISOString();
        
        localStorage.setItem('orders', JSON.stringify(orders));
        loadOrders();
        loadRecentOrders();
        loadDashboard();
        showNotification('Đơn hàng đã hoàn thành!', 'success');
    }
}

// Xem chi tiết đơn hàng
function viewOrder(index) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (index >= 0 && index < orders.length) {
        const order = orders[index];
        
        // Điền dữ liệu vào form
        document.getElementById('orderIndex').value = index;
        document.getElementById('orderCustomerName').value = order.customerName || '';
        document.getElementById('orderPhone').value = order.customerPhone || '';
        document.getElementById('orderAddress').value = order.address || '';
        document.getElementById('orderStatus').value = order.status || 'Chờ xác nhận';
        document.getElementById('orderTotal').value = order.total || 0;
        document.getElementById('orderNote').value = order.note || '';
        
        // Đổi tiêu đề modal
        document.getElementById('orderModalTitle').textContent = 'Chi tiết đơn hàng ' + (order.orderNumber || '#' + order.id);
        
        // Hiển thị modal
        const modal = new bootstrap.Modal(document.getElementById('orderModal'));
        modal.show();
    }
}

// Lưu đơn hàng
function saveOrder() {
    const form = document.getElementById('orderForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = parseInt(document.getElementById('orderIndex').value);
    
    if (orderIndex >= 0 && orderIndex < orders.length) {
        orders[orderIndex].customerName = document.getElementById('orderCustomerName').value;
        orders[orderIndex].customerPhone = document.getElementById('orderPhone').value;
        orders[orderIndex].address = document.getElementById('orderAddress').value;
        orders[orderIndex].status = document.getElementById('orderStatus').value;
        orders[orderIndex].total = parseInt(document.getElementById('orderTotal').value);
        orders[orderIndex].note = document.getElementById('orderNote').value;
        orders[orderIndex].updatedAt = new Date().toISOString();
        
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Đóng modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('orderModal'));
        modal.hide();
        
        // Reload dữ liệu
        loadOrders();
        loadRecentOrders();
        loadDashboard();
        
        showNotification('Cập nhật đơn hàng thành công!', 'success');
    }
}

// Xóa các hàm cũ không dùng
// function updateOrderStatus - đã thay bằng approveOrder, rejectOrder, shipOrder, completeOrder

// Load khách hàng
function loadCustomers() {
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const tbody = document.getElementById('customersTable');
    
    if (customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Chưa có khách hàng nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = customers.map((customer, index) => `
        <tr>
            <td>${customer.id || index + 1}</td>
            <td>${customer.name}</td>
            <td>${customer.email || 'N/A'}</td>
            <td>${customer.phone}</td>
            <td>${customer.address || 'N/A'}</td>
            <td>${customer.orders || 0}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editCustomer(${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteCustomer(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Hiển thị modal thêm khách hàng
function showAddCustomerModal() {
    // Reset form
    document.getElementById('customerForm').reset();
    document.getElementById('customerId').value = '';
    document.getElementById('customerModalTitle').textContent = 'Thêm khách hàng mới';
    
    // Hiển thị modal
    const modal = new bootstrap.Modal(document.getElementById('customerModal'));
    modal.show();
}

// Chỉnh sửa khách hàng
function editCustomer(index) {
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    if (index >= 0 && index < customers.length) {
        const customer = customers[index];
        
        // Điền dữ liệu vào form
        document.getElementById('customerId').value = index;
        document.getElementById('customerName').value = customer.name;
        document.getElementById('customerEmail').value = customer.email || '';
        document.getElementById('customerPhone').value = customer.phone;
        document.getElementById('customerAddress').value = customer.address || '';
        
        // Đổi tiêu đề modal
        document.getElementById('customerModalTitle').textContent = 'Chỉnh sửa khách hàng';
        
        // Hiển thị modal
        const modal = new bootstrap.Modal(document.getElementById('customerModal'));
        modal.show();
    }
}

// Lưu khách hàng
function saveCustomer() {
    const form = document.getElementById('customerForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const customerId = document.getElementById('customerId').value;
    
    const customerData = {
        name: document.getElementById('customerName').value,
        email: document.getElementById('customerEmail').value,
        phone: document.getElementById('customerPhone').value,
        address: document.getElementById('customerAddress').value,
        orders: 0,
        registerDate: new Date().toLocaleDateString('vi-VN')
    };
    
    if (customerId !== '') {
        // Cập nhật khách hàng
        const index = parseInt(customerId);
        if (index >= 0 && index < customers.length) {
            customerData.id = customers[index].id || index + 1;
            customerData.orders = customers[index].orders || 0;
            customerData.registerDate = customers[index].registerDate;
            customers[index] = customerData;
            showNotification('Cập nhật khách hàng thành công!', 'success');
        }
    } else {
        // Thêm khách hàng mới
        customerData.id = customers.length > 0 ? Math.max(...customers.map(c => c.id || 0)) + 1 : 1;
        customers.push(customerData);
        showNotification('Thêm khách hàng thành công!', 'success');
    }
    
    localStorage.setItem('customers', JSON.stringify(customers));
    
    // Đóng modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('customerModal'));
    modal.hide();
    
    // Reload dữ liệu
    loadCustomers();
    loadDashboard();
}

// Xóa khách hàng
function deleteCustomer(index) {
    if (confirm('Bạn có chắc muốn xóa khách hàng này?')) {
        const customers = JSON.parse(localStorage.getItem('customers') || '[]');
        customers.splice(index, 1);
        localStorage.setItem('customers', JSON.stringify(customers));
        loadCustomers();
        loadDashboard();
        showNotification('Đã xóa khách hàng!', 'success');
    }
}

// Load đánh giá
function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const tbody = document.getElementById('reviewsTable');
    
    if (reviews.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Chưa có đánh giá nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = reviews.map((review, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${review.name}</td>
            <td>${review.product || 'N/A'}</td>
            <td>${'⭐'.repeat(review.rating || 5)}</td>
            <td>${review.comment ? review.comment.substring(0, 50) + '...' : 'N/A'}</td>
            <td>${review.date || new Date().toLocaleDateString('vi-VN')}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteReview(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Xóa đánh giá
function deleteReview(index) {
    if (confirm('Bạn có chắc muốn xóa đánh giá này?')) {
        const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        reviews.splice(index, 1);
        localStorage.setItem('reviews', JSON.stringify(reviews));
        loadReviews();
        showNotification('Đã xóa đánh giá!', 'success');
    }
}

// Load banners
function loadBanners() {
    const banners = JSON.parse(localStorage.getItem('banners') || '[]');
    const container = document.getElementById('bannersContainer');
    
    if (banners.length === 0) {
        container.innerHTML = '<div class="col-12 text-center text-muted">Chưa có banner nào</div>';
        return;
    }
    
    container.innerHTML = banners.map((banner, index) => `
        <div class="col-md-4">
            <div class="stat-card">
                <img src="${banner.image}" alt="Banner ${index + 1}" class="img-fluid mb-3" style="border-radius: 10px; max-height: 200px; object-fit: cover; width: 100%;">
                <div class="mb-2">
                    <h6>${banner.title || 'Banner ' + (index + 1)}</h6>
                    <small class="text-muted">${banner.link || 'Không có link'}</small>
                    ${banner.active !== false ? '<span class="badge bg-success ms-2">Đang hoạt động</span>' : '<span class="badge bg-secondary ms-2">Tạm dừng</span>'}
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-info flex-fill" onclick="editBanner(${index})">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteBanner(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Thêm banner
function showAddBannerModal() {
    // Reset form
    document.getElementById('bannerForm').reset();
    document.getElementById('bannerIndex').value = '';
    document.getElementById('bannerModalTitle').textContent = 'Thêm banner mới';
    document.getElementById('bannerActive').checked = true;
    
    // Hiển thị modal
    const modal = new bootstrap.Modal(document.getElementById('bannerModal'));
    modal.show();
}

// Chỉnh sửa banner
function editBanner(index) {
    const banners = JSON.parse(localStorage.getItem('banners') || '[]');
    if (index >= 0 && index < banners.length) {
        const banner = banners[index];
        
        // Điền dữ liệu vào form
        document.getElementById('bannerIndex').value = index;
        document.getElementById('bannerTitle').value = banner.title || '';
        document.getElementById('bannerImage').value = banner.image || '';
        document.getElementById('bannerLink').value = banner.link || '';
        document.getElementById('bannerActive').checked = banner.active !== false;
        
        // Đổi tiêu đề modal
        document.getElementById('bannerModalTitle').textContent = 'Chỉnh sửa banner';
        
        // Hiển thị modal
        const modal = new bootstrap.Modal(document.getElementById('bannerModal'));
        modal.show();
    }
}

// Lưu banner
function saveBanner() {
    const form = document.getElementById('bannerForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const banners = JSON.parse(localStorage.getItem('banners') || '[]');
    const bannerIndex = document.getElementById('bannerIndex').value;
    
    const bannerData = {
        title: document.getElementById('bannerTitle').value,
        image: document.getElementById('bannerImage').value,
        link: document.getElementById('bannerLink').value,
        active: document.getElementById('bannerActive').checked
    };
    
    if (bannerIndex !== '') {
        // Cập nhật banner
        const index = parseInt(bannerIndex);
        if (index >= 0 && index < banners.length) {
            banners[index] = bannerData;
            showNotification('Cập nhật banner thành công!', 'success');
        }
    } else {
        // Thêm banner mới
        banners.push(bannerData);
        showNotification('Thêm banner thành công!', 'success');
    }
    
    localStorage.setItem('banners', JSON.stringify(banners));
    
    // Đóng modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('bannerModal'));
    modal.hide();
    
    // Reload dữ liệu
    loadBanners();
}

// Xóa banner
function deleteBanner(index) {
    if (confirm('Bạn có chắc muốn xóa banner này?')) {
        const banners = JSON.parse(localStorage.getItem('banners') || '[]');
        banners.splice(index, 1);
        localStorage.setItem('banners', JSON.stringify(banners));
        loadBanners();
        showNotification('Đã xóa banner!', 'success');
    }
}

// Helper function: Lấy màu trạng thái
function getStatusColor(status) {
    const colors = {
        'Chờ xác nhận': 'warning',
        'Đã xác nhận': 'info',
        'Đang giao': 'primary',
        'Hoàn thành': 'success',
        'Đã hủy': 'danger',
        // Old statuses
        'Chờ xử lý': 'warning',
        'Đang xử lý': 'info'
    };
    return colors[status] || 'secondary';
}

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    // Load products from localStorage or use default
    const storedProducts = JSON.parse(localStorage.getItem('products'));
    if (storedProducts) {
        window.products = storedProducts;
    } else if (typeof products !== 'undefined') {
        window.products = products;
    }
    
    loadDashboard();
    loadProducts();
    loadOrders();
    loadCustomers();
    loadReviews();
    loadBanners();
    
    // Lấy dữ liệu mẫu từ localStorage nếu chưa có
    initSampleData();
});

// Khởi tạo dữ liệu mẫu (nếu chưa có)
function initSampleData() {
    // Đơn hàng mẫu
    if (!localStorage.getItem('orders')) {
        const sampleOrders = [
            {
                id: 1001,
                customerName: 'Nguyễn Văn A',
                phone: '0901234567',
                address: '123 Đường ABC, Q1, TP.HCM',
                total: 15990000,
                status: 'Chờ xử lý',
                date: '06/11/2025',
                items: [
                    { name: 'iPhone 15 Pro Max', quantity: 1, price: 15990000 }
                ]
            },
            {
                id: 1002,
                customerName: 'Trần Thị B',
                phone: '0907654321',
                address: '456 Đường XYZ, Q2, TP.HCM',
                total: 22990000,
                status: 'Đang xử lý',
                date: '05/11/2025',
                items: [
                    { name: 'Samsung Galaxy S24 Ultra', quantity: 1, price: 22990000 }
                ]
            }
        ];
        localStorage.setItem('orders', JSON.stringify(sampleOrders));
    }
    
    // Khách hàng mẫu
    if (!localStorage.getItem('customers')) {
        const sampleCustomers = [
            {
                id: 1,
                name: 'Nguyễn Văn A',
                email: 'nguyenvana@email.com',
                phone: '0901234567',
                orders: 3,
                registerDate: '01/10/2025'
            },
            {
                id: 2,
                name: 'Trần Thị B',
                email: 'tranthib@email.com',
                phone: '0907654321',
                orders: 1,
                registerDate: '15/10/2025'
            }
        ];
        localStorage.setItem('customers', JSON.stringify(sampleCustomers));
    }
}
