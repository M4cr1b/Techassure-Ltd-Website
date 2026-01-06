// script.js - Techassure Ltd Logic

// --- CONFIGURATION ---
// REPLACE THESE with your actual n8n Webhook URLs when ready
const N8N_ORDER_WEBHOOK = "https://your-n8n-instance.com/webhook/order";
const N8N_ADMIN_DATA_WEBHOOK = "https://your-n8n-instance.com/webhook/admin-data";

// --- SECURITY & AUTHENTICATION ---

// 1. Credentials (HARDCODED FOR DEMO)
const ADMIN_USER = "BobBakerWins";
const ADMIN_PASS = "Abundance123"; 

// 2. Check Protection on Admin Page
// If we are on admin.html AND not logged in, kick user out.
if (window.location.pathname.includes("admin.html")) {
    if (sessionStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "login.html";
    }
}

// 3. Login Function
function handleLogin(e) {
    e.preventDefault();
    const userIn = document.getElementById('username').value;
    const passIn = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');
    const loader = document.getElementById('loader');

    if (userIn === ADMIN_USER && passIn === ADMIN_PASS) {
        // A. Hide Error if it was showing
        if(errorMsg) errorMsg.style.display = "none";
        
        // B. Show the Loading Animation
        if(loader) loader.style.display = "flex";

        // C. Set session flag
        sessionStorage.setItem("isLoggedIn", "true");

        // D. Wait 1.5 seconds, then redirect
        setTimeout(() => {
            window.location.href = "admin.html";
        }, 1500);

    } else {
        // Fail
        if(errorMsg) errorMsg.style.display = "block";
        // Shake animation for visual feedback
        const loginBox = document.querySelector('.login-box');
        if(loginBox) {
            loginBox.style.transform = "translateX(5px)";
            setTimeout(() => loginBox.style.transform = "translateX(0)", 100);
        }
    }
}

// 4. Logout Function
function logout() {
    sessionStorage.removeItem("isLoggedIn");
    window.location.href = "login.html";
}

// --- PRODUCT DATA (Consumer Electronics) ---
// This replaces the bakery items with Tech items
const products = [
    { 
        id: 101, 
        name: "iPhone 15 Pro", 
        category: "Phones",
        price: 15500.00, 
        image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=2070&auto=format&fit=crop",
        specs: "256GB | Titanium Black"
    },
    { 
        id: 102, 
        name: "MacBook Air M2", 
        category: "Laptops",
        price: 18000.00, 
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2070&auto=format&fit=crop",
        specs: "13.6-inch | 8GB RAM | 256GB SSD"
    },
    { 
        id: 103, 
        name: "Samsung Galaxy S24", 
        category: "Phones",
        price: 14200.00, 
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=2071&auto=format&fit=crop",
        specs: "Phantom Black | 256GB"
    },
    { 
        id: 104, 
        name: "Sony WH-1000XM5", 
        category: "Accessories",
        price: 4500.00, 
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1976&auto=format&fit=crop",
        specs: "Noise Cancelling | 30hr Battery"
    },
    { 
        id: 105, 
        name: "Dell XPS 13", 
        category: "Laptops",
        price: 19500.00, 
        image: "https://images.unsplash.com/photo-1593642632823-8f785667771d?q=80&w=2050&auto=format&fit=crop",
        specs: "Core i7 | 16GB RAM | 512GB SSD"
    },
    { 
        id: 106, 
        name: "Apple Watch Ultra 2", 
        category: "Accessories",
        price: 12000.00, 
        image: "https://images.unsplash.com/photo-1695954460783-29a3a1d95155?q=80&w=2070&auto=format&fit=crop",
        specs: "GPS + Cellular | 49mm Titanium"
    }
];

// --- CART LOGIC ---
let cart = JSON.parse(localStorage.getItem('techCart')) || [];

