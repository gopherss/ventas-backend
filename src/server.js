const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes');
const negocioRoutes = require('./routes/negocioRoutes');
const productoRoutes = require('./routes/productoRoutes');
const ventaRoutes = require('./routes/ventaRoutes');
const inventarioRoutes = require('./routes/inventarioRoutes');

const app = express();
app.set('PORT', process.env.PORT || 3000);
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());


const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use('/auth', authRoutes);
app.use('/negocios', negocioRoutes);
app.use('/productos', productoRoutes);
app.use('/ventas', ventaRoutes);
app.use('/inventario', inventarioRoutes);


app.listen(app.get('PORT'), (_) => {
    console.log(`Server running on http://localhost:${app.get('PORT')}`);
});
