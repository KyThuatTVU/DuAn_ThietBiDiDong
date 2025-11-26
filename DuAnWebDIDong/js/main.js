// ==================== PRODUCT DATA ====================
const products = [
    {
        id: 1,
        name: 'iPhone 15 Pro Max 256GB',
        brand: 'Apple',
        price: 29990000,
        oldPrice: 34990000,
        discount: 14,
        image: 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg',
        category: 'phone',
        ram: 8,
        storage: 256,
        rating: 5,
        hot: true,
        bestSelling: true,
        specs: {
            'Màn hình': '6.7", Super Retina XDR',
            'Camera sau': '48MP, 12MP, 12MP',
            'Camera trước': '12MP',
            'CPU': 'Apple A17 Pro',
            'RAM': '8GB',
            'Bộ nhớ trong': '256GB',
            'Pin': '4422mAh, 20W'
        },
        description: 'iPhone 15 Pro Max mang đến thiết kế khung viền từ titan chuẩn hàng không vũ trụ, cực nhẹ và bền bỉ, đi kèm với đó là nút bấm Action Button tinh tế cùng hiệu năng cực đỉnh từ chip A17 Pro.'
    },
    {
        id: 2,
        name: 'Samsung Galaxy S24 Ultra 5G 256GB',
        brand: 'Samsung',
        price: 27490000,
        oldPrice: 29990000,
        discount: 8,
        image: 'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-grey-thumbnew-600x600.jpg',
        category: 'phone',
        ram: 12,
        storage: 256,
        rating: 5,
        hot: true,
        bestSelling: true,
        specs: {
            'Màn hình': '6.8", Dynamic AMOLED 2X',
            'Camera sau': '200MP, 50MP, 12MP, 10MP',
            'Camera trước': '12MP',
            'CPU': 'Snapdragon 8 Gen 3',
            'RAM': '12GB',
            'Bộ nhớ trong': '256GB',
            'Pin': '5000mAh, 45W'
        },
        description: 'Galaxy S24 Ultra mang đến khả năng chụp ảnh zoom 100x ấn tượng, hiệu năng mạnh mẽ cùng Galaxy AI thông minh.'
    },
    {
        id: 3,
        name: 'Xiaomi 14 Ultra 5G 512GB',
        brand: 'Xiaomi',
        price: 24990000,
        oldPrice: 27990000,
        discount: 11,
        image: 'https://cdn.tgdd.vn/Products/Images/42/320722/xiaomi-14-ultra-white-thumbnew-600x600.jpg',
        category: 'phone',
        ram: 16,
        storage: 512,
        rating: 5,
        hot: true,
        bestSelling: true,
        specs: {
            'Màn hình': '6.73", AMOLED',
            'Camera sau': '50MP, 50MP, 50MP, 50MP',
            'Camera trước': '32MP',
            'CPU': 'Snapdragon 8 Gen 3',
            'RAM': '16GB',
            'Bộ nhớ trong': '512GB',
            'Pin': '5000mAh, 90W'
        },
        description: 'Xiaomi 14 Ultra với hệ thống camera Leica 4 ống kính 50MP, hiệu năng đỉnh cao và sạc nhanh 90W ấn tượng.'
    },
    {
        id: 4,
        name: 'OPPO Reno11 F 5G 8GB',
        brand: 'OPPO',
        price: 8490000,
        oldPrice: 9990000,
        discount: 15,
        image: 'https://cdn.tgdd.vn/Products/Images/42/320536/oppo-reno11-f-5g-xanh-thumb-600x600.jpg',
        category: 'phone',
        ram: 8,
        storage: 256,
        rating: 4,
        hot: true,
        bestSelling: true,
        specs: {
            'Màn hình': '6.7", AMOLED',
            'Camera sau': '64MP, 8MP, 2MP',
            'Camera trước': '32MP',
            'CPU': 'Dimensity 7050',
            'RAM': '8GB',
            'Bộ nhớ trong': '256GB',
            'Pin': '5000mAh, 67W'
        },
        description: 'OPPO Reno11 F với camera selfie 32MP, sạc nhanh 67W và thiết kế đẹp mắt.'
    },
    {
        id: 5,
        name: 'Vivo V30e 5G 8GB',
        brand: 'Vivo',
        price: 9990000,
        oldPrice: 10990000,
        discount: 9,
        image: 'https://cdn.tgdd.vn/Products/Images/42/320466/vivo-v30e-xanh-thumb-600x600.jpg',
        category: 'phone',
        ram: 8,
        storage: 256,
        rating: 4,
        hot: false,
        bestSelling: true,
        specs: {
            'Màn hình': '6.78", AMOLED',
            'Camera sau': '50MP, 8MP',
            'Camera trước': '50MP',
            'CPU': 'Snapdragon 6 Gen 1',
            'RAM': '8GB',
            'Bộ nhớ trong': '256GB',
            'Pin': '5500mAh, 44W'
        },
        description: 'Vivo V30e với camera trước 50MP, pin 5500mAh khủng và màn hình AMOLED sắc nét.'
    },
    {
        id: 6,
        name: 'Realme 12 Pro+ 5G 8GB',
        brand: 'Realme',
        price: 10990000,
        oldPrice: 11990000,
        discount: 8,
        image: 'https://cdn.tgdd.vn/Products/Images/42/318874/realme-12-pro-plus-xanh-thumb-600x600.jpg',
        category: 'phone',
        ram: 8,
        storage: 256,
        rating: 4,
        hot: true,
        bestSelling: true,
        specs: {
            'Màn hình': '6.7", AMOLED',
            'Camera sau': '50MP, 64MP, 8MP',
            'Camera trước': '32MP',
            'CPU': 'Snapdragon 7s Gen 2',
            'RAM': '8GB',
            'Bộ nhớ trong': '256GB',
            'Pin': '5000mAh, 67W'
        },
        description: 'Realme 12 Pro+ với camera zoom tele 3x chất lượng cao và hiệu năng mạnh mẽ.'
    },
    {
        id: 7,
        name: 'iPhone 14 Pro Max 128GB',
        brand: 'Apple',
        price: 24990000,
        oldPrice: 27990000,
        discount: 11,
        image: 'https://cdn.tgdd.vn/Products/Images/42/289700/iphone-14-pro-max-den-thumb-600x600.jpg',
        category: 'phone',
        ram: 6,
        storage: 128,
        rating: 5,
        hot: false,
        specs: {
            'Màn hình': '6.7", Super Retina XDR',
            'Camera sau': '48MP, 12MP, 12MP',
            'Camera trước': '12MP',
            'CPU': 'Apple A16 Bionic',
            'RAM': '6GB',
            'Bộ nhớ trong': '128GB',
            'Pin': '4323mAh, 20W'
        },
        description: 'iPhone 14 Pro Max với Dynamic Island độc đáo và camera 48MP ấn tượng.'
    },
    {
        id: 8,
        name: 'Samsung Galaxy Z Fold5 5G 256GB',
        brand: 'Samsung',
        price: 32990000,
        oldPrice: 40990000,
        discount: 20,
        image: 'https://cdn.tgdd.vn/Products/Images/42/309831/samsung-galaxy-z-fold5-kem-256gb-thumb-600x600.jpg',
        category: 'phone',
        ram: 12,
        storage: 256,
        rating: 5,
        hot: true,
        specs: {
            'Màn hình': '7.6", Dynamic AMOLED 2X',
            'Camera sau': '50MP, 12MP, 10MP',
            'Camera trước': '10MP & 4MP',
            'CPU': 'Snapdragon 8 Gen 2',
            'RAM': '12GB',
            'Bộ nhớ trong': '256GB',
            'Pin': '4400mAh, 25W'
        },
        description: 'Galaxy Z Fold5 là smartphone màn hình gập cao cấp với hiệu năng mạnh mẽ và đa nhiệm tuyệt vời.'
    },
    {
        id: 9,
        name: 'iPhone 15 Pro 128GB',
        brand: 'Apple',
        price: 25990000,
        oldPrice: 28990000,
        discount: 10,
        image: 'https://cdn.tgdd.vn/Products/Images/42/305660/iphone-15-pro-white-thumbnew-600x600.jpg',
        category: 'phone',
        ram: 8,
        storage: 128,
        rating: 5,
        hot: true,
        specs: {
            'Màn hình': '6.1", Super Retina XDR',
            'Camera sau': '48MP, 12MP, 12MP',
            'Camera trước': '12MP',
            'CPU': 'Apple A17 Pro',
            'RAM': '8GB',
            'Bộ nhớ trong': '128GB',
            'Pin': '3274mAh, 20W'
        },
        description: 'iPhone 15 Pro với khung titan nhẹ, nút Action Button và chip A17 Pro mạnh mẽ cho trải nghiệm đỉnh cao.'
    },
    {
        id: 10,
        name: 'Samsung Galaxy S24 Plus 5G 256GB',
        brand: 'Samsung',
        price: 22990000,
        oldPrice: 25990000,
        discount: 12,
        image: 'https://cdn.tgdd.vn/Products/Images/42/307176/samsung-galaxy-s24-plus-violet-thumbnew-600x600.jpg',
        category: 'phone',
        ram: 12,
        storage: 256,
        rating: 5,
        hot: true,
        specs: {
            'Màn hình': '6.7", Dynamic AMOLED 2X',
            'Camera sau': '50MP, 12MP, 10MP',
            'Camera trước': '12MP',
            'CPU': 'Exynos 2400',
            'RAM': '12GB',
            'Bộ nhớ trong': '256GB',
            'Pin': '4900mAh, 45W'
        },
        description: 'Galaxy S24 Plus với màn hình lớn 6.7 inch, Galaxy AI và hiệu năng mạnh mẽ từ Exynos 2400.'
    },
    {
        id: 11,
        name: 'Xiaomi 14 5G 256GB',
        brand: 'Xiaomi',
        price: 18990000,
        oldPrice: 21990000,
        discount: 14,
        image: 'https://cdn.tgdd.vn/Products/Images/42/316771/xiaomi-14-xanh-thumbnew-600x600.jpg',
        category: 'phone',
        ram: 12,
        storage: 256,
        rating: 5,
        hot: true,
        specs: {
            'Màn hình': '6.36", AMOLED',
            'Camera sau': '50MP, 50MP, 50MP',
            'Camera trước': '32MP',
            'CPU': 'Snapdragon 8 Gen 3',
            'RAM': '12GB',
            'Bộ nhớ trong': '256GB',
            'Pin': '4610mAh, 90W'
        },
        description: 'Xiaomi 14 với camera Leica 50MP, sạc nhanh 90W và màn hình AMOLED sắc nét.'
    },
    {
        id: 12,
        name: 'OPPO Find N3 5G 512GB',
        brand: 'OPPO',
        price: 35990000,
        oldPrice: 44990000,
        discount: 20,
        image: 'https://cdn.tgdd.vn/Products/Images/42/313348/oppo-find-n3-vang-thumbnew-600x600.jpg',
        category: 'phone',
        ram: 16,
        storage: 512,
        rating: 5,
        hot: true,
        specs: {
            'Màn hình': '7.82", AMOLED Gập',
            'Camera sau': '48MP, 48MP, 64MP',
            'Camera trước': '32MP & 20MP',
            'CPU': 'Snapdragon 8 Gen 2',
            'RAM': '16GB',
            'Bộ nhớ trong': '512GB',
            'Pin': '4805mAh, 67W'
        },
        description: 'OPPO Find N3 - flagship màn hình gập cao cấp với camera Hasselblad và hiệu năng khủng.'
    },
    {
        id: 13,
        name: 'Vivo V30 Pro 5G 12GB',
        brand: 'Vivo',
        price: 14990000,
        oldPrice: 16990000,
        discount: 12,
        image: 'https://cdn.tgdd.vn/Products/Images/42/319896/vivo-v30-pro-xanh-thumb-600x600.jpg',
        category: 'phone',
        ram: 12,
        storage: 512,
        rating: 5,
        hot: true,
        specs: {
            'Màn hình': '6.78", AMOLED',
            'Camera sau': '50MP, 50MP, 50MP',
            'Camera trước': '50MP',
            'CPU': 'Dimensity 8200',
            'RAM': '12GB',
            'Bộ nhớ trong': '512GB',
            'Pin': '5000mAh, 80W'
        },
        description: 'Vivo V30 Pro với bộ 3 camera 50MP, sạc nhanh 80W và thiết kế mỏng nhẹ sang trọng.'
    },
    {
        id: 14,
        name: 'Realme GT 6 5G 12GB',
        brand: 'Realme',
        price: 13990000,
        oldPrice: 15990000,
        discount: 13,
        image: 'https://cdn.tgdd.vn/Products/Images/42/322626/realme-gt-6-xanh-thumb-600x600.jpg',
        category: 'phone',
        ram: 12,
        storage: 256,
        rating: 5,
        hot: true,
        specs: {
            'Màn hình': '6.78", AMOLED 120Hz',
            'Camera sau': '50MP, 50MP, 8MP',
            'Camera trước': '32MP',
            'CPU': 'Snapdragon 8s Gen 3',
            'RAM': '12GB',
            'Bộ nhớ trong': '256GB',
            'Pin': '5800mAh, 120W'
        },
        description: 'Realme GT 6 với pin khủng 5800mAh, sạc siêu nhanh 120W và hiệu năng gaming đỉnh cao.'
    },
    {
        id: 15,
        name: 'iPhone 14 Plus 128GB',
        brand: 'Apple',
        price: 19990000,
        oldPrice: 22990000,
        discount: 13,
        image: 'https://cdn.tgdd.vn/Products/Images/42/289700/iphone-14-plus-blue-thumbnew-600x600.jpg',
        category: 'phone',
        ram: 6,
        storage: 128,
        rating: 4,
        hot: false,
        specs: {
            'Màn hình': '6.7", Super Retina XDR',
            'Camera sau': '12MP, 12MP',
            'Camera trước': '12MP',
            'CPU': 'Apple A15 Bionic',
            'RAM': '6GB',
            'Bộ nhớ trong': '128GB',
            'Pin': '4325mAh, 20W'
        },
        description: 'iPhone 14 Plus với màn hình lớn 6.7 inch, pin trâu và camera chất lượng cao.'
    },
    {
        id: 16,
        name: 'Samsung Galaxy A55 5G 128GB',
        brand: 'Samsung',
        price: 9990000,
        oldPrice: 11990000,
        discount: 17,
        image: 'https://cdn.tgdd.vn/Products/Images/42/319730/samsung-galaxy-a55-5g-xanh-thumb-600x600.jpg',
        category: 'phone',
        ram: 8,
        storage: 128,
        rating: 4,
        hot: true,
        bestSelling: true,
        specs: {
            'Màn hình': '6.6", Super AMOLED',
            'Camera sau': '50MP, 12MP, 5MP',
            'Camera trước': '32MP',
            'CPU': 'Exynos 1480',
            'RAM': '8GB',
            'Bộ nhớ trong': '128GB',
            'Pin': '5000mAh, 25W'
        },
        description: 'Galaxy A55 với thiết kế kim loại cao cấp, camera 50MP và pin 5000mAh bền bỉ.'
    },
    {
        id: 17,
        name: 'Xiaomi Redmi Note 13 Pro 8GB',
        brand: 'Xiaomi',
        price: 7490000,
        oldPrice: 8990000,
        discount: 17,
        image: 'https://cdn.tgdd.vn/Products/Images/42/316771/xiaomi-redmi-note-13-pro-tim-thumb-600x600.jpg',
        category: 'phone',
        ram: 8,
        storage: 256,
        rating: 4,
        hot: true,
        bestSelling: true,
        specs: {
            'Màn hình': '6.67", AMOLED 120Hz',
            'Camera sau': '200MP, 8MP, 2MP',
            'Camera trước': '16MP',
            'CPU': 'Snapdragon 7s Gen 2',
            'RAM': '8GB',
            'Bộ nhớ trong': '256GB',
            'Pin': '5100mAh, 67W'
        },
        description: 'Redmi Note 13 Pro với camera 200MP ấn tượng, sạc nhanh 67W và giá cả hợp lý.'
    },
    {
        id: 18,
        name: 'OPPO Reno11 5G 256GB',
        brand: 'OPPO',
        price: 10490000,
        oldPrice: 12990000,
        discount: 19,
        image: 'https://cdn.tgdd.vn/Products/Images/42/318333/oppo-reno11-5g-xanh-thumb-600x600.jpg',
        category: 'phone',
        ram: 12,
        storage: 256,
        rating: 4,
        hot: true,
        specs: {
            'Màn hình': '6.7", AMOLED',
            'Camera sau': '50MP, 32MP, 8MP',
            'Camera trước': '32MP',
            'CPU': 'Dimensity 8200',
            'RAM': '12GB',
            'Bộ nhớ trong': '256GB',
            'Pin': '5000mAh, 67W'
        },
        description: 'OPPO Reno11 với camera chân dung chuyên nghiệp, hiệu năng mạnh mẽ và thiết kế mỏng nhẹ.'
    },
    {
        id: 19,
        name: 'Vivo Y36 5G 128GB',
        brand: 'Vivo',
        price: 5990000,
        oldPrice: 6990000,
        discount: 14,
        image: 'https://cdn.tgdd.vn/Products/Images/42/313186/vivo-y36-xanh-thumb-600x600.jpg',
        category: 'phone',
        ram: 8,
        storage: 128,
        rating: 4,
        hot: false,
        specs: {
            'Màn hình': '6.64", IPS LCD',
            'Camera sau': '50MP, 2MP',
            'Camera trước': '16MP',
            'CPU': 'Snapdragon 6 Gen 1',
            'RAM': '8GB',
            'Bộ nhớ trong': '128GB',
            'Pin': '5000mAh, 44W'
        },
        description: 'Vivo Y36 phân khúc tầm trung với pin 5000mAh, camera 50MP và thiết kế trẻ trung.'
    },
    {
        id: 20,
        name: 'Realme C67 8GB',
        brand: 'Realme',
        price: 4990000,
        oldPrice: 5990000,
        discount: 17,
        image: 'https://cdn.tgdd.vn/Products/Images/42/316695/realme-c67-xanh-thumb-600x600.jpg',
        category: 'phone',
        ram: 8,
        storage: 128,
        rating: 4,
        hot: false,
        specs: {
            'Màn hình': '6.72", IPS LCD 90Hz',
            'Camera sau': '108MP, 2MP',
            'Camera trước': '8MP',
            'CPU': 'Snapdragon 685',
            'RAM': '8GB',
            'Bộ nhớ trong': '128GB',
            'Pin': '5000mAh, 33W'
        },
        description: 'Realme C67 với camera 108MP, màn hình 90Hz mượt mà và giá rẻ phù hợp sinh viên.'
    },
    {
        id: 21,
        name: 'iPhone 13 128GB',
        brand: 'Apple',
        price: 15990000,
        oldPrice: 18990000,
        discount: 16,
        image: 'https://cdn.tgdd.vn/Products/Images/42/250258/iphone-13-midnight-thumb-600x600.jpg',
        category: 'phone',
        ram: 4,
        storage: 128,
        rating: 5,
        hot: false,
        specs: {
            'Màn hình': '6.1", Super Retina XDR',
            'Camera sau': '12MP, 12MP',
            'Camera trước': '12MP',
            'CPU': 'Apple A15 Bionic',
            'RAM': '4GB',
            'Bộ nhớ trong': '128GB',
            'Pin': '3240mAh, 20W'
        },
        description: 'iPhone 13 vẫn là lựa chọn tốt với hiệu năng ổn định, camera chất lượng và giá hợp lý.'
    },
    {
        id: 22,
        name: 'Samsung Galaxy Z Flip5 5G 256GB',
        brand: 'Samsung',
        price: 18990000,
        oldPrice: 23990000,
        discount: 21,
        image: 'https://cdn.tgdd.vn/Products/Images/42/309835/samsung-galaxy-z-flip5-mint-256gb-thumb-600x600.jpg',
        category: 'phone',
        ram: 8,
        storage: 256,
        rating: 5,
        hot: true,
        specs: {
            'Màn hình': '6.7", Dynamic AMOLED 2X Gập',
            'Camera sau': '12MP, 12MP',
            'Camera trước': '10MP',
            'CPU': 'Snapdragon 8 Gen 2',
            'RAM': '8GB',
            'Bộ nhớ trong': '256GB',
            'Pin': '3700mAh, 25W'
        },
        description: 'Galaxy Z Flip5 với thiết kế gập độc đáo, màn hình phụ lớn hơn và hiệu năng mạnh mẽ.'
    },
    {
        id: 23,
        name: 'Xiaomi 13T Pro 5G 256GB',
        brand: 'Xiaomi',
        price: 12990000,
        oldPrice: 14990000,
        discount: 13,
        image: 'https://cdn.tgdd.vn/Products/Images/42/309816/xiaomi-13t-pro-xanh-thumb-600x600.jpg',
        category: 'phone',
        ram: 12,
        storage: 256,
        rating: 5,
        hot: true,
        specs: {
            'Màn hình': '6.67", AMOLED 144Hz',
            'Camera sau': '50MP, 50MP, 12MP',
            'Camera trước': '20MP',
            'CPU': 'Dimensity 9200+',
            'RAM': '12GB',
            'Bộ nhớ trong': '256GB',
            'Pin': '5000mAh, 120W'
        },
        description: 'Xiaomi 13T Pro với sạc siêu nhanh 120W, camera Leica và màn hình 144Hz siêu mượt.'
    },
    {
        id: 24,
        name: 'OPPO A78 5G 128GB',
        brand: 'OPPO',
        price: 6490000,
        oldPrice: 7490000,
        discount: 13,
        image: 'https://cdn.tgdd.vn/Products/Images/42/301973/oppo-a78-den-thumb-600x600.jpg',
        category: 'phone',
        ram: 8,
        storage: 128,
        rating: 4,
        hot: false,
        specs: {
            'Màn hình': '6.56", IPS LCD 90Hz',
            'Camera sau': '50MP, 2MP',
            'Camera trước': '8MP',
            'CPU': 'Dimensity 700',
            'RAM': '8GB',
            'Bộ nhớ trong': '128GB',
            'Pin': '5000mAh, 33W'
        },
        description: 'OPPO A78 5G với kết nối thế hệ mới, pin 5000mAh và giá cả phải chăng.'
    },
    {
        id: 25,
        name: 'Vivo Y100 5G 256GB',
        brand: 'Vivo',
        price: 7990000,
        oldPrice: 8990000,
        discount: 11,
        image: 'https://cdn.tgdd.vn/Products/Images/42/316771/vivo-y100-xanh-thumb-600x600.jpg',
        category: 'phone',
        ram: 8,
        storage: 256,
        rating: 4,
        hot: false,
        specs: {
            'Màn hình': '6.67", AMOLED 120Hz',
            'Camera sau': '50MP, 2MP',
            'Camera trước': '16MP',
            'CPU': 'Snapdragon 685',
            'RAM': '8GB',
            'Bộ nhớ trong': '256GB',
            'Pin': '5000mAh, 80W'
        },
        description: 'Vivo Y100 với sạc nhanh 80W ấn tượng, màn hình AMOLED 120Hz và thiết kế đẹp mắt.'
    },
    {
        id: 26,
        name: 'Realme 11 Pro 5G 256GB',
        brand: 'Realme',
        price: 8990000,
        oldPrice: 10490000,
        discount: 14,
        image: 'https://cdn.tgdd.vn/Products/Images/42/307643/realme-11-pro-xanh-thumb-600x600.jpg',
        category: 'phone',
        ram: 12,
        storage: 256,
        rating: 4,
        hot: true,
        specs: {
            'Màn hình': '6.7", AMOLED 120Hz',
            'Camera sau': '100MP, 2MP',
            'Camera trước': '16MP',
            'CPU': 'Dimensity 7050',
            'RAM': '12GB',
            'Bộ nhớ trong': '256GB',
            'Pin': '5000mAh, 67W'
        },
        description: 'Realme 11 Pro với camera 100MP, thiết kế da vegan sang trọng và sạc nhanh 67W.'
    },
    {
        id: 27,
        name: 'Samsung Galaxy A35 5G 128GB',
        brand: 'Samsung',
        price: 7990000,
        oldPrice: 9490000,
        discount: 16,
        image: 'https://cdn.tgdd.vn/Products/Images/42/319729/samsung-galaxy-a35-5g-xanh-thumb-600x600.jpg',
        category: 'phone',
        ram: 8,
        storage: 128,
        rating: 4,
        hot: true,
        specs: {
            'Màn hình': '6.6", Super AMOLED',
            'Camera sau': '50MP, 8MP, 5MP',
            'Camera trước': '13MP',
            'CPU': 'Exynos 1380',
            'RAM': '8GB',
            'Bộ nhớ trong': '128GB',
            'Pin': '5000mAh, 25W'
        },
        description: 'Galaxy A35 với màn hình Super AMOLED sống động, pin 5000mAh và camera 50MP chất lượng.'
    },
    {
        id: 28,
        name: 'Xiaomi Redmi 13C 128GB',
        brand: 'Xiaomi',
        price: 3290000,
        oldPrice: 3990000,
        discount: 18,
        image: 'https://cdn.tgdd.vn/Products/Images/42/316965/xiaomi-redmi-13c-den-thumb-600x600.jpg',
        category: 'phone',
        ram: 6,
        storage: 128,
        rating: 3,
        hot: false,
        specs: {
            'Màn hình': '6.74", IPS LCD 90Hz',
            'Camera sau': '50MP, 2MP',
            'Camera trước': '8MP',
            'CPU': 'MediaTek Helio G85',
            'RAM': '6GB',
            'Bộ nhớ trong': '128GB',
            'Pin': '5000mAh, 18W'
        },
        description: 'Redmi 13C là lựa chọn giá rẻ với pin 5000mAh, camera 50MP và màn hình lớn 6.74 inch.'
    },
    {
        id: 29,
        name: 'OPPO Find X6 Pro 5G 512GB',
        brand: 'OPPO',
        price: 21990000,
        oldPrice: 26990000,
        discount: 19,
        image: 'https://cdn.tgdd.vn/Products/Images/42/301970/oppo-find-x6-pro-den-thumb-600x600.jpg',
        category: 'phone',
        ram: 16,
        storage: 512,
        rating: 5,
        hot: true,
        specs: {
            'Màn hình': '6.82", AMOLED 120Hz',
            'Camera sau': '50MP, 50MP, 50MP',
            'Camera trước': '32MP',
            'CPU': 'Snapdragon 8 Gen 2',
            'RAM': '16GB',
            'Bộ nhớ trong': '512GB',
            'Pin': '5000mAh, 100W'
        },
        description: 'OPPO Find X6 Pro flagship đỉnh cao với bộ 3 camera Hasselblad 50MP và sạc nhanh 100W.'
    },
    {
        id: 30,
        name: 'Vivo X100 Pro 5G 512GB',
        brand: 'Vivo',
        price: 25990000,
        oldPrice: 29990000,
        discount: 13,
        image: 'https://cdn.tgdd.vn/Products/Images/42/316771/vivo-x100-pro-xanh-thumb-600x600.jpg',
        category: 'phone',
        ram: 16,
        storage: 512,
        rating: 5,
        hot: true,
        specs: {
            'Màn hình': '6.78", AMOLED 120Hz',
            'Camera sau': '50MP, 50MP, 50MP',
            'Camera trước': '32MP',
            'CPU': 'Dimensity 9300',
            'RAM': '16GB',
            'Bộ nhớ trong': '512GB',
            'Pin': '5400mAh, 100W'
        },
        description: 'Vivo X100 Pro flagship cao cấp với camera Zeiss, chip Dimensity 9300 mạnh mẽ và sạc nhanh 100W.'
    }
];

