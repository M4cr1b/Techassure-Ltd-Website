// script.js - Techassure Ltd Logic

// --- CONFIGURATION ---
// IMPORTANT: Ensure this is your PRODUCTION Webhook URL
const N8N_ORDER_WEBHOOK = "https://n8n.srv1191414.hstgr.cloud/webhook-test/d5f3a0ee-ab5f-4d3f-97de-4992373f430e";
const N8N_ADMIN_DATA_WEBHOOK = "https://n8n.srv1191414.hstgr.cloud/webhook-test/a080bec4-aa0d-4eec-8671-4648394a91ed";
// NEW: Webhook for Updating Status (You need to create this in n8n)
const N8N_UPDATE_WEBHOOK = "https://n8n.srv1191414.hstgr.cloud/webhook-test/3f3dc840-0bb2-4241-add5-7d7eefef00fa"; 

// --- SECURITY & AUTHENTICATION ---

// 1. Credentials
const ADMIN_USER = "BobBakerWins";
const ADMIN_PASS = "Abundance123"; 

// 2. Check Protection on Admin Page
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
        if(errorMsg) errorMsg.style.display = "none";
        if(loader) loader.style.display = "flex";

        sessionStorage.setItem("isLoggedIn", "true");

        setTimeout(() => {
            window.location.href = "admin.html";
        }, 1500);

    } else {
        if(errorMsg) errorMsg.style.display = "block";
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
    window.location.href = "landing.html";
}

