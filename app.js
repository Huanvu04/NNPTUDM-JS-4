var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --- KHAI BÁO ROUTES (Đặt hết lên trên này) ---
// domain:port/api/v1/products
// domain:port/api/v1/users
// domain:port/api/v1/categories

app.use('/', require('./routes/index'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/products', require('./routes/products'));

// SỬA LỖI 1: Đưa categories lên đây (trước khi bắt lỗi 404)
var categoriesRouter = require('./routes/categories');
app.use('/api/v1/categories', categoriesRouter);

// --- XỬ LÝ LỖI ---

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler (SỬA LỖI 2: Trả về JSON ngay lập tức)
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Thay vì render view (gây lỗi nếu thiếu file pug), ta trả về JSON cho API
  console.error("Lỗi:", err.message); // Log lỗi ra terminal để dễ sửa
  
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;