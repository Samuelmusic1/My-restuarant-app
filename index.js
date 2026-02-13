import menuArray from './data.js'

const itemList = document.querySelector('#item-list')
const itemCheckout = document.querySelector('#itemCheckout')
const total = document.querySelector('#totals')
const btn = document.querySelector('#btn')
const pymtSect = document.querySelector('#pymtSect')
const orderBtn = document.querySelector('#orderBtn')

let showBtn = true
let orderTItle = false
const prices = []

for (let item of menuArray) {
    const div = document.createElement('div')
    div.classList.add('orderList')
    div.innerHTML = `
    <div class='leftSec'>
        <p class='emoji'>${item.emoji}</p>
        <div class='itemDish'>
            <h2 class='itemName'>${item.name}</h2>
            <p class='itemIng'>${item.ingredients.join(', ')}</p>
            <p class='itemPrice'>${item.price}</p>
        </div>
    </div>
        <button class='btn' id='${item.id}'>+</button>
    `
    itemList.append(div)
}

itemList.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) { 
        const clickedId = e.target.id;
        const item = menuArray.find(item => item.id.toString() === clickedId);
        if (item) {
        prices.push(item.price);
        createOrder(item);
        totalPrice(prices);
        if (showBtn) {
            const div = document.createElement('div')
            div.innerHTML = `<button class='orderbtn' id='orderbtn'>Complete order</button>`
            btn.append(div)
            showBtn = false
        }
        
    }
  }
});

function createOrder(item) {
    const div = document.createElement('div')
    div.classList.add('orders')
    let title = ''
    if (!orderTItle) {
        title = `<p class='orderTitle'>Your order</p>`
        orderTItle = true
    }
    div.innerHTML = `
    ${title}
    <div class='eachOrder' id='eachOrder' data-price='${item.price}'>
        <div>
            <p class='checkoutNames'>${item.name}<span class='remove' id='remove'>remove</span></p>
            <p></p>
        </div>
        <div class='checkoutPrice'>
            <span>${item.price}</span>
        </div>
    </div>
    `
    itemCheckout.append(div)
}

function totalPrice(prices) {
   let totalItemPrice = prices.reduce((total, price) => {
    return total + price
}, 0)

   let div = document.querySelector('.totalPrice');

    
    if (!div) {
        div = document.createElement('div')
        div.classList.add('totalPrice')
        total.append(div)
    }
    div.innerHTML = `
        <p>Total Price:</p>
        <p>${totalItemPrice}</p>
        `
        
    if (totalItemPrice === 0) {
        total.innerHTML = '';
        itemCheckout.innerHTML = '';
        btn.innerHTML = '';
        showBtn = false;
        orderTItle = false;
    }
}


itemCheckout.addEventListener('click', function(e){
    if(e.target.classList.contains('remove')){
        const orderItem = e.target.closest('.eachOrder')
        const price = Number(orderItem.dataset.price)

        const index = prices.indexOf(price)
        if (index > -1) {
            prices.splice(index, 1)
        }

        orderItem.remove()
        totalPrice(prices)
    }
})

btn.addEventListener('click', function(e) {
    if(e.target.classList.contains('orderbtn')){
        const div = document.createElement('div')
        div.classList.add('pymtcontainer')
        div.innerHTML = `
        <form id='myPymt'>
            <h1 class='pymtTitle'>Enter card details</h1>
            
            <div class='inputStyle'>
                <label></label>
                <input type='text' name='userName' placeholder='Enter your name' class='pymtdetails'>
            </div>
            
            <div class='inputStyle'>
                <label></label>
                <input type='text' placeholder='Enter card number' class='pymtdetails' inputmode='numeric' maxlength='19' id='cardNumber'>
            </div>
            
            <div class='inputStyle'>
                <label></label>
                <input type='text' inputmode='numeric' maxlength='4' placeholder='Enter CVV' class='pymtdetails' id='cvv'>
            </div>
            
            <button type='submit'class='payBtn'>Pay</button>
        </form>
        `
        pymtSect.append(div)
        pymtSect.style.display = 'flex'
        
        const myPymt = document.querySelector('#myPymt')

        myPymt.addEventListener('submit', function(e) {
            e.preventDefault();
            let name = myPymt.elements.userName.value
            const div = document.createElement('div')
            div.classList.add('compliments')
            div.innerHTML = `
            <p class='compMsg'>Thanks, ${name}! Your order is on its way!</p>
            `
            document.body.append(div)
            pymtSect.style.display = 'none'
            orderTItle = false
            showBtn = false
            itemCheckout.innerHTML = '';
            total.innerHTML = '';
            btn.innerHTML = '';
            prices.length = 0
            document.querySelectorAll('.btn').forEach(button => {
                button.disabled = true;
    });       
})
    }
    e.target.disabled = true
})

document.addEventListener('input', function(e) {
  if (e.target.id === 'cardNumber') {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(.{4})/g, '$1 ').trim();
    e.target.value = value;
  }
})

document.addEventListener('input', e => {
  if (e.target.id === 'cvv') {
    e.target.value = e.target.value.replace(/\D/g, '');
  }
})




