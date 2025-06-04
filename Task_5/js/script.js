document.addEventListener('DOMContentLoaded', () => {
  const productList = document.getElementById('productList');
  const searchInput = document.getElementById('searchInput');
  let products = [];
  let filteredProducts = [];
  let selectedIndex = -1;

  fetch('data/products.json')
    .then(res => res.json())
    .then(data => {
      products = data;
      filteredProducts = products;
      displayProducts(filteredProducts);
    });

  function displayProducts(items) {
    productList.innerHTML = '';
    if (items.length === 0) {
      productList.innerHTML = '<p style="padding: 2rem; text-align:center;">No products found.</p>';
      selectedIndex = -1;
      return;
    }
    items.forEach((product, index) => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.setAttribute('data-index', index);
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="info">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="price">$${product.price}</div>
          <button onclick="addToCart('${product.id}')">Add to Cart</button>
        </div>
      `;
      productList.appendChild(card);
    });
    selectedIndex = -1;
  }

  // Debounce helper
  function debounce(func, delay) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      filteredProducts = products;
      displayProducts(filteredProducts);
      return;
    }
    filteredProducts = products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
    displayProducts(filteredProducts);
  }

  // Highlight product card at selectedIndex
  function highlightCard() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, i) => {
      card.classList.toggle('highlight', i === selectedIndex);
    });
  }

  // Keyboard nav
  searchInput.addEventListener('keydown', (e) => {
    const cards = document.querySelectorAll('.product-card');
    if (!cards.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % cards.length;
      highlightCard();
      cards[selectedIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + cards.length) % cards.length;
      highlightCard();
      cards[selectedIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (e.key === 'Enter' && selectedIndex !== -1) {
      e.preventDefault();
      const product = filteredProducts[selectedIndex];
      addToCart(product.id);
    }
  });

  searchInput.addEventListener('input', debounce(handleSearch, 300));
});

function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Product added to cart!');
}
