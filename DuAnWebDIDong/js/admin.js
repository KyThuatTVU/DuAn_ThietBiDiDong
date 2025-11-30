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
        'categories': 'Quản lý danh mục',
        'brands': 'Quản lý thương hiệu',
        'payments': 'Phương thức thanh toán',
        'vouchers': 'Mã giảm giá',
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
    
    // Vẽ các biểu đồ
    renderCharts();
}

// Vẽ các biểu đồ thống kê
function renderCharts() {
    renderRevenueChart();
    renderOrderStatusChart();
    renderTopProductsChart();
    renderBrandChart();
}

// Biểu đồ doanh thu theo tháng
function renderRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // Tính doanh thu theo tháng (6 tháng gần nhất)
    const months = [];
    const revenues = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('vi-VN', { month: 'short', year: '2-digit' });
        months.push(monthName);
        
        // Tính doanh thu trong tháng
        const monthRevenue = orders
            .filter(order => {
                const orderDate = new Date(order.createdAt || order.date);
                return orderDate.getMonth() === date.getMonth() && 
                       orderDate.getFullYear() === date.getFullYear() &&
                       (order.status === 'Hoàn thành' || order.status === 'Đang giao' || order.status === 'Đã xác nhận');
            })
            .reduce((sum, order) => sum + (order.total || 0), 0);
        
        revenues.push(monthRevenue / 1000000); // Đơn vị triệu đồng
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Doanh thu (triệu đồng)',
                data: revenues,
                borderColor: '#0066cc',
                backgroundColor: 'rgba(0, 102, 204, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#0066cc',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + 'M';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Biểu đồ đơn hàng theo trạng thái
