// ==================== RATING FUNCTIONALITY ====================
function initRatingInput() {
    const ratingStars = document.querySelectorAll('.rating-star');
    const ratingValue = document.getElementById('ratingValue');

    ratingStars.forEach((star, index) => {
        star.addEventListener('click', () => {
            const rating = index + 1;
            ratingValue.value = rating;

            // Update star display
            ratingStars.forEach((s, i) => {
                if (i < rating) {
                    s.classList.remove('far');
                    s.classList.add('fas', 'active');
                } else {
                    s.classList.remove('fas', 'active');
                    s.classList.add('far');
                }
            });
        });

        star.addEventListener('mouseenter', () => {
            const rating = index + 1;
            ratingStars.forEach((s, i) => {
                if (i < rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });

    // Reset on mouse leave
    const ratingInput = document.querySelector('.rating-input');
    if (ratingInput) {
        ratingInput.addEventListener('mouseleave', () => {
            const currentRating = parseInt(ratingValue.value);
            ratingStars.forEach((s, i) => {
                if (i < currentRating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    }
}

// ==================== SUBMIT REVIEW ====================
function submitReview(event) {
    event.preventDefault();

    const name = document.getElementById('reviewName').value.trim();
    const email = document.getElementById('reviewEmail').value.trim();
    const product = document.getElementById('reviewProduct').value.trim();
    const rating = document.getElementById('ratingValue').value;
    const content = document.getElementById('reviewContent').value.trim();

    // Validation
    if (!name || !email || !content) {
        showNotification('Vui lòng điền đầy đủ thông tin!', 'warning');
        return;
    }

    if (!rating || rating === '0') {
        showNotification('Vui lòng chọn số sao đánh giá!', 'warning');
        return;
    }

    // Create review object
    const review = {
        name: name,
        email: email,
        product: product,
        rating: parseInt(rating),
        content: content,
        date: new Date().toLocaleDateString('vi-VN')
    };

    // In a real application, this would be sent to a server
    console.log('Review submitted:', review);

    // Add review to list (prepend)
    addReviewToList(review);

    // Show success message
    showNotification('Cảm ơn bạn đã gửi đánh giá! Đánh giá của bạn đã được ghi nhận.', 'success');

    // Reset form
    document.getElementById('reviewForm').reset();
    document.getElementById('ratingValue').value = '0';
    document.querySelectorAll('.rating-star').forEach(star => {
        star.classList.remove('fas', 'active');
        star.classList.add('far');
    });
}

// ==================== ADD REVIEW TO LIST ====================
function addReviewToList(review) {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;

    const starIcons = Array(review.rating).fill('<i class="fas fa-star"></i>').join('') +
                     Array(5 - review.rating).fill('<i class="far fa-star"></i>').join('');

    const reviewHTML = `
        <div class="review-card card mb-3 shadow-sm fade-in">
            <div class="card-body">
                <div class="d-flex mb-3">
                    <div class="flex-shrink-0">
                        <div class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
                            <i class="fas fa-user fa-2x"></i>
                        </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                        <h5 class="mb-1">${review.name}</h5>
                        <div class="text-warning mb-1">
                            ${starIcons}
                        </div>
                        <p class="text-muted small mb-0">
                            <i class="fas fa-clock"></i> Vừa xong${review.product ? ' | <i class="fas fa-mobile-alt"></i> ' + review.product : ''}
                        </p>
                    </div>
                </div>
                <p class="mb-2">${review.content}</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-primary">
                        <i class="fas fa-thumbs-up"></i> Hữu ích (0)
                    </button>
                    <button class="btn btn-sm btn-outline-secondary">
                        <i class="fas fa-reply"></i> Phản hồi
                    </button>
                </div>
            </div>
        </div>
    `;

    reviewsList.insertAdjacentHTML('afterbegin', reviewHTML);
}

// ==================== FILTER REVIEWS ====================
function filterReviews() {
    const filterSelect = document.getElementById('filterReviews');
    if (!filterSelect) return;

    filterSelect.addEventListener('change', () => {
        const filterValue = filterSelect.value;
        const reviewCards = document.querySelectorAll('.review-card');

        reviewCards.forEach(card => {
            if (filterValue === 'all') {
                card.style.display = 'block';
            } else {
                // In a real application, you would filter based on actual data
                card.style.display = 'block';
            }
        });
    });
}

// ==================== NOTIFICATION ====================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3`;
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ==================== UPDATE CART COUNT ====================
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('#cartCount').forEach(el => {
        el.textContent = cartCount;
    });
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    initRatingInput();
    filterReviews();
    updateCartCount();
});
