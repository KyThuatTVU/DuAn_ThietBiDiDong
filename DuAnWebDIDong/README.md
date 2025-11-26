# 📱 Website Bán Điện Thoại - Thế Giới Di Động

## 🌐 Mô tả dự án

Dự án website bán điện thoại với giao diện hiện đại, thân thiện và tương thích đa thiết bị. Website được xây dựng bằng HTML5, CSS3, JavaScript và Bootstrap 5.

## ✨ Tính năng chính

### 📄 Các trang nội dung

1. **Trang chủ (index.html)**
   - Banner slider giới thiệu khuyến mãi
   - Thương hiệu nổi bật
   - Sản phẩm HOT
   - Giới thiệu cửa hàng
   - Tính năng nổi bật

2. **Trang danh sách sản phẩm (sanpham.html)**
   - Hiển thị tất cả sản phẩm
   - Bộ lọc sản phẩm:
     - Theo giá
     - Theo thương hiệu
     - Theo RAM
     - Theo bộ nhớ trong
   - Tìm kiếm sản phẩm
   - Sắp xếp sản phẩm
   - Phân trang

3. **Trang chi tiết sản phẩm (chitiet.html)**
   - Hình ảnh sản phẩm lớn + thumbnails
   - Thông tin chi tiết
   - Thông số kỹ thuật
   - Mô tả sản phẩm
   - Đánh giá khách hàng
   - Sản phẩm liên quan
   - Thêm vào giỏ hàng

4. **Trang giỏ hàng (giohang.html)**
   - Danh sách sản phẩm đã chọn
   - Cập nhật số lượng
   - Xóa sản phẩm
   - Tính tổng tiền
   - Áp dụng mã giảm giá
   - Thanh toán

5. **Trang đánh giá (danhgia.html)**
   - Danh sách đánh giá từ khách hàng
   - Form gửi đánh giá
   - Hệ thống xếp hạng sao
   - Thống kê đánh giá
   - Lọc đánh giá theo số sao

6. **Trang liên hệ (lienhe.html)**
   - Thông tin liên hệ
   - Form gửi tin nhắn
   - Bản đồ Google Maps
   - Hệ thống cửa hàng
   - Câu hỏi thường gặp

## 🛠️ Công nghệ sử dụng

- **HTML5** - Cấu trúc trang web
- **CSS3** - Styling và animations
- **Bootstrap 5.3.0** - Framework responsive
- **JavaScript (ES6+)** - Xử lý tương tác
- **Font Awesome 6.4.0** - Icons
- **Swiper.js** - Slider banner

## 📁 Cấu trúc thư mục

```
DuAnWebDIDong/
├── index.html              # Trang chủ
├── sanpham.html           # Danh sách sản phẩm
├── chitiet.html           # Chi tiết sản phẩm
├── giohang.html           # Giỏ hàng
├── danhgia.html           # Đánh giá khách hàng
├── lienhe.html            # Liên hệ
├── css/
│   └── style.css          # CSS chính
├── js/
│   ├── main.js            # JavaScript chính
│   ├── products.js        # Xử lý danh sách sản phẩm
│   ├── product-detail.js  # Xử lý chi tiết sản phẩm
│   ├── cart.js            # Xử lý giỏ hàng
│   ├── reviews.js         # Xử lý đánh giá
│   └── contact.js         # Xử lý liên hệ
└── images/
    ├── products/          # Hình ảnh sản phẩm
    └── banners/           # Hình ảnh banner
```

## 🚀 Hướng dẫn sử dụng

### Cách 1: Mở trực tiếp

1. Mở file `index.html` bằng trình duyệt web
2. Điều hướng qua các trang bằng menu navigation

### Cách 2: Sử dụng Live Server (Khuyến nghị)

1. Cài đặt extension **Live Server** trong VS Code
2. Click chuột phải vào file `index.html`
3. Chọn "Open with Live Server"

## 🎨 Tính năng nổi bật