// ==================== CART MANAGEMENT ====================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('#cartCount').forEach(el => {
        el.textContent = cartCount;
    });
}

function addToCart(productId, quantity = 1) {
    // Kiểm tra đăng nhập
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        if (confirm('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!\n\nBạn có muốn chuyển đến trang đăng nhập không?')) {
            window.location.href = 'login.html';
        }
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show notification
    showNotification('Đã thêm sản phẩm vào giỏ hàng!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartItemQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
}

function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// ==================== NOTIFICATION ====================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3`;
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ==================== FORMAT CURRENCY ====================
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// ==================== RENDER PRODUCT CARD ====================
function renderProductCard(product) {
    return `
        <div class="col-md-3 col-sm-6 col-6">
            <div class="card product-card">
                ${product.hot ? '<span class="badge bg-danger product-badge">HOT</span>' : ''}
                ${product.discount ? `<span class="badge bg-warning product-badge" style="top: ${product.hot ? '45px' : '10px'}">-${product.discount}%</span>` : ''}
                <a href="chitiet.html?id=${product.id}">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                </a>
                <div class="card-body">
                    <h5 class="product-name">
                        <a href="chitiet.html?id=${product.id}" class="text-decoration-none text-dark">${product.name}</a>
                    </h5>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div class="product-price">${formatCurrency(product.price)}</div>
                        ${product.oldPrice ? `<div class="product-old-price">${formatCurrency(product.oldPrice)}</div>` : ''}
                    </div>
                    <div class="product-rating mb-2">
                        ${'<i class="fas fa-star"></i>'.repeat(product.rating)}
                        ${'<i class="far fa-star"></i>'.repeat(5 - product.rating)}
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary w-100 btn-sm" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Thêm vào giỏ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ==================== RENDER PRODUCT CARD WITHOUT BADGES ====================
function renderProductCardWithoutBadges(product) {
    return `
        <div class="col-md-3 col-sm-6 col-6">
            <div class="card product-card">
                <a href="chitiet.html?id=${product.id}">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                </a>
                <div class="card-body">
                    <h5 class="product-name">
                        <a href="chitiet.html?id=${product.id}" class="text-decoration-none text-dark">${product.name}</a>
                    </h5>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div class="product-price">${formatCurrency(product.price)}</div>
                        ${product.oldPrice ? `<div class="product-old-price">${formatCurrency(product.oldPrice)}</div>` : ''}
                    </div>
                    <div class="product-rating mb-2">
                        ${'<i class="fas fa-star"></i>'.repeat(product.rating)}
                        ${'<i class="far fa-star"></i>'.repeat(5 - product.rating)}
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary w-100 btn-sm" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Thêm vào giỏ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ==================== LOAD HOT PRODUCTS ====================
function loadHotProducts() {
    const hotProductsContainer = document.getElementById('hotProducts');
    if (!hotProductsContainer) return;

    const hotProducts = products.filter(p => p.hot).slice(0, 8);
    hotProductsContainer.innerHTML = hotProducts.map(product => renderProductCardWithoutBadges(product)).join('');
}

// ==================== LOAD DISCOUNT PRODUCTS ====================
function loadDiscountProducts() {
    const discountProductsContainer = document.getElementById('discountProducts');
    if (!discountProductsContainer) return;

    const discountProducts = products.filter(p => p.discount > 0).slice(0, 8);
    discountProductsContainer.innerHTML = discountProducts.map(product => renderProductCardWithoutBadges(product)).join('');
}

// ==================== LOAD BEST SELLING PRODUCTS ====================
function loadBestSellingProducts() {
    const bestSellingProductsContainer = document.getElementById('bestSellingProducts');
    if (!bestSellingProductsContainer) return;

    const bestSellingProducts = products.filter(p => p.bestSelling).slice(0, 8);
    bestSellingProductsContainer.innerHTML = bestSellingProducts.map(product => renderProductCardWithoutBadges(product)).join('');
}

// ==================== BACK TO TOP ====================
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== BANNER SWIPER ====================
function initBannerSwiper() {
    if (typeof Swiper !== 'undefined' && document.querySelector('.bannerSwiper')) {
        new Swiper('.bannerSwiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }
}

// ==================== SEARCH FUNCTIONALITY ====================
function initSearch() {
    const searchForms = document.querySelectorAll('.search-form');
    searchForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchInput = form.querySelector('#searchInput');
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                window.location.href = `sanpham.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
    });
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    loadHotProducts();
    loadDiscountProducts();
    loadBestSellingProducts();
    initBackToTop();
    initBannerSwiper();
    initSearch();
});
