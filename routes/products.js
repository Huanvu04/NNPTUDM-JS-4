const express = require('express');
const router = express.Router();
const { data } = require('../utils/data'); // data ở đây là mảng sản phẩm 

// Route: GET /api/v1/categories/:id/products
router.get('/:id/products', (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);
        
        // Lọc toàn bộ products có category.id tương ứng 
        const productsOfCategory = data.filter(product => product.category.id === categoryId);
        
        // Trả về JSON thay vì dùng res.render() để tránh lỗi "Failed to lookup view"
        res.status(200).json(productsOfCategory);
    } catch (error) {
        res.status(500).json({ error: "Đã xảy ra lỗi hệ thống" });
    }
});

module.exports = router;