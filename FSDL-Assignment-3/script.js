// Product Data
const products = [
    // --- MEN (6 Items) ---
    {
        id: 1,
        name: "Yellow Speedster Elite",
        category: "Men",
        price: 15500,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 4,
        name: "Formal Oxford Shirt",
        category: "Men",
        price: 3200,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 5,
        name: "Leather Biker Jacket",
        category: "Men",
        price: 18000,
        image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 6,
        name: "Casual Grey Hoodie",
        category: "Men",
        price: 3800,
        image: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?q=80&w=600&auto=format&fit=crop"
    },

    // --- WOMEN (6 Items) ---
    {
        id: 7,
        name: "Floral Summer Dress",
        category: "Women",
        price: 4200,
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 8,
        name: "Elegant Evening Gown",
        category: "Women",
        price: 12500,
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 9,
        name: "Chic Blazer",
        category: "Women",
        price: 6500,
        image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=600&auto=format&fit=crop" // Fixed: Blazer
    },
    {
        id: 10,
        name: "High-Waist Jeans",
        category: "Women",
        price: 3500,
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 11,
        name: "Boho Maxi Skirt",
        category: "Women",
        price: 2800,
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 12,
        name: "Cozy Knit Sweater",
        category: "Women",
        price: 4500,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop"
    },

    // --- KIDS (6 Items) ---
    {
        id: 14,
        name: "Princess Party Dress",
        category: "Kids",
        price: 3500,
        image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 15,
        name: "Denim Overalls",
        category: "Kids",
        price: 2200,
        image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 17,
        name: "Cute Winter Beanie",
        category: "Kids",
        price: 900,
        image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=600&auto=format&fit=crop"
    },

    // --- ACCESSORIES (6 Items) ---
    {
        id: 19,
        name: "Leather Messenger Bag",
        category: "Accessories",
        price: 6500,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 20,
        name: "Aviator Sunglasses",
        category: "Accessories",
        price: 2500,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 21,
        name: "Minimalist Watch",
        category: "Accessories",
        price: 4500,
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 22,
        name: "Silk Scarf",
        category: "Accessories",
        price: 1800,
        image: "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 23,
        name: "Canvas Tote Bag",
        category: "Accessories",
        price: 1200,
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop"
    },

];

// Cart & Wishlist State
let cart = [];
let wishlist = [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartCount = document.getElementById('cart-count');
const wishlistCount = document.getElementById('wishlist-count');
const cartItemsContainer = document.getElementById('cart-items');
const wishlistItemsContainer = document.getElementById('wishlist-items');
const cartTotalElement = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutTotalDisplay = document.getElementById('checkout-total-display');
const checkoutForm = document.getElementById('checkout-form');
const newsletterForm = document.getElementById('newsletter-form');
const categoryLinks = document.querySelectorAll('#category-filters a');
const searchInput = document.getElementById('search-input');
const loginForm = document.getElementById('login-form');

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    // Check URL Params for category
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');

    if (categoryParam) {
        categoryLinks.forEach(link => {
            link.classList.remove('active', 'btn-dark');
            link.classList.add('btn-outline-dark');
            if (link.dataset.filter === categoryParam) {
                link.classList.remove('btn-outline-dark');
                link.classList.add('active', 'btn-dark');
            }
        });
        const filtered = products.filter(p => p.category === categoryParam);
        renderProducts(filtered);
    } else {
        renderProducts(products);
    }
    setupEventListeners();
    updateWishlistUI(); // Init Wishlist UI
});

// Setup Event Listeners
function setupEventListeners() {
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = checkoutForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Processing...';
            submitBtn.disabled = true;
            setTimeout(() => {
                cart = [];
                updateCartUI();
                const modal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
                modal.hide();
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                checkoutForm.reset();
                alert('Payment Successful! Thank you for your order.');
            }, 1500);
        });
    }

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = newsletterForm.querySelector('button');
            btn.innerText = 'Subscribed!';
            btn.classList.remove('btn-danger');
            btn.classList.add('btn-success');
            newsletterForm.reset();
            setTimeout(() => {
                btn.innerText = 'Subscribe';
                btn.classList.remove('btn-success');
                btn.classList.add('btn-danger');
            }, 3000);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = products.filter(p => p.name.toLowerCase().includes(term));
            renderProducts(filtered);
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            modal.hide();
            alert('Welcome back! You are now logged in.');
        });
    }
}

