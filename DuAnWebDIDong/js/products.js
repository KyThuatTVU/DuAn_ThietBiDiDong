// Import products and utilities from main.js
// These will be available since main.js is loaded first

let allProducts = [...products];
let filteredProducts = [...products];
let currentPage = 1;
const productsPerPage = 12;

// ==================== FILTER PRODUCTS ====================
function filterProducts() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search')?.toLowerCase() || '';
    const category = urlParams.get('category') || '';
    const brand = urlParams.get('brand') || '';

    // Get selected filters
    const selectedPrices = Array.from(document.querySelectorAll('.filter-price:checked')).map(cb => cb.value);
    const selectedBrands = Array.from(document.querySelectorAll('.filter-brand:checked')).map(cb => cb.value);
    const selectedRAMs = Array.from(document.querySelectorAll('.filter-ram:checked')).map(cb => parseInt(cb.value));
    const selectedStorages = Array.from(document.querySelectorAll('.filter-storage:checked')).map(cb => parseInt(cb.value));

    filteredProducts = allProducts.filter(product => {
        // Search filter
        if (searchTerm && !product.name.toLowerCase().includes(searchTerm)) {
            return false;
        }

        // Category filter
        if (category && product.category !== category) {
            return false;
        }

        // Brand filter from URL
        if (brand && product.brand.toLowerCase() !== brand.toLowerCase()) {
            return false;
        }

        // Price filter
        if (selectedPrices.length > 0) {
            const price = product.price / 1000000;
            const matchPrice = selectedPrices.some(range => {
                const [min, max] = range.split('-').map(Number);
                return price >= min && price < max;
            });
            if (!matchPrice) return false;
        }

        // Brand filter from checkbox
        if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
            return false;
        }

        // RAM filter
        if (selectedRAMs.length > 0) {
            const matchRAM = selectedRAMs.some(ram => {
                if (ram === 12) {
                    return product.ram >= 12;
                }
                return product.ram === ram;
            });
            if (!matchRAM) return false;
        }

        // Storage filter
        if (selectedStorages.length > 0) {
            const matchStorage = selectedStorages.some(storage => {
                if (storage === 512) {
                    return product.storage >= 512;
                }
                return product.storage === storage;
            });
            if (!matchStorage) return false;
        }

        return true;
    });

    currentPage = 1;
    sortProducts();
}

// ==================== SORT PRODUCTS ====================
function sortProducts() {
    const sortValue = document.getElementById('sortSelect').value;

    switch(sortValue) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            // Default sort
            break;
    }

    renderProducts();
}

// ==================== RENDER PRODUCTS ====================
function renderProducts() {
    const container = document.getElementById('productsList');
    const countElement = document.getElementById('productCount');

    if (!container) return;

    // Update count
    if (countElement) {
        countElement.textContent = `Tìm thấy ${filteredProducts.length} sản phẩm`;
    }

    // Calculate pagination
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    // Render products
    if (productsToShow.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-box-open fa-5x text-muted mb-3"></i>
                <h4>Không tìm thấy sản phẩm nào</h4>
                <p class="text-muted">Vui lòng thử lại với bộ lọc khác</p>
            </div>
        `;
    } else {
        container.innerHTML = productsToShow.map(product => renderProductCard(product)).join('');
    }

    renderPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== RENDER PAGINATION ====================
function renderPagination() {
    const paginationElement = document.getElementById('pagination');
    if (!paginationElement) return;

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    if (totalPages <= 1) {
        paginationElement.innerHTML = '';
        return;
    }

    let paginationHTML = '';

    // Previous button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    // Next button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;

    paginationElement.innerHTML = paginationHTML;
}

// ==================== CHANGE PAGE ====================
function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderProducts();
}

// ==================== SEARCH PRODUCTS ====================
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        window.location.href = `sanpham.html?search=${encodeURIComponent(searchTerm)}`;
    }
}

// ==================== RESET FILTERS ====================
function resetFilters() {
    document.querySelectorAll('.filter-price, .filter-brand, .filter-ram, .filter-storage').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Remove URL parameters
    window.location.href = 'sanpham.html';
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    // Check for URL brand parameter and pre-select
    const urlParams = new URLSearchParams(window.location.search);
    const brandParam = urlParams.get('brand');
    
    if (brandParam) {
        const brandCheckbox = document.querySelector(`.filter-brand[value="${brandParam}"]`);
        if (brandCheckbox) {
            brandCheckbox.checked = true;
        }
    }

    // Add event listeners to filters
    document.querySelectorAll('.filter-price, .filter-brand, .filter-ram, .filter-storage').forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });

    // Add event listener to sort
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', sortProducts);
    }

    // Initial load
    filterProducts();
});