// --- PRODUCT DATA (Consumer Electronics) ---
const products = [
    { 
        id: 101, 
        name: "iPhone 15 Pro", 
        category: "Phones",
        price: 15500.00, 
        image: "nitin-v-ym348z_Vdhg-unsplash.jpg",
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
        image: "https://images.unsplash.com/photo-1720556405438-d67f0f9ecd44?q=80&w=530&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        specs: "Core i7 | 16GB RAM | 512GB SSD"
    },
    { 
        id: 106, 
        name: "Apple Watch Ultra 2", 
        category: "Accessories",
        price: 12000.00, 
        image: "https://images.unsplash.com/photo-1664730022901-b1ef21076535?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    alert(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    if(cartCount) {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'block' : 'none';
    }

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

    const nameInput = document.getElementById('customer-name');
    const phoneInput = document.getElementById('customer-phone');
    const paymentInput = document.getElementById('payment-method');

    const customerName = nameInput ? nameInput.value.trim() : "";
    const customerPhone = phoneInput ? phoneInput.value.trim() : "";
    const paymentMethod = paymentInput ? paymentInput.value : "";

    if (!customerName || !customerPhone || !paymentMethod) {
        alert("Please fill in all details.");
        return;
    }

    const checkoutBtn = document.querySelector('.checkout-btn');
    const originalText = checkoutBtn.innerText;
    
    checkoutBtn.innerText = "Processing Order...";
    checkoutBtn.disabled = true;

    const orderData = {
        order_id: "ORD-" + Math.floor(Math.random() * 10000),
        customer: { name: customerName, phone: customerPhone },
        payment_type: paymentMethod,
        items: cart,
        total_price: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        date: new Date().toISOString()
    };

    try {
        const response = await fetch(N8N_ORDER_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const result = await response.text(); 
        
        if(nameInput) nameInput.value = "";
        if(phoneInput) phoneInput.value = "";
        cart = []; 
        saveCart();
        document.getElementById('cart-overlay').classList.remove('open');
        const successOverlay = document.getElementById('success-overlay');
        if(successOverlay) successOverlay.classList.add('active');
        else alert("Order Received!");

    } catch (error) {
        console.error("Order Error:", error);
        alert("Connection Failed.");
    } finally {
        checkoutBtn.innerText = originalText;
        checkoutBtn.disabled = false;
    }
}

// --- ADMIN DASHBOARD LOGIC (Merged: View + Update) ---

// 1. Fetch Orders (With Smart Header Detection AND Edit Button)
async function loadAdminData() {
    const orderTableBody = document.getElementById('order-rows');
    const refreshBtn = document.getElementById('refresh-btn');

    if (!orderTableBody) return; 

    orderTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem;"><i class="fa-solid fa-spinner fa-spin"></i> Connecting to database...</td></tr>';
    if(refreshBtn) refreshBtn.disabled = true; 

    try {
        const response = await fetch(N8N_ADMIN_DATA_WEBHOOK, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const orders = await response.json();

        orderTableBody.innerHTML = '';

        if (!Array.isArray(orders) || orders.length === 0) {
            orderTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 2rem;">No active orders found in database.</td></tr>';
        } else {
            orders.forEach(order => {
                // Smart Field Detection Helper
                const findKey = (obj, candidates) => {
                    const lowerKeys = Object.keys(obj).map(k => k.toLowerCase());
                    for (let candidate of candidates) {
                        if (obj[candidate]) return obj[candidate];
                        const index = lowerKeys.indexOf(candidate.toLowerCase());
                        if (index !== -1) return obj[Object.keys(obj)[index]];
                    }
                    return null;
                };

                const id = findKey(order, ['row_number', 'id', 'order id', 'order number']) || 'N/A';
                const customer = findKey(order, ['customer_name', 'customer', 'name', 'full name']) || 'Guest';
                const items = findKey(order, ['items', 'Product Name', 'products', 'device']) || 'Items';
                const rawStatus = findKey(order, ['status', 'state', 'delivery status']) || 'Received';

                // Status Badge Color
                const statusLower = String(rawStatus).toLowerCase();
                let statusColor = '';
                if (statusLower.includes('pending')) statusColor = 'status-pending';
                else if (statusLower.includes('delivered') || statusLower.includes('ready')) statusColor = 'status-success';
                else if (statusLower.includes('cancel')) statusColor = 'status-warning';

                // Render Row (Includes Edit Icon)
                const row = `
                    <tr>
                        <td class="order-id" style="font-family:monospace; font-weight:600;">#${id}</td>
                        <td>${customer}</td>
                        <td>${items}</td>
                        <td><span class="status-badge ${statusColor}">${rawStatus}</span></td>
                        <td>
                            <i class="fa-regular fa-eye action-icon" title="View Details"></i>
                            <i class="fa-solid fa-pen-to-square action-icon" 
                               onclick="openStatusModal('${id}', '${rawStatus}')" 
                               title="Edit Status" 
                               style="margin-left:15px; color:#2563EB;"></i>
                        </td>
                    </tr>`;
                orderTableBody.innerHTML += row;
            });
        }

    } catch (error) {
        console.error("Admin Load Error:", error);
        orderTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#ef4444; padding: 2rem;">Connection Failed.</td></tr>`;
    } finally {
        if(refreshBtn) refreshBtn.disabled = false;
    }
}

// 2. Open Status Modal
let currentEditOrderId = null;

function openStatusModal(orderId, currentStatus) {
    currentEditOrderId = orderId;
    const modal = document.getElementById('status-modal');
    const idLabel = document.getElementById('modal-order-id');
    const select = document.getElementById('new-status-select');
    
    if(idLabel) idLabel.innerText = "#" + orderId;
    if(select) select.value = currentStatus || "Pending";
    if(modal) modal.style.display = "flex";
}

function closeStatusModal() {
    const modal = document.getElementById('status-modal');
    if(modal) modal.style.display = "none";
    currentEditOrderId = null;
}

// 3. Save New Status
async function saveStatus() {
    if (!currentEditOrderId) return;
    
    const newStatus = document.getElementById('new-status-select').value;
    const btn = document.getElementById('save-status-btn');
    const originalText = btn.innerText;
    
    btn.innerText = "Updating...";
    btn.disabled = true;
    
    try {
        const response = await fetch(N8N_UPDATE_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                order_id: currentEditOrderId,
                status: newStatus
            })
        });
        
        if(response.ok) {
            alert("Status Updated Successfully!");
            closeStatusModal();
            loadAdminData(); // Refresh table to see change
        } else {
            throw new Error("Update failed");
        }
    } catch (e) {
        alert("Failed to update status. Check n8n webhook.");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

// --- NAVIGATION BAR LOGIC (Magic Line) ---
function initNavigation() {
    const navLinksContainer = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');
    
    if (navLinksContainer && links.length > 0) {
        const indicator = document.createElement('div');
        indicator.classList.add('nav-indicator');
        navLinksContainer.appendChild(indicator);

        function moveIndicator(element) {
            indicator.style.width = `${element.offsetWidth}px`;
            indicator.style.left = `${element.offsetLeft}px`;
        }

        let activeLink = null;
        const currentPath = window.location.pathname;

        links.forEach(link => {
            if (link.href.includes(currentPath) && currentPath !== "/") {
                link.classList.add('active');
                activeLink = link;
            } else if (currentPath === "/" && link.href.includes("index.html")) {
                link.classList.add('active');
                activeLink = link;
            }
        });

        if (activeLink) moveIndicator(activeLink);

        links.forEach(link => {
            link.addEventListener('mouseenter', () => moveIndicator(link));
        });

        navLinksContainer.addEventListener('mouseleave', () => {
            if (activeLink) {
                moveIndicator(activeLink);
            } else {
                indicator.style.width = '0';
            }
        });
    }
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Global Listeners
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    
    const adminLogoutBtn = document.getElementById('logout-btn');
    if (adminLogoutBtn) adminLogoutBtn.addEventListener('click', logout);

    // 2. Universal Exit Button (Always Active)
    const exitBtn = document.getElementById('universal-exit-btn');
    if (exitBtn) {
        exitBtn.addEventListener('click', () => {
            sessionStorage.removeItem("isLoggedIn"); 
            window.location.href = "landing.html";
        });
    }

    // 3. Save Status Button (For Admin Modal)
    const saveStatusBtn = document.getElementById('save-status-btn');
    if (saveStatusBtn) saveStatusBtn.addEventListener('click', saveStatus);

    // 4. Init Navigation
    initNavigation(); 

    // 5. Page Specific Logic
    const refreshBtn = document.getElementById('refresh-btn');

    if (refreshBtn) {
        // === ADMIN PAGE ===
        refreshBtn.addEventListener('click', loadAdminData);
        loadAdminData(); 

    } else {
        // === CUSTOMER PAGE LOGIC ===
        updateCartUI(); 
        
        // --- NEW: FILTER & RENDER LOGIC ---
        const productContainer = document.getElementById('product-list');
        const filterBtns = document.querySelectorAll('.filter-btn');

        if (productContainer) {
            
            // 1. Function to Render Products based on Category
            function renderProducts(category) {
                // Clear existing items
                productContainer.innerHTML = '';
                
                // Filter the data
                const filteredItems = (category === 'All') 
                    ? products 
                    : products.filter(item => item.category === category);

                // Animation for empty results
                if (filteredItems.length === 0) {
                    productContainer.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding:3rem; color:#888;">No products found in this category.</p>`;
                    return;
                }

                // Create Cards
                filteredItems.forEach(product => {
                    const card = document.createElement('div');
                    card.className = 'product-card';
                    card.style.cssText = "background:white; border-radius:10px; overflow:hidden; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1); transition:transform 0.3s; animation: fadeIn 0.5s ease;";
                    
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
                                <button onclick="addToCart(${product.id})" style="background:#2563EB; color:white; border:none; width:35px; height:35px; border-radius:50%; cursor:pointer; transition:0.2s;">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>
                        </div>`;
                        
                    // Add hover effects
                    card.onmouseenter = () => card.style.transform = "translateY(-5px)";
                    card.onmouseleave = () => card.style.transform = "translateY(0)";
                    
                    productContainer.appendChild(card);
                });
                
                // Set Grid Layout
                productContainer.style.display = "grid";
                productContainer.style.gridTemplateColumns = "repeat(auto-fill, minmax(280px, 1fr))";
                productContainer.style.gap = "2rem";
                productContainer.style.padding = "2rem 5%";
            }

            // 2. Add Click Listeners to Buttons
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Remove 'active' class from all
                    filterBtns.forEach(b => b.classList.remove('active'));
                    // Add 'active' to clicked
                    btn.classList.add('active');
                    
                    // Render based on button text (All, Phones, Laptops...)
                    renderProducts(btn.innerText.trim());
                });
            });

            // 3. Initial Render (Show All)
            renderProducts('All');
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
                cartOverlay.style.display = 'flex';
            });
            
            closeCartBtn.addEventListener('click', () => {
                cartOverlay.classList.remove('open');
                cartOverlay.style.display = 'none';
            });
            
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