// ===== Carousel Logic =====
let next = document.getElementById('next');
let prev = document.getElementById('prev');
let carousel = document.querySelector('.carousel');
let items = document.querySelectorAll('.carousel .item');
let countItem = items.length;
let active = 1;
let other_1 = null;
let other_2 = null;

next.onclick = () => {
    carousel.classList.remove('prev');
    carousel.classList.add('next');
    active = active + 1 >= countItem ? 0 : active + 1;
    other_1 = active - 1 < 0 ? countItem - 1 : active - 1;
    other_2 = active + 1 >= countItem ? 0 : active + 1;
    changeSlider();
}

prev.onclick = () => {
    carousel.classList.remove('next');
    carousel.classList.add('prev');
    active = active - 1 < 0 ? countItem - 1 : active - 1;
    other_1 = active + 1 >= countItem ? 0 : active + 1;
    other_2 = other_1 + 1 >= countItem ? 0 : other_1 + 1;
    changeSlider();
}

const changeSlider = () => {
    let itemOldActive = document.querySelector('.carousel .item.active');
    if(itemOldActive) itemOldActive.classList.remove('active');

    let itemOldOther_1 = document.querySelector('.carousel .item.other_1');
    if(itemOldOther_1) itemOldOther_1.classList.remove('other_1');

    let itemOldOther_2 = document.querySelector('.carousel .item.other_2');
    if(itemOldOther_2) itemOldOther_2.classList.remove('other_2');

    items.forEach(e => {
        e.querySelector('.image img').style.animation = 'none';
        e.querySelector('.image figcaption').style.animation = 'none'; 
        void e.offsetWidth;
        e.querySelector('.image img').style.animation = '';
        e.querySelector('.image figcaption').style.animation = ''; 
    });

    items[active].classList.add('active');
    items[other_1].classList.add('other_1');
    items[other_2].classList.add('other_2');

    
    clearInterval(autoPlay);
    autoPlay = setInterval(() => {
        next.click();
    }, 5000);
}
/*
let autoPlay = setInterval(() => {
    next.click();
}, 5000);
 */
// ===== Contact Form Input Animation =====
const inputs = document.querySelectorAll(".contact-input");
inputs.forEach((ipt) => {
  ipt.addEventListener("focus", () =>{
    ipt.parentNode.classList.add("focus");
    ipt.parentNode.classList.add("not-empty");
  });
  ipt.addEventListener("blur", () =>{
    if(ipt.value == ""){
      ipt.parentNode.classList.remove("not-empty");
    }
    ipt.parentNode.classList.remove("focus");
  });
});

// ===== Cart Logic =====
let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');
let productCards = document.querySelectorAll('.carousel .item');

let carts = [];

// Load cart from localStorage on page start
window.addEventListener('DOMContentLoaded', () => {
  let savedCart = localStorage.getItem('cart');
  if (savedCart) {
    carts = JSON.parse(savedCart);
    renderCart();
  }
});

// Toggle cart sidebar
iconCart.addEventListener('click', () => {
  body.classList.toggle('showCart');
});
closeCart.addEventListener('click', () => {
  body.classList.remove('showCart'); // better than toggle
});

// Add to cart button logic
productCards.forEach((card, index) => {
  let btn = card.querySelector('.addToCart');
  btn.addEventListener('click', () => {
    let product = {
      id: index,
      name: card.querySelector('h2').innerText,
      price: parseFloat(card.querySelector('.price').innerText.replace('$', '')),
      image: card.querySelector('img').src
    };
    addToCart(product);
  });
});

function addToCart(product) {
  let position = carts.findIndex(item => item.id === product.id);
  if (position < 0) {
    carts.push({ ...product, quantity: 1 });
  } else {
    carts[position].quantity += 1;
  }
  renderCart();
  localStorage.setItem('cart', JSON.stringify(carts));
  showToast(product.name); // ✅ trigger toast
}

function showToast(productName) {
  // Remove existing toast if any
  let existing = document.querySelector('.cart-toast');
  if (existing) existing.remove();

  let toast = document.createElement('div');
  toast.classList.add('cart-toast');
  toast.innerHTML = `
    <span>✅ <strong>${productName}</strong> added to cart!</span>
  `;
  document.body.appendChild(toast);

  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 400);
  }, 1500);
}

function renderCart() {
  listCartHTML.innerHTML = '';
  let totalQuantity = 0;

  carts.forEach(cart => {
    totalQuantity += cart.quantity;
    let newCart = document.createElement('div');
    newCart.classList.add('item');
    newCart.dataset.id = cart.id;
    newCart.innerHTML = `
      <div class="image">
        <img src="${cart.image}" alt="">
      </div>
      <div class="name">${cart.name}</div>
      <div class="totalPrice">$${cart.price * cart.quantity}</div>
      <div class="quantity">
        <span class="minus"><</span>
        <span class="${cart.quantity === 0 ? 'zero' : ''}">${cart.quantity}</span>
        <span class="plus">></span>
      </div>
    `;
    listCartHTML.appendChild(newCart);
  });

  iconCartSpan.innerText = totalQuantity;
}

// Handle plus/minus clicks inside cart
listCartHTML.addEventListener('click', (event) => {
  let target = event.target;
  if (target.classList.contains('minus') || target.classList.contains('plus')) {
    let product_id = parseInt(target.closest('.item').dataset.id);
    let type = target.classList.contains('plus') ? 'plus' : 'minus';
    changeQuantity(product_id, type);
  }
});

function changeQuantity(product_id, type) {
  let position = carts.findIndex(item => item.id === product_id);
  if (position >= 0) {
    if (type === 'plus') {
      carts[position].quantity += 1;
    } else {
      carts[position].quantity -= 1;
      if (carts[position].quantity <= 0) {
        carts.splice(position, 1);
      }
    }
  }
  renderCart();
  localStorage.setItem('cart', JSON.stringify(carts)); 
}