function renderOrderStatusChart() {
    const ctx = document.getElementById('orderStatusChart');
    if (!ctx) return;
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // Đếm đơn hàng theo trạng thái
    const statusCounts = {
        'Chờ xác nhận': 0,
        'Đã xác nhận': 0,
        'Đang giao': 0,
        'Hoàn thành': 0,
        'Đã hủy': 0
    };
    
    orders.forEach(order => {
        const status = order.status || 'Chờ xác nhận';
        if (status === 'Chờ xử lý') {
            statusCounts['Chờ xác nhận']++;
        } else if (status === 'Đang xử lý') {
            statusCounts['Đã xác nhận']++;
        } else if (statusCounts[status] !== undefined) {
            statusCounts[status]++;
        }
    });
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: [
                    '#ffc107', // Chờ xác nhận - vàng
                    '#17a2b8', // Đã xác nhận - cyan
                    '#0066cc', // Đang giao - xanh
                    '#28a745', // Hoàn thành - xanh lá
                    '#dc3545'  // Đã hủy - đỏ
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        font: {
                            size: 11
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// Biểu đồ top sản phẩm bán chạy
function renderTopProductsChart() {
    const ctx = document.getElementById('topProductsChart');
    if (!ctx) return;
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const productSales = {};
    
    // Đếm số lượng bán của từng sản phẩm
    orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                const productName = item.name || 'Sản phẩm';
                productSales[productName] = (productSales[productName] || 0) + (item.quantity || 1);
            });
        }
    });
    
    // Sắp xếp và lấy top 5
    const sorted = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    const labels = sorted.map(item => item[0].length > 20 ? item[0].substring(0, 20) + '...' : item[0]);
    const data = sorted.map(item => item[1]);
    
    // Nếu không có dữ liệu, hiển thị mẫu
    if (labels.length === 0) {
        labels.push('Chưa có dữ liệu');
        data.push(0);
    }
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Số lượng bán',
                data: data,
                backgroundColor: [
                    'rgba(0, 102, 204, 0.8)',
                    'rgba(0, 102, 204, 0.7)',
                    'rgba(0, 102, 204, 0.6)',
                    'rgba(0, 102, 204, 0.5)',
                    'rgba(0, 102, 204, 0.4)'
                ],
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Biểu đồ sản phẩm theo thương hiệu
function renderBrandChart() {
    const ctx = document.getElementById('brandChart');
    if (!ctx) return;
    
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const brandCounts = {};
    
    // Đếm sản phẩm theo thương hiệu
    products.forEach(product => {
        const brand = product.brand || 'Khác';
        brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    });
    
    const labels = Object.keys(brandCounts);
    const data = Object.values(brandCounts);
    
    // Nếu không có dữ liệu, hiển thị mẫu
    if (labels.length === 0) {
        labels.push('Chưa có dữ liệu');
        data.push(0);
    }
    
    const colors = [
        '#001f3f', '#003366', '#0066cc', '#3399ff', 
        '#66b3ff', '#99ccff', '#cce6ff'
    ];
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
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
        // Cập nhật dropdown danh mục trước
        updateCategoryDropdown();
        
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
    // Cập nhật dropdown danh mục
    updateCategoryDropdown();
    
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
                <button class="btn btn-sm btn-outline-danger" onclick="deleteOrder(${index})" title="Xóa đơn hàng">
                    <i class="fas fa-trash"></i>
                </button>
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

// Xóa đơn hàng
function deleteOrder(index) {
    if (!confirm('Bạn có chắc muốn xóa đơn hàng này khỏi hệ thống?\nHành động này không thể hoàn tác!')) return;
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (index >= 0 && index < orders.length) {
        orders.splice(index, 1);
        localStorage.setItem('orders', JSON.stringify(orders));
        loadOrders();
        loadRecentOrders();
        loadDashboard();
        showNotification('Đã xóa đơn hàng khỏi hệ thống!', 'success');
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
    loadCategories();
    loadBrands();
    loadPayments();
    loadVouchers();
    loadSettings();
    
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
    
    // Thương hiệu mẫu
    if (!localStorage.getItem('brands')) {
        const sampleBrands = [
            { id: 1, name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', description: 'Thương hiệu điện thoại cao cấp từ Mỹ', active: true },
            { id: 2, name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', description: 'Thương hiệu điện tử hàng đầu Hàn Quốc', active: true },
            { id: 3, name: 'Xiaomi', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg', description: 'Thương hiệu công nghệ từ Trung Quốc', active: true },
            { id: 4, name: 'OPPO', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/OPPO_LOGO_2019.svg', description: 'Thương hiệu smartphone phổ biến', active: true },
            { id: 5, name: 'Vivo', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Vivo_logo.svg', description: 'Thương hiệu điện thoại giá tốt', active: true },
            { id: 6, name: 'Realme', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Realme_logo.svg', description: 'Thương hiệu smartphone trẻ trung', active: true }
        ];
        localStorage.setItem('brands', JSON.stringify(sampleBrands));
    }
    
    // Phương thức thanh toán mẫu
    if (!localStorage.getItem('paymentMethods')) {
        const samplePayments = [
            { id: 1, name: 'Thanh toán khi nhận hàng (COD)', logo: '', description: 'Thanh toán bằng tiền mặt khi nhận hàng', fee: 0, active: true },
            { id: 2, name: 'Chuyển khoản ngân hàng', logo: '', description: 'Chuyển khoản qua Internet Banking', fee: 0, active: true },
            { id: 3, name: 'Ví MoMo', logo: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png', description: 'Thanh toán qua ví điện tử MoMo', fee: 0, active: true },
            { id: 4, name: 'VNPay', logo: 'https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg', description: 'Thanh toán qua VNPay QR', fee: 0, active: true },
            { id: 5, name: 'ZaloPay', logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png', description: 'Thanh toán qua ví ZaloPay', fee: 0, active: true },
            { id: 6, name: 'Thẻ Visa/Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png', description: 'Thanh toán bằng thẻ tín dụng/ghi nợ', fee: 1.5, active: true }
        ];
        localStorage.setItem('paymentMethods', JSON.stringify(samplePayments));
    }
    
    // Voucher mẫu
    if (!localStorage.getItem('vouchers')) {
        const sampleVouchers = [
            { id: 1, code: 'WELCOME10', type: 'percent', value: 10, minOrder: 1000000, maxDiscount: 500000, quantity: 100, used: 0, expiry: '2025-12-31', description: 'Giảm 10% cho khách hàng mới', active: true },
            { id: 2, code: 'SALE50K', type: 'fixed', value: 50000, minOrder: 500000, maxDiscount: 50000, quantity: 50, used: 0, expiry: '2025-12-31', description: 'Giảm 50.000đ cho đơn từ 500.000đ', active: true },
            { id: 3, code: 'FREESHIP', type: 'fixed', value: 30000, minOrder: 0, maxDiscount: 30000, quantity: 200, used: 0, expiry: '2025-12-31', description: 'Miễn phí vận chuyển', active: true }
        ];
        localStorage.setItem('vouchers', JSON.stringify(sampleVouchers));
    }
    
    // Cài đặt mẫu
    if (!localStorage.getItem('settings')) {
        const defaultSettings = {
            websiteName: 'Thế Giới Di Động',
            email: 'info@thegioididong.com',
            hotline: '1800.6789',
            address: '123 Đường ABC, Quận 1, TP.HCM',
            shippingFee: 0,
            freeShipMin: 0
        };
        localStorage.setItem('settings', JSON.stringify(defaultSettings));
    }
}

// ==================== QUẢN LÝ DANH MỤC ====================

// Load danh mục
function loadCategories() {
    // Khởi tạo danh mục mặc định nếu chưa có
    if (!localStorage.getItem('categories')) {
        const defaultCategories = [
            { id: 1, name: 'Điện thoại', slug: 'phone', icon: 'fa-mobile-alt', description: 'Điện thoại thông minh', active: true },
            { id: 2, name: 'Máy tính bảng', slug: 'tablet', icon: 'fa-tablet-alt', description: 'Tablet các loại', active: true },
            { id: 3, name: 'Laptop', slug: 'laptop', icon: 'fa-laptop', description: 'Máy tính xách tay', active: true },
            { id: 4, name: 'Phụ kiện', slug: 'accessory', icon: 'fa-headphones', description: 'Phụ kiện điện thoại', active: true },
            { id: 5, name: 'Đồng hồ thông minh', slug: 'smartwatch', icon: 'fa-clock', description: 'Smartwatch', active: true }
        ];
        localStorage.setItem('categories', JSON.stringify(defaultCategories));
    }
    
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const tbody = document.getElementById('categoriesTable');
    
    if (!tbody) return;
    
    if (categories.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Chưa có danh mục nào</td></tr>';
        return;
    }
    
    // Đếm số sản phẩm theo danh mục
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    tbody.innerHTML = categories.map((category, index) => {
        const productCount = products.filter(p => p.category === category.slug).length;
        return `
            <tr>
                <td>${category.id}</td>
                <td><i class="fas ${category.icon || 'fa-folder'} fa-lg text-primary"></i></td>
                <td><strong>${category.name}</strong></td>
                <td><code>${category.slug}</code></td>
                <td>${category.description || 'N/A'}</td>
                <td><span class="badge bg-info">${productCount}</span></td>
                <td><span class="badge bg-${category.active ? 'success' : 'secondary'}">${category.active ? 'Hoạt động' : 'Tạm dừng'}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="editCategory(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCategory(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    // Cập nhật dropdown danh mục trong form sản phẩm
    updateCategoryDropdown();
}

// Cập nhật dropdown danh mục trong form thêm sản phẩm
function updateCategoryDropdown() {
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const select = document.getElementById('productCategory');
    
    if (!select) return;
    
    // Giữ lại giá trị hiện tại
    const currentValue = select.value;
    
    select.innerHTML = '<option value="">-- Chọn danh mục --</option>';
    categories.filter(c => c.active).forEach(category => {
        select.innerHTML += `<option value="${category.slug}">${category.name}</option>`;
    });
    
    // Khôi phục giá trị
    if (currentValue) {
        select.value = currentValue;
    }
}

// Hiển thị modal thêm danh mục
function showAddCategoryModal() {
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryIndex').value = '';
    document.getElementById('categoryModalTitle').textContent = 'Thêm danh mục mới';
    document.getElementById('categoryActive').checked = true;
    
    const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
    modal.show();
}

// Chỉnh sửa danh mục
function editCategory(index) {
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    if (index >= 0 && index < categories.length) {
        const category = categories[index];
        
        document.getElementById('categoryIndex').value = index;
        document.getElementById('categoryName').value = category.name;
        document.getElementById('categorySlug').value = category.slug;
        document.getElementById('categoryIcon').value = category.icon || '';
        document.getElementById('categoryDescription').value = category.description || '';
        document.getElementById('categoryActive').checked = category.active !== false;
        
        document.getElementById('categoryModalTitle').textContent = 'Chỉnh sửa danh mục';
        
        const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
        modal.show();
    }
}

// Lưu danh mục
function saveCategory() {
    const form = document.getElementById('categoryForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const categoryIndex = document.getElementById('categoryIndex').value;
    
    const categoryData = {
        name: document.getElementById('categoryName').value.trim(),
        slug: document.getElementById('categorySlug').value.trim().toLowerCase(),
        icon: document.getElementById('categoryIcon').value.trim(),
        description: document.getElementById('categoryDescription').value.trim(),
        active: document.getElementById('categoryActive').checked
    };
    
    if (categoryIndex === '') {
        // Thêm mới
        categoryData.id = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
        categories.push(categoryData);
        showNotification('Thêm danh mục thành công!', 'success');
    } else {
        // Cập nhật
        categoryData.id = categories[categoryIndex].id;
        categories[categoryIndex] = categoryData;
        showNotification('Cập nhật danh mục thành công!', 'success');
    }
    
    localStorage.setItem('categories', JSON.stringify(categories));
    
    // Đóng modal và reload
    bootstrap.Modal.getInstance(document.getElementById('categoryModal')).hide();
    loadCategories();
}

// Xóa danh mục
function deleteCategory(index) {
    if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return;
    
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Kiểm tra xem có sản phẩm nào đang dùng danh mục này không
    const categorySlug = categories[index].slug;
    const productCount = products.filter(p => p.category === categorySlug).length;
    
    if (productCount > 0) {
        if (!confirm(`Danh mục này đang có ${productCount} sản phẩm. Bạn vẫn muốn xóa?`)) {
            return;
        }
    }
    
    categories.splice(index, 1);
    localStorage.setItem('categories', JSON.stringify(categories));
    showNotification('Đã xóa danh mục!', 'success');
    loadCategories();
}

// ==================== QUẢN LÝ THƯƠNG HIỆU ====================

// Load thương hiệu
function loadBrands() {
    const brands = JSON.parse(localStorage.getItem('brands') || '[]');
    const tbody = document.getElementById('brandsTable');
    
    if (!tbody) return;
    
    if (brands.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Chưa có thương hiệu nào</td></tr>';
        return;
    }
    
    // Đếm số sản phẩm theo thương hiệu
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    tbody.innerHTML = brands.map((brand, index) => {
        const productCount = products.filter(p => p.brand === brand.name).length;
        return `
            <tr>
                <td>${brand.id}</td>
                <td>${brand.logo ? `<img src="${brand.logo}" alt="${brand.name}" style="height: 30px; width: auto;">` : '<i class="fas fa-image text-muted"></i>'}</td>
                <td><strong>${brand.name}</strong></td>
                <td>${brand.description || 'N/A'}</td>
                <td>${productCount}</td>
                <td><span class="badge bg-${brand.active ? 'success' : 'secondary'}">${brand.active ? 'Hoạt động' : 'Tạm dừng'}</span></td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="editBrand(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteBrand(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Hiển thị modal thêm thương hiệu
function showAddBrandModal() {
    document.getElementById('brandForm').reset();
    document.getElementById('brandIndex').value = '';
    document.getElementById('brandModalTitle').textContent = 'Thêm thương hiệu mới';
    document.getElementById('brandActive').checked = true;
    
    const modal = new bootstrap.Modal(document.getElementById('brandModal'));
    modal.show();
}

// Chỉnh sửa thương hiệu
function editBrand(index) {
    const brands = JSON.parse(localStorage.getItem('brands') || '[]');
    if (index >= 0 && index < brands.length) {
        const brand = brands[index];
        
        document.getElementById('brandIndex').value = index;
        document.getElementById('brandName').value = brand.name;
        document.getElementById('brandLogo').value = brand.logo || '';
        document.getElementById('brandDescription').value = brand.description || '';
        document.getElementById('brandActive').checked = brand.active !== false;
        
        document.getElementById('brandModalTitle').textContent = 'Chỉnh sửa thương hiệu';
        
        const modal = new bootstrap.Modal(document.getElementById('brandModal'));
        modal.show();
    }
}

// Lưu thương hiệu
function saveBrand() {
    const form = document.getElementById('brandForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const brands = JSON.parse(localStorage.getItem('brands') || '[]');
    const brandIndex = document.getElementById('brandIndex').value;
    
    const brandData = {
        name: document.getElementById('brandName').value,
        logo: document.getElementById('brandLogo').value,
        description: document.getElementById('brandDescription').value,
        active: document.getElementById('brandActive').checked
    };
    
    if (brandIndex !== '') {
        const index = parseInt(brandIndex);
        if (index >= 0 && index < brands.length) {
            brandData.id = brands[index].id;
            brands[index] = brandData;
            showNotification('Cập nhật thương hiệu thành công!', 'success');
        }
    } else {
        brandData.id = brands.length > 0 ? Math.max(...brands.map(b => b.id || 0)) + 1 : 1;
        brands.push(brandData);
        showNotification('Thêm thương hiệu thành công!', 'success');
    }
    
    localStorage.setItem('brands', JSON.stringify(brands));
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('brandModal'));
    modal.hide();
    
    loadBrands();
}

// Xóa thương hiệu
function deleteBrand(index) {
    if (confirm('Bạn có chắc muốn xóa thương hiệu này?')) {
        const brands = JSON.parse(localStorage.getItem('brands') || '[]');
        brands.splice(index, 1);
        localStorage.setItem('brands', JSON.stringify(brands));
        loadBrands();
        showNotification('Đã xóa thương hiệu!', 'success');
    }
}

// ==================== QUẢN LÝ PHƯƠNG THỨC THANH TOÁN ====================

// Load phương thức thanh toán
function loadPayments() {
    const payments = JSON.parse(localStorage.getItem('paymentMethods') || '[]');
    const tbody = document.getElementById('paymentsTable');
    
    if (!tbody) return;
    
    if (payments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Chưa có phương thức thanh toán nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = payments.map((payment, index) => `
        <tr>
            <td>${payment.id}</td>
            <td>${payment.logo ? `<img src="${payment.logo}" alt="${payment.name}" style="height: 30px; width: auto;">` : '<i class="fas fa-credit-card text-muted"></i>'}</td>
            <td><strong>${payment.name}</strong></td>
            <td>${payment.description || 'N/A'}</td>
            <td>${payment.fee > 0 ? payment.fee + '%' : 'Miễn phí'}</td>
            <td><span class="badge bg-${payment.active ? 'success' : 'secondary'}">${payment.active ? 'Hoạt động' : 'Tạm dừng'}</span></td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editPayment(${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletePayment(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Hiển thị modal thêm phương thức thanh toán
function showAddPaymentModal() {
    document.getElementById('paymentForm').reset();
    document.getElementById('paymentIndex').value = '';
    document.getElementById('paymentModalTitle').textContent = 'Thêm phương thức thanh toán';
    document.getElementById('paymentActive').checked = true;
    
    const modal = new bootstrap.Modal(document.getElementById('paymentModal'));
    modal.show();
}

// Chỉnh sửa phương thức thanh toán
function editPayment(index) {
    const payments = JSON.parse(localStorage.getItem('paymentMethods') || '[]');
    if (index >= 0 && index < payments.length) {
        const payment = payments[index];
        
        document.getElementById('paymentIndex').value = index;
        document.getElementById('paymentName').value = payment.name;
        document.getElementById('paymentLogo').value = payment.logo || '';
        document.getElementById('paymentDescription').value = payment.description || '';
        document.getElementById('paymentFee').value = payment.fee || 0;
        document.getElementById('paymentActive').checked = payment.active !== false;
        
        document.getElementById('paymentModalTitle').textContent = 'Chỉnh sửa phương thức thanh toán';
        
        const modal = new bootstrap.Modal(document.getElementById('paymentModal'));
        modal.show();
    }
}

// Lưu phương thức thanh toán
function savePayment() {
    const form = document.getElementById('paymentForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const payments = JSON.parse(localStorage.getItem('paymentMethods') || '[]');
    const paymentIndex = document.getElementById('paymentIndex').value;
    
    const paymentData = {
        name: document.getElementById('paymentName').value,
        logo: document.getElementById('paymentLogo').value,
        description: document.getElementById('paymentDescription').value,
        fee: parseFloat(document.getElementById('paymentFee').value) || 0,
        active: document.getElementById('paymentActive').checked
    };
    
    if (paymentIndex !== '') {
        const index = parseInt(paymentIndex);
        if (index >= 0 && index < payments.length) {
            paymentData.id = payments[index].id;
            payments[index] = paymentData;
            showNotification('Cập nhật phương thức thanh toán thành công!', 'success');
        }
    } else {
        paymentData.id = payments.length > 0 ? Math.max(...payments.map(p => p.id || 0)) + 1 : 1;
        payments.push(paymentData);
        showNotification('Thêm phương thức thanh toán thành công!', 'success');
    }
    
    localStorage.setItem('paymentMethods', JSON.stringify(payments));
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
    modal.hide();
    
    loadPayments();
}

// Xóa phương thức thanh toán
function deletePayment(index) {
    if (confirm('Bạn có chắc muốn xóa phương thức thanh toán này?')) {
        const payments = JSON.parse(localStorage.getItem('paymentMethods') || '[]');
        payments.splice(index, 1);
        localStorage.setItem('paymentMethods', JSON.stringify(payments));
        loadPayments();
        showNotification('Đã xóa phương thức thanh toán!', 'success');
    }
}

// ==================== QUẢN LÝ VOUCHER ====================

// Load vouchers
function loadVouchers() {
    const vouchers = JSON.parse(localStorage.getItem('vouchers') || '[]');
    const tbody = document.getElementById('vouchersTable');
    
    if (!tbody) return;
    
    if (vouchers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted">Chưa có mã giảm giá nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = vouchers.map((voucher, index) => {
        const isExpired = voucher.expiry && new Date(voucher.expiry) < new Date();
        const remaining = voucher.quantity - (voucher.used || 0);
        
        return `
            <tr class="${isExpired ? 'table-secondary' : ''}">
                <td>${voucher.id}</td>
                <td><code class="bg-light p-1">${voucher.code}</code></td>
                <td>${voucher.type === 'percent' ? 'Phần trăm' : 'Số tiền'}</td>
                <td>${voucher.type === 'percent' ? voucher.value + '%' : formatCurrency(voucher.value)}</td>
                <td>${formatCurrency(voucher.minOrder || 0)}</td>
                <td>${remaining}/${voucher.quantity}</td>
                <td>${voucher.expiry ? new Date(voucher.expiry).toLocaleDateString('vi-VN') : 'Không giới hạn'}</td>
                <td>
                    ${isExpired ? '<span class="badge bg-danger">Hết hạn</span>' : 
                      remaining <= 0 ? '<span class="badge bg-warning">Hết lượt</span>' :
                      voucher.active ? '<span class="badge bg-success">Hoạt động</span>' : '<span class="badge bg-secondary">Tạm dừng</span>'}
                </td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="editVoucher(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteVoucher(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Hiển thị modal thêm voucher
function showAddVoucherModal() {
    document.getElementById('voucherForm').reset();
    document.getElementById('voucherIndex').value = '';
    document.getElementById('voucherModalTitle').textContent = 'Thêm mã giảm giá mới';
    document.getElementById('voucherActive').checked = true;
    
    // Set default expiry date (30 days from now)
    const defaultExpiry = new Date();
    defaultExpiry.setDate(defaultExpiry.getDate() + 30);
    document.getElementById('voucherExpiry').value = defaultExpiry.toISOString().split('T')[0];
    
    const modal = new bootstrap.Modal(document.getElementById('voucherModal'));
    modal.show();
}

// Chỉnh sửa voucher
function editVoucher(index) {
    const vouchers = JSON.parse(localStorage.getItem('vouchers') || '[]');
    if (index >= 0 && index < vouchers.length) {
        const voucher = vouchers[index];
        
        document.getElementById('voucherIndex').value = index;
        document.getElementById('voucherCode').value = voucher.code;
        document.getElementById('voucherType').value = voucher.type;
        document.getElementById('voucherValue').value = voucher.value;
        document.getElementById('voucherMinOrder').value = voucher.minOrder || 0;
        document.getElementById('voucherMaxDiscount').value = voucher.maxDiscount || 0;
        document.getElementById('voucherQuantity').value = voucher.quantity;
        document.getElementById('voucherExpiry').value = voucher.expiry || '';
        document.getElementById('voucherDescription').value = voucher.description || '';
        document.getElementById('voucherActive').checked = voucher.active !== false;
        
        document.getElementById('voucherModalTitle').textContent = 'Chỉnh sửa mã giảm giá';
        
        const modal = new bootstrap.Modal(document.getElementById('voucherModal'));
        modal.show();
    }
}

// Lưu voucher
function saveVoucher() {
    const form = document.getElementById('voucherForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const vouchers = JSON.parse(localStorage.getItem('vouchers') || '[]');
    const voucherIndex = document.getElementById('voucherIndex').value;
    
    const voucherData = {
        code: document.getElementById('voucherCode').value.toUpperCase(),
        type: document.getElementById('voucherType').value,
        value: parseFloat(document.getElementById('voucherValue').value),
        minOrder: parseInt(document.getElementById('voucherMinOrder').value) || 0,
        maxDiscount: parseInt(document.getElementById('voucherMaxDiscount').value) || 0,
        quantity: parseInt(document.getElementById('voucherQuantity').value) || 100,
        expiry: document.getElementById('voucherExpiry').value,
        description: document.getElementById('voucherDescription').value,
        active: document.getElementById('voucherActive').checked
    };
    
    // Kiểm tra mã trùng
    const existingIndex = vouchers.findIndex(v => v.code === voucherData.code);
    if (existingIndex !== -1 && existingIndex !== parseInt(voucherIndex)) {
        showNotification('Mã giảm giá đã tồn tại!', 'error');
        return;
    }
    
    if (voucherIndex !== '') {
        const index = parseInt(voucherIndex);
        if (index >= 0 && index < vouchers.length) {
            voucherData.id = vouchers[index].id;
            voucherData.used = vouchers[index].used || 0;
            vouchers[index] = voucherData;
            showNotification('Cập nhật mã giảm giá thành công!', 'success');
        }
    } else {
        voucherData.id = vouchers.length > 0 ? Math.max(...vouchers.map(v => v.id || 0)) + 1 : 1;
        voucherData.used = 0;
        vouchers.push(voucherData);
        showNotification('Thêm mã giảm giá thành công!', 'success');
    }
    
    localStorage.setItem('vouchers', JSON.stringify(vouchers));
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('voucherModal'));
    modal.hide();
    
    loadVouchers();
}

// Xóa voucher
function deleteVoucher(index) {
    if (confirm('Bạn có chắc muốn xóa mã giảm giá này?')) {
        const vouchers = JSON.parse(localStorage.getItem('vouchers') || '[]');
        vouchers.splice(index, 1);
        localStorage.setItem('vouchers', JSON.stringify(vouchers));
        loadVouchers();
        showNotification('Đã xóa mã giảm giá!', 'success');
    }
}

// ==================== CÀI ĐẶT HỆ THỐNG ====================

// Load cài đặt
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    
    const settingWebsiteName = document.getElementById('settingWebsiteName');
    const settingEmail = document.getElementById('settingEmail');
    const settingHotline = document.getElementById('settingHotline');
    const settingAddress = document.getElementById('settingAddress');
    const settingShippingFee = document.getElementById('settingShippingFee');
    const settingFreeShipMin = document.getElementById('settingFreeShipMin');
    
    if (settingWebsiteName) settingWebsiteName.value = settings.websiteName || 'Thế Giới Di Động';
    if (settingEmail) settingEmail.value = settings.email || 'info@thegioididong.com';
    if (settingHotline) settingHotline.value = settings.hotline || '1800.6789';
    if (settingAddress) settingAddress.value = settings.address || '123 Đường ABC, Quận 1, TP.HCM';
    if (settingShippingFee) settingShippingFee.value = settings.shippingFee || 0;
    if (settingFreeShipMin) settingFreeShipMin.value = settings.freeShipMin || 0;
    
    // Thêm event listener cho form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const newSettings = {
                websiteName: document.getElementById('settingWebsiteName').value.trim(),
                email: document.getElementById('settingEmail').value.trim(),
                hotline: document.getElementById('settingHotline').value.trim(),
                address: document.getElementById('settingAddress').value.trim(),
                shippingFee: parseInt(document.getElementById('settingShippingFee').value) || 0,
                freeShipMin: parseInt(document.getElementById('settingFreeShipMin').value) || 0
            };
            
            localStorage.setItem('settings', JSON.stringify(newSettings));
            showNotification('Đã lưu cài đặt thành công!', 'success');
            console.log('Settings saved:', newSettings);
        });
    }
    
    // Thêm event listener cho form đổi mật khẩu
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmNewPassword').value;
            
            // Kiểm tra mật khẩu hiện tại (mặc định là 'admin')
            const savedPassword = localStorage.getItem('adminPassword') || 'admin';
            
            if (currentPassword !== savedPassword) {
                showNotification('Mật khẩu hiện tại không đúng!', 'error');
                return;
            }
            
            if (newPassword.length < 6) {
                showNotification('Mật khẩu mới phải có ít nhất 6 ký tự!', 'error');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showNotification('Mật khẩu xác nhận không khớp!', 'error');
                return;
            }
            
            localStorage.setItem('adminPassword', newPassword);
            passwordForm.reset();
            showNotification('Đổi mật khẩu thành công!', 'success');
            console.log('Password changed successfully');
        });
    }
}

// Lưu cài đặt (backup function)
function saveSettings(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const settings = {
        websiteName: document.getElementById('settingWebsiteName').value.trim(),
        email: document.getElementById('settingEmail').value.trim(),
        hotline: document.getElementById('settingHotline').value.trim(),
        address: document.getElementById('settingAddress').value.trim(),
        shippingFee: parseInt(document.getElementById('settingShippingFee').value) || 0,
        freeShipMin: parseInt(document.getElementById('settingFreeShipMin').value) || 0
    };
    
    localStorage.setItem('settings', JSON.stringify(settings));
    showNotification('Đã lưu cài đặt thành công!', 'success');
    console.log('Settings saved:', settings);
    return false;
}

// Đổi mật khẩu (backup function)
function changePassword(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    
    // Kiểm tra mật khẩu hiện tại (mặc định là 'admin')
    const savedPassword = localStorage.getItem('adminPassword') || 'admin';
    
    if (currentPassword !== savedPassword) {
        showNotification('Mật khẩu hiện tại không đúng!', 'error');
        return false;
    }
    
    if (newPassword.length < 6) {
        showNotification('Mật khẩu mới phải có ít nhất 6 ký tự!', 'error');
        return false;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('Mật khẩu xác nhận không khớp!', 'error');
        return false;
    }
    
    localStorage.setItem('adminPassword', newPassword);
    document.getElementById('passwordForm').reset();
    showNotification('Đổi mật khẩu thành công!', 'success');
    console.log('Password changed successfully');
    return false;
}