function saveCart() {
    localStorage.setItem('techCart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) { 
        existingItem.quantity += 1; 
    } else { 
        cart.push({ ...product, quantity: 1 }); 
    }
    
    saveCart();
    
    // UI Feedback (Simple Toast)
    alert(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

function updateCartUI() {
    // Update Badge Count
    const cartCount = document.querySelector('.cart-count');
    if(cartCount) {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'block' : 'none';
    }

    // Update Cart Modal List
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.querySelector('#cart-total');
    
    if (cartItemsContainer && cartTotalElement) {
        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; color:#888; margin-top:20px;">Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                totalPrice += item.price * item.quantity;
                cartItemsContainer.innerHTML += `
                    <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <img src="${item.image}" alt="${item.name}" style="width:50px; height:50px; object-fit:cover; border-radius:5px;">
                            <div class="item-info">
                                <h4 style="font-size:0.9rem; margin-bottom:2px;">${item.name}</h4>
                                <p style="font-size:0.8rem; color:#666;">GH₵ ${item.price.toLocaleString()} x ${item.quantity}</p>
                            </div>
                        </div>
                        <i class="fa-solid fa-trash remove-btn" style="color:#ef4444; cursor:pointer;" onclick="removeFromCart(${item.id})"></i>
                    </div>`;
            });
        }
        cartTotalElement.textContent = `GH₵ ${totalPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    }
}

// --- CHECKOUT LOGIC (Send to n8n) ---
async function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Input Validation
    const nameInput = document.getElementById('customer-name');
    const phoneInput = document.getElementById('customer-phone');
    const paymentInput = document.getElementById('payment-method');

    const customerName = nameInput ? nameInput.value.trim() : "";
    const customerPhone = phoneInput ? phoneInput.value.trim() : "";
    const paymentMethod = paymentInput ? paymentInput.value : "";

    if (!customerName || !customerPhone || !paymentMethod) {
        alert("Please fill in your Name, Phone, and Payment Method.");
        return;
    }

    const checkoutBtn = document.querySelector('.checkout-btn');
    const originalText = checkoutBtn.innerText;
    
    // Show Processing State
    checkoutBtn.innerText = "Processing Order...";
    checkoutBtn.disabled = true;

    // Prepare Payload
    const orderData = {
        order_id: "ORD-" + Math.floor(Math.random() * 10000),
        customer: {
            name: customerName,
            phone: customerPhone
        },
        payment_type: paymentMethod,
        items: cart,
        total_price: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        date: new Date().toISOString()
    };

    try {
        // MOCK SUCCESS (Remove this block when n8n is connected)
        await new Promise(r => setTimeout(r, 1500)); // Fake delay
        console.log("Mock Order Sent:", orderData);

        // --- SUCCESS HANDLING ---
        // Clear inputs & Cart
        if(nameInput) nameInput.value = "";
        if(phoneInput) phoneInput.value = "";
        cart = []; 
        saveCart();
        
        // Close Cart Overlay
        document.getElementById('cart-overlay').classList.remove('open');
        
        // Show Success Modal
        const successOverlay = document.getElementById('success-overlay');
        if(successOverlay) {
            successOverlay.classList.add('active');
        } else {
            alert("Order Received! Reference: " + orderData.order_id);
        }

    } catch (error) {
        console.error("Order Error:", error);
        alert("Could not connect to server. Please try again.");
    } finally {
        checkoutBtn.innerText = originalText;
        checkoutBtn.disabled = false;
    }
}

// --- ADMIN DASHBOARD LOGIC ---

async function loadAdminData() {
    const orderTableBody = document.getElementById('order-rows');
    const refreshBtn = document.getElementById('refresh-btn');

    if (!orderTableBody) return; 

    // UI Loading State
    orderTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem;"><i class="fa-solid fa-spinner fa-spin"></i> Fetching live orders...</td></tr>';
    if(refreshBtn) refreshBtn.disabled = true; 

    try {
        // MOCK DATA (Remove when connected to n8n)
        await new Promise(r => setTimeout(r, 1000));
        const orders = [
            { id: "ORD-9281", customer: "Kwame Mensah", product: "iPhone 15 Pro", status: "Pending" },
            { id: "ORD-9282", customer: "Sarah Doe", product: "MacBook Air M2", status: "Delivered" },
            { id: "ORD-9283", customer: "John Smith", product: "Sony WH-1000XM5", status: "Cancelled" }
        ];

        orderTableBody.innerHTML = '';

        if (orders.length === 0) {
            orderTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No active orders found.</td></tr>';
        } else {
            orders.forEach(order => {
                const statusColor = order.status === 'Pending' ? 'status-pending' : 
                                  order.status === 'Delivered' ? 'status-success' : '';
                
                const row = `
                    <tr>
                        <td class="order-id" style="font-family:monospace; font-weight:600;">#${order.id}</td>
                        <td>${order.customer}</td>
                        <td>${order.product}</td>
                        <td><span class="status-badge ${statusColor}">${order.status}</span></td>
                        <td>
                            <i class="fa-regular fa-eye action-icon" title="View Details"></i>
                        </td>
                    </tr>`;
                orderTableBody.innerHTML += row;
            });
        }

    } catch (error) {
        console.error("Admin Load Error:", error);
        orderTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Connection Failed.</td></tr>`;
    } finally {
        if(refreshBtn) refreshBtn.disabled = false;
    }
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. GLOBAL: Listeners
    
    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    
    // Logout Button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    // 2. PAGE SPECIFIC
    const refreshBtn = document.getElementById('refresh-btn');

    if (refreshBtn) {
        // === ADMIN PAGE ===
        refreshBtn.addEventListener('click', loadAdminData);
        loadAdminData(); // Auto load

    } else {
        // === CUSTOMER PAGE ===
        updateCartUI(); 
        
        // Populate Products Grid (If element exists)
        const productContainer = document.getElementById('product-list');
        if (productContainer) {
            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                // Inline styles for cards since they aren't in style.css yet
                card.style.cssText = "background:white; border-radius:10px; overflow:hidden; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1); transition:transform 0.3s;";
                
                card.innerHTML = `
                    <div style="height:200px; overflow:hidden;">
                        <img src="${product.image}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover;">
                    </div>
                    <div style="padding:1.5rem;">
                        <span style="font-size:0.75rem; color:#64748B; text-transform:uppercase; letter-spacing:1px;">${product.category}</span>
                        <h3 style="margin:5px 0; font-size:1.1rem;">${product.name}</h3>
                        <p style="font-size:0.85rem; color:#64748B; margin-bottom:1rem;">${product.specs}</p>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-weight:700; font-size:1.1rem; color:#2563EB;">GH₵ ${product.price.toLocaleString()}</span>
                            <button onclick="addToCart(${product.id})" style="background:#2563EB; color:white; border:none; width:35px; height:35px; border-radius:50%; cursor:pointer;">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                    </div>`;
                    
                // Add hover effect
                card.onmouseenter = () => card.style.transform = "translateY(-5px)";
                card.onmouseleave = () => card.style.transform = "translateY(0)";
                
                productContainer.appendChild(card);
            });
            
            // Set grid layout style
            productContainer.style.display = "grid";
            productContainer.style.gridTemplateColumns = "repeat(auto-fill, minmax(280px, 1fr))";
            productContainer.style.gap = "2rem";
            productContainer.style.padding = "2rem 5%";
        }
        
        // Cart Overlay Logic
        const realCheckoutBtn = document.querySelector('.cart-footer .checkout-btn');
        if(realCheckoutBtn) realCheckoutBtn.addEventListener('click', checkout);
        
        const cartIcon = document.querySelector('.cart-icon');
        const cartOverlay = document.getElementById('cart-overlay');
        const closeCartBtn = document.getElementById('close-cart');

        if (cartIcon && cartOverlay && closeCartBtn) {
            cartIcon.addEventListener('click', () => {
                cartOverlay.classList.add('open');
                cartOverlay.style.display = 'flex'; // Ensure flex is set
            });
            
            closeCartBtn.addEventListener('click', () => {
                cartOverlay.classList.remove('open');
                cartOverlay.style.display = 'none';
            });
            
            // Close on click outside
            cartOverlay.addEventListener('click', (e) => {
                if (e.target === cartOverlay) {
                    cartOverlay.classList.remove('open');
                    cartOverlay.style.display = 'none';
                }
            });
        }
    }
});

function closeSuccessModal() {
    document.getElementById('success-overlay').classList.remove('active');
}