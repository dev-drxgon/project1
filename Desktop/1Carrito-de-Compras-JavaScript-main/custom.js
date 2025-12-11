document.addEventListener('DOMContentLoaded', function() {
    const allContainerCart = document.querySelector('.products');
    const containerBuyCart = document.querySelector('.card-items');
    const priceTotal = document.querySelector('.price-total');
    const amountProduct = document.querySelector('.count-product');
    
    // загружаем корзину из локального хранилища при загрузке страницы
    loadCartFromLocalStorage();
    
    
    function loadEventListeners() {
        if (allContainerCart) {
            allContainerCart.addEventListener('click', addProduct);
        }
        
        if (containerBuyCart) {
            containerBuyCart.addEventListener('click', deleteProduct);
        }
    }
    
    function addProduct(e) {
        e.preventDefault();
        if (e.target.classList.contains('btn-add-cart')) {
            const selectProduct = e.target.parentElement; 
            readTheContent(selectProduct);
        }
    }
    
    function deleteProduct(e) {
        if (e.target.classList.contains('delete-product')) {
            const deleteId = e.target.getAttribute('data-id');
    
            buyThings.forEach(value => {
                if (value.id == deleteId) {
                    let priceReduce = parseFloat(value.price) * parseFloat(value.amount);
                    totalCard = totalCard - priceReduce;
                    totalCard = totalCard.toFixed(2);
                }
            });
            buyThings = buyThings.filter(product => product.id !== deleteId);
            
            countProduct--;
            
            if (buyThings.length === 0) {
                priceTotal.innerHTML = 0;
                amountProduct.innerHTML = 0;
            }
            
            saveCartToLocalStorage();
            loadHtml();
        }
    }
    
    function readTheContent(product) {
        const infoProduct = {
            image: product.querySelector('div img').src,
            title: product.querySelector('.title').textContent,
            price: product.querySelector('div p span').textContent,
            id: product.querySelector('a').getAttribute('data-id'),
            amount: 1
        }
    
        totalCard = parseFloat(totalCard) + parseFloat(infoProduct.price);
        totalCard = totalCard.toFixed(2);
    
        const exist = buyThings.some(product => product.id === infoProduct.id);
        if (exist) {
            const pro = buyThings.map(product => {
                if (product.id === infoProduct.id) {
                    product.amount++;
                    return product;
                } else {
                    return product;
                }
            });
            buyThings = [...pro];
        } else {
            buyThings = [...buyThings, infoProduct];
            countProduct++;
        }
        
        saveCartToLocalStorage();
        loadHtml();
    }
    
    function loadHtml() {
        clearHtml();
        buyThings.forEach(product => {
            const {image, title, price, amount, id} = product;
            const row = document.createElement('div');
            row.classList.add('item');
            row.innerHTML = `
                <img src="${image}" alt="">
                <div class="item-content">
                    <h5>${title}</h5>
                    <h5 class="cart-price">${price}$</h5>
                    <h6>Amount: ${amount}</h6>
                </div>
                <span class="delete-product" data-id="${id}">X</span>
            `;
    
            if (containerBuyCart) {
                containerBuyCart.appendChild(row);
            }
            
            if (priceTotal) {
                priceTotal.innerHTML = totalCard;
            }
            
            if (amountProduct) {
                amountProduct.innerHTML = countProduct;
            }
        });
    }
    
    function clearHtml() {
        if (containerBuyCart) {
            containerBuyCart.innerHTML = '';
        }
    }
    
    // сохранение корзины в локальное хранилище
    function saveCartToLocalStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify({
            items: buyThings,
            total: totalCard,
            count: countProduct
        }));
    }
    
    // загрузка корзины из локального хранилища
    function loadCartFromLocalStorage() {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            const cartData = JSON.parse(savedCart);
            buyThings = cartData.items || [];
            totalCard = cartData.total || 0;
            countProduct = cartData.count || 0;
            
            if (amountProduct) {
                amountProduct.innerHTML = countProduct;
            }
            
            if (priceTotal) {
                priceTotal.innerHTML = totalCard;
            }
            
            loadHtml();
        }
    }
    
    loadEventListeners();
    loadHtml();
});
