// Settings Loader - Tải cài đặt từ localStorage và cập nhật các phần tử trên trang

document.addEventListener('DOMContentLoaded', function() {
    loadAndApplySettings();
});

function loadAndApplySettings() {
    // Lấy cài đặt từ localStorage
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    
    // Giá trị mặc định
    const websiteName = settings.websiteName || 'Thế Giới Di Động';
    const email = settings.email || 'info@thegioididong.com';
    const hotline = settings.hotline || '1800.6789';
    const address = settings.address || '123 Đường ABC, Quận 1, TP.HCM';
    const shippingFee = settings.shippingFee || 0;
    const freeShipMin = settings.freeShipMin || 0;
    const facebook = settings.facebook || '';
    const youtube = settings.youtube || '';
    const instagram = settings.instagram || '';
    const zalo = settings.zalo || '';
    
    // Cập nhật title
    const pageTitle = document.querySelector('title');
    if (pageTitle && pageTitle.textContent.includes('Thế Giới Di Động')) {
        pageTitle.textContent = pageTitle.textContent.replace('Thế Giới Di Động', websiteName);
    }
    
    // Cập nhật tên website trong footer và các vị trí khác
    document.querySelectorAll('[data-setting="websiteName"], .website-name').forEach(el => {
        el.textContent = websiteName;
    });
    
    // Cập nhật hotline
    document.querySelectorAll('[data-setting="hotline"], .setting-hotline').forEach(el => {
        el.textContent = hotline;
    });
    
    // Cập nhật email
    document.querySelectorAll('[data-setting="email"], .setting-email').forEach(el => {
        el.textContent = email;
    });
    
    // Cập nhật địa chỉ
    document.querySelectorAll('[data-setting="address"], .setting-address').forEach(el => {
        el.textContent = address;
    });
    
    // Cập nhật phí vận chuyển
    document.querySelectorAll('[data-setting="shippingFee"], .setting-shipping-fee').forEach(el => {
        el.textContent = formatCurrency(shippingFee);
    });
    
    // Cập nhật mạng xã hội
    updateSocialLinks(facebook, youtube, instagram, zalo);
    
    // Cập nhật đơn tối thiểu miễn phí ship
    document.querySelectorAll('[data-setting="freeShipMin"], .setting-free-ship-min').forEach(el => {
        el.textContent = formatCurrency(freeShipMin);
    });
    
    // Lưu settings vào window để các script khác có thể sử dụng
    window.siteSettings = {
        websiteName,
        email,
        hotline,
        address,
        shippingFee,
        freeShipMin,
        facebook,
        youtube,
        instagram,
        zalo
    };
    
    console.log('Settings loaded:', window.siteSettings);
}

// Cập nhật các link mạng xã hội
function updateSocialLinks(facebook, youtube, instagram, zalo) {
    // Facebook
    const fbLink = document.querySelector('[data-social="facebook"]');
    if (fbLink) {
        if (facebook) {
            fbLink.href = facebook;
            fbLink.style.display = 'inline-block';
            fbLink.target = '_blank';
        } else {
            fbLink.style.display = 'none';
        }
    }
    
    // YouTube
    const ytLink = document.querySelector('[data-social="youtube"]');
    if (ytLink) {
        if (youtube) {
            ytLink.href = youtube;
            ytLink.style.display = 'inline-block';
            ytLink.target = '_blank';
        } else {
            ytLink.style.display = 'none';
        }
    }
    
    // Instagram
    const igLink = document.querySelector('[data-social="instagram"]');
    if (igLink) {
        if (instagram) {
            igLink.href = instagram;
            igLink.style.display = 'inline-block';
            igLink.target = '_blank';
        } else {
            igLink.style.display = 'none';
        }
    }
    
    // Zalo
    const zaloLink = document.querySelector('[data-social="zalo"]');
    if (zaloLink) {
        if (zalo) {
            // Zalo link format: https://zalo.me/PHONE_NUMBER
            const zaloUrl = zalo.startsWith('http') ? zalo : `https://zalo.me/${zalo.replace(/\D/g, '')}`;
            zaloLink.href = zaloUrl;
            zaloLink.style.display = 'inline-block';
            zaloLink.target = '_blank';
        } else {
            zaloLink.style.display = 'none';
        }
    }
}

// Helper function format tiền
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

// Export để có thể gọi từ bên ngoài
window.loadAndApplySettings = loadAndApplySettings;