// Render Products
function renderProducts(items) {
    if (items.length === 0) {
        productGrid.innerHTML = `<div class="col-12 text-center py-5"><h4 class="text-muted">No products found.</h4></div>`;
        return;
    }

    productGrid.innerHTML = items.map(product => {
        const isWishlisted = wishlist.includes(product.id);
        const heartClass = isWishlisted ? 'fa-solid text-danger' : 'fa-regular';

        // Lightweight SVG Placeholder for fallback
        // Lightweight SVG Placeholder for fallback (cleaner, no single quotes)
        const fallbackImage = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22800%22%20viewBox%3D%220%200%20600%20800%22%3E%3Crect%20width%3D%22600%22%20height%3D%22800%22%20fill%3D%22%23f8f9fa%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20fill%3D%22%23dee2e6%22%20dy%3D%22.3em%22%20text-anchor%3D%22middle%22%3EProduct%20Image%3C%2Ftext%3E%3C%2Fsvg%3E";


        return `
        <div class="col-lg-3 col-md-4 col-6 mb-4 animate-fade-in">
            <div class="product-card h-100">
                <div class="product-img-wrapper">
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         class="product-img"
                         loading="lazy"
                         onerror="this.onerror=null; this.src='${fallbackImage}'">
                    <div class="product-actions">
                        <button class="action-btn" onclick="addToCart(${product.id})" title="Add to Cart">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                        <button class="action-btn" onclick="openQuickView(${product.id})" title="View Details">
                            <i class="fa-regular fa-eye"></i>
                        </button>
                        <button class="action-btn" onclick="toggleWishlist(${product.id})" title="Add to Wishlist">
                            <i class="${heartClass} fa-heart" id="wishlist-icon-${product.id}"></i>
                        </button>
                    </div>
                </div>
                <div class="product-body text-center">
                    <span class="product-category">${product.category}</span>
                    <h5 class="product-title">${product.name}</h5>
                    <div class="product-price">Rs ${product.price.toLocaleString()}</div>
                </div>
            </div>
        </div>
    `}).join('');
}

// Add to Cart
window.addToCart = function (productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
    const badge = document.querySelector('.cart-badge');
    badge.style.transform = 'scale(1.5)';
    setTimeout(() => badge.style.transform = 'scale(1)', 200);
};

window.removeFromCart = function (productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
};

window.updateQuantity = function (productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
};

window.openQuickView = function (productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    document.getElementById('qv-image').src = product.image;
    document.getElementById('qv-category').innerText = product.category;
    document.getElementById('qv-title').innerText = product.name;
    document.getElementById('qv-price').innerText = `Rs ${product.price.toLocaleString()}`;
    const addBtn = document.getElementById('qv-add-btn');
    addBtn.onclick = function () {
        addToCart(product.id);
        addBtn.innerText = "Added!";
        setTimeout(() => addBtn.innerText = "Add to Cart", 1500);
    };
    const modal = new bootstrap.Modal(document.getElementById('quickViewModal'));
    modal.show();
}

// Add from Wishlist with Feedback
window.addFromWishlist = function (productId, btn) {
    addToCart(productId);
    btn.innerText = "In Cart";
    btn.classList.remove('btn-dark');
    btn.classList.add('btn-success');
    btn.disabled = true;

    // Reset button after 2 seconds
    setTimeout(() => {
        btn.innerText = "Add to Cart";
        btn.classList.remove('btn-success');
        btn.classList.add('btn-dark');
        btn.disabled = false;
    }, 2000);

    // Open Cart Sidebar to show item
    const cartOffcanvas = new bootstrap.Offcanvas(document.getElementById('cartSidebar'));
    cartOffcanvas.show();
}

// Wishlist Logic
window.toggleWishlist = function (productId) {
    if (wishlist.includes(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
    } else {
        wishlist.push(productId);
    }
    // Update Icons
    const icon = document.getElementById(`wishlist-icon-${productId}`);
    if (icon) {
        if (wishlist.includes(productId)) {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid', 'text-danger');
        } else {
            icon.classList.remove('fa-solid', 'text-danger');
            icon.classList.add('fa-regular');
        }
    }
    updateWishlistUI();
}

function updateWishlistUI() {
    if (wishlist.length > 0) {
        wishlistCount.innerText = wishlist.length;
        wishlistCount.style.display = 'block';

        const wishlistProducts = products.filter(p => wishlist.includes(p.id));

        wishlistItemsContainer.innerHTML = wishlistProducts.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="flex-grow-1">
                    <h6 class="mb-0 fw-bold">${item.name}</h6>
                    <small class="text-muted">Rs ${item.price.toLocaleString()}</small>
                    <div class="mt-2">
                         <button class="btn btn-sm btn-dark py-1 px-3 rounded-pill" onclick="addFromWishlist(${item.id}, this)">Add to Cart</button>
                    </div>
                </div>
                <button class="btn text-danger" onclick="toggleWishlist(${item.id})">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `).join('');
    } else {
        wishlistCount.style.display = 'none';
        wishlistItemsContainer.innerHTML = `
            <div class="text-center text-muted mt-5">
                <i class="fa-regular fa-heart fa-3x mb-3 opacity-25"></i>
                <p>Your wishlist is empty</p>
            </div>
        `;
    }
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center text-muted mt-5">
                <i class="fa-solid fa-basket-shopping fa-3x mb-3 opacity-25"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        checkoutBtn.disabled = true;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="flex-grow-1">
                    <h6 class="mb-0 fw-bold">${item.name}</h6>
                    <small class="text-muted">Rs ${item.price.toLocaleString()}</small>
                    <div class="d-flex align-items-center mt-2 gap-2">
                        <button class="btn btn-sm btn-outline-secondary py-0 px-2" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="small fw-bold">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary py-0 px-2" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="btn text-danger" onclick="removeFromCart(${item.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `).join('');
        checkoutBtn.disabled = false;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalString = 'Rs ' + total.toLocaleString();
    cartTotalElement.innerText = totalString;
    if (checkoutTotalDisplay) checkoutTotalDisplay.innerText = totalString;
}
