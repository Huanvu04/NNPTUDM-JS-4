var express = require('express');
var router = express.Router();
// Import dữ liệu chung từ file data.js
const { data } = require('../utils/data'); 

// ----------------------------------------------
// 1. GET ALL CATEGORIES (Có hỗ trợ lọc theo ?name=...)
// ----------------------------------------------
router.get('/', function(req, res, next) {
  const { name } = req.query;
  
  // Trích xuất danh sách Category duy nhất từ mảng Products (vì data.js lưu dạng Product)
  let categories = [];
  const map = new Map();
  for (const item of data) {
      if (!map.has(item.category.id)) {
          map.set(item.category.id, true); // Đánh dấu đã lấy
          categories.push(item.category);
      }
  }

  // Nếu có tham số ?name trên URL thì lọc
  if (name) {
    categories = categories.filter(c => 
      c.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // QUAN TRỌNG: Phải có dòng này để trả kết quả, nếu không trình duyệt sẽ treo
  res.json(categories);
});

// ----------------------------------------------
// 2. GET CATEGORY BY ID
// ----------------------------------------------
router.get('/:id', function(req, res, next) {
  const id = parseInt(req.params.id);
  // Tìm sản phẩm có category id tương ứng để lấy thông tin category
  const product = data.find(p => p.category.id === id);
  
  if (product) {
    res.json(product.category);
  } else {
    res.status(404).json({ message: 'Không tìm thấy Category ID này' });
  }
});

// ----------------------------------------------
// 3. GET CATEGORY BY SLUG
// ----------------------------------------------
router.get('/slug/:slug', function(req, res, next) {
  const slug = req.params.slug;
  const product = data.find(p => p.category.slug === slug);
  
  if (product) {
    res.json(product.category);
  } else {
    res.status(404).json({ message: 'Không tìm thấy Slug này' });
  }
});

// ----------------------------------------------
// 4. CREATE NEW CATEGORY
// ----------------------------------------------
router.post('/', function(req, res, next) {
  const newCategory = {
    id: Date.now(), // Tạo ID giả lập
    name: req.body.name,
    slug: req.body.slug,
    image: req.body.image,
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  // Trong bài tập mock data, ta chỉ cần trả về object vừa tạo
  res.status(201).json(newCategory);
});

// ----------------------------------------------
// 5. EDIT CATEGORY
// ----------------------------------------------
router.put('/:id', function(req, res, next) {
  const id = parseInt(req.params.id);
  // Giả lập tìm thấy và update
  const updatedCategory = {
    id: id,
    name: req.body.name,
    slug: req.body.slug,
    image: req.body.image,
    updatedAt: new Date().toISOString()
  };
  res.json(updatedCategory);
});

// ----------------------------------------------
// 6. DELETE CATEGORY
// ----------------------------------------------
router.delete('/:id', function(req, res, next) {
  const id = parseInt(req.params.id);
  res.json({ message: `Đã xóa thành công category có id: ${id}`, status: true });
});

// ----------------------------------------------
// YÊU CẦU ĐẶC BIỆT: Lấy Products theo Category ID
// URL: /api/v1/categories/{id}/products
// ----------------------------------------------
router.get('/:id/products', function(req, res, next) {
  const categoryId = parseInt(req.params.id);
  
  // Lọc tất cả sản phẩm có category.id trùng với id trên URL
  const listProducts = data.filter(product => product.category.id === categoryId);
  
  // Trả về danh sách (dù rỗng cũng phải trả về mảng [])
  res.json(listProducts); 
});

module.exports = router;