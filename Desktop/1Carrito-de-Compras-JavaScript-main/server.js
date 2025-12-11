const express = require('express');
const mysql = require('mysql2');
const nodemon = require('nodemon');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// доступ к файлам
app.use(express.static('.'));

// подключения к базе данных
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1111',
    database: 'test2'
});

// проверка подключение к базе данных
db.connect((err) => {
    if (err) {
        console.error('ошибка подключения к базе данных:', err);
        return;
    }
    console.log('подключено к базе данных');
});

// сохранение заказа
app.post('/api/place-order', (req, res) => {
    const { customerName, customerEmail, customerPhone, customerAddress, cartItems, totalAmount } = req.body;

    // проверка полей
    if (!customerName || !customerEmail || !customerPhone || !customerAddress || !cartItems || !totalAmount) {
        return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    // преобразование cartItems в json строку
    const orderItemsJson = cartItems.map(item => `${item.title} (${item.amount} шт.)`).join(', ');

    const sql = `
        INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, total_amount, order_items) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [customerName, customerEmail, customerPhone, customerAddress, totalAmount, orderItemsJson],
        (err, result) => {
            if (err) {
                console.error('Ошибка при сохранении заказа:', err);
                return res.status(500).json({ error: 'Ошибка при сохранении заказа' });
            }
            
            res.json({ 
                success: true, 
                message: 'Заказ успешно оформлен!', 
                orderId: result.insertId 
            });
        }
    );
});

// получение всех заказов
app.get('/api/orders', (req, res) => {
    const sql = 'SELECT * FROM orders ORDER BY order_date DESC';
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Ошибка при получении заказов:', err);
            return res.status(500).json({ error: 'Ошибка при получении заказов' });
        }
        
        res.json(results);
    });
});


app.get('/',(req,res)=>{
    res.sendFile(__dirname + "/index.html")
});

app.listen('3000',()=>
console.log('сервер успешно запущен'));
