var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var loginRouter = require ('./src/routes/loginRoutes');
var clienteRouter = require('./src/routes/clienteRoutes');
var vendedorRouter = require('./src/routes/vendedorRoutes');
var zonaRouter = require('./src/routes/zonaRoutes');
var productoRouter = require('./src/routes/productoRoutes');
var ventaRouter = require('./src/routes/ventaRoutes');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use('/api', loginRouter);
app.use('/api/cliente', clienteRouter);
app.use('/api/vendedor', vendedorRouter);
app.use('/api/zona', zonaRouter);
app.use('/api/producto', productoRouter);
app.use('/api/venta', ventaRouter)

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