### ✅ Responsive Design
- Tương thích với mọi thiết bị (Desktop, Tablet, Mobile)
- Sử dụng Bootstrap Grid System
- Media queries tối ưu

### ✅ Hiệu ứng động
- Smooth scrolling
- Hover effects
- Fade-in animations
- Loading states

### ✅ Giỏ hàng thông minh
- Lưu trữ bằng LocalStorage
- Cập nhật real-time
- Tính tổng tự động
- Áp dụng mã giảm giá

### ✅ Tìm kiếm & lọc
- Tìm kiếm theo tên
- Lọc theo nhiều tiêu chí
- Sắp xếp linh hoạt
- Phân trang

### ✅ Trải nghiệm người dùng
- Giao diện trực quan
- Navigation rõ ràng
- Breadcrumb
- Back to top button
- Thông báo (Notifications)

## 📊 Dữ liệu mẫu

Website đã được tích hợp sẵn dữ liệu mẫu về 8 sản phẩm điện thoại bao gồm:

- iPhone 15 Pro Max
- Samsung Galaxy S24 Ultra
- Xiaomi 14 Ultra
- OPPO Reno11 F
- Vivo V30e
- Realme 12 Pro+
- iPhone 14 Pro Max
- Samsung Galaxy Z Fold5

Mỗi sản phẩm có đầy đủ thông tin:
- Hình ảnh
- Giá cả, khuyến mãi
- Thông số kỹ thuật
- Mô tả chi tiết
- Đánh giá

## 🎯 Mã giảm giá có sẵn

Bạn có thể sử dụng các mã giảm giá sau trong giỏ hàng:

- `SALE10` - Giảm 10%
- `SALE20` - Giảm 20%
- `FREESHIP` - Miễn phí vận chuyển

## 🔧 Tùy chỉnh

### Thay đổi màu sắc chủ đạo

Mở file `css/style.css` và chỉnh sửa biến CSS:

```css
:root {
    --primary-color: #0066cc;
    --secondary-color: #ff6600;
    --success-color: #28a745;
    --danger-color: #dc3545;
}
```

### Thêm sản phẩm mới

Mở file `js/main.js` và thêm vào mảng `products`:

```javascript
{
    id: 9,
    name: 'Tên sản phẩm',
    brand: 'Hãng',
    price: 10000000,
    oldPrice: 12000000,
    discount: 17,
    image: 'link-hinh-anh',
    category: 'phone',
    ram: 8,
    storage: 128,
    rating: 5,
    hot: true,
    specs: { ... },
    description: '...'
}
```

## 📱 Tương thích trình duyệt

- ✅ Chrome (khuyến nghị)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

## 📝 Ghi chú

- Website sử dụng LocalStorage để lưu giỏ hàng
- Dữ liệu sản phẩm được lưu trong JavaScript (không cần database)
- Hình ảnh sản phẩm sử dụng link từ CDN
- Form liên hệ và đánh giá chỉ hiển thị thông báo (không gửi thật)

## 🎓 Mục đích học tập

Dự án này được xây dựng cho mục đích học tập và minh họa, phù hợp cho:

- Sinh viên học web development
- Người mới bắt đầu với HTML/CSS/JavaScript
- Thực hành Bootstrap framework
- Tham khảo xây dựng website thương mại điện tử

## 🤝 Đóng góp

Nếu bạn muốn cải thiện dự án, hãy:

1. Fork repository
2. Tạo branch mới
3. Commit thay đổi
4. Push lên branch
5. Tạo Pull Request

## 📧 Liên hệ

Nếu có thắc mắc hoặc góp ý, vui lòng liên hệ:

- **Email**: info@thegioididong.com
- **Hotline**: 1800.6789

## 📜 License

Dự án này được phát hành dưới MIT License.

---

**Made with ❤️ by Thế Giới Di Động Team**

*Chúc bạn học tập và phát triển thành công!* 🚀
