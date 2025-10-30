// Admin JavaScript for Study Zone

// Sample data (in real application, this would come from backend)
let orders = JSON.parse(localStorage.getItem('adminOrders')) || [];
let products = JSON.parse(localStorage.getItem('adminProducts')) || [];
let customers = JSON.parse(localStorage.getItem('adminCustomers')) || [];

// Initialize admin panel
function initAdmin() {
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }, 1500);

    // Load sample data if empty
    if (orders.length === 0) {
        loadSampleData();
    }

    // Update stats
    updateStats();
    
    // Load recent orders
    loadRecentOrders();
    
    // Load all orders
    loadAllOrders();
    
    // Load products
    loadProducts();
    
    // Load customers
    loadCustomers();
    
    // Set current year in footer
    const footer = document.querySelector('.footer-bottom p');
    if (footer) {
        footer.innerHTML = `© ${new Date().getFullYear()} Study Zone - Admin Panel | सभी अधिकार सुरक्षित`;
    }
}

// Load sample data for demonstration
function loadSampleData() {
    // Sample orders
    orders = [
        {
            id: 'SZ001',
            product: 'SSC CGL Complete Pack',
            customer: 'Rahul Sharma',
            email: 'rahul@example.com',
            phone: '9876543210',
            city: 'Indore',
            amount: 399,
            status: 'success',
            date: '2024-01-15',
            paymentId: 'pay_001'
        },
        {
            id: 'SZ002',
            product: 'RRB NTPC Complete',
            customer: 'Priya Singh',
            email: 'priya@example.com',
            phone: '9876543211',
            city: 'Bhopal',
            amount: 349,
            status: 'success',
            date: '2024-01-14',
            paymentId: 'pay_002'
        },
        {
            id: 'SZ003',
            product: 'MP Police Constable Complete',
            customer: 'Amit Verma',
            email: 'amit@example.com',
            phone: '9876543212',
            city: 'Jabalpur',
            amount: 299,
            status: 'pending',
            date: '2024-01-13',
            paymentId: 'pay_003'
        },
        {
            id: 'SZ004',
            product: 'IBPS PO Complete Pack',
            customer: 'Neha Gupta',
            email: 'neha@example.com',
            phone: '9876543213',
            city: 'Gwalior',
            amount: 399,
            status: 'success',
            date: '2024-01-12',
            paymentId: 'pay_004'
        },
        {
            id: 'SZ005',
            product: 'SSC CHSL Complete',
            customer: 'Rajesh Kumar',
            email: 'rajesh@example.com',
            phone: '9876543214',
            city: 'Ujjain',
            amount: 299,
            status: 'failed',
            date: '2024-01-11',
            paymentId: 'pay_005'
        }
    ];

    // Sample products
    products = [
        {
            id: 1,
            name: 'SSC CGL Complete Pack',
            price: 399,
            originalPrice: 599,
            category: 'ssc',
            description: 'Complete preparation for SSC CGL Tier 1 & 2 - Math, Reasoning, English, GK',
            tags: 'ssc, cgl, tier1, tier2, complete, math, reasoning, english, gk'
        },
        {
            id: 2,
            name: 'RRB NTPC Complete',
            price: 349,
            originalPrice: 549,
            category: 'railway',
            description: 'CBT 1 & 2 preparation with practice questions and shortcuts',
            tags: 'rrb, ntpc, cbt1, cbt2, railway, math, reasoning'
        },
        {
            id: 3,
            name: 'MP Police Constable Complete',
            price: 299,
            originalPrice: 499,
            category: 'mp-exams',
            description: 'General knowledge, reasoning, math for MP Police constable exam',
            tags: 'mp, police, constable, mpesb, vyapam, general, knowledge, reasoning'
        }
    ];

    // Save to localStorage
    localStorage.setItem('adminOrders', JSON.stringify(orders));
    localStorage.setItem('adminProducts', JSON.stringify(products));
    localStorage.setItem('adminCustomers', JSON.stringify(customers));
}

// Update statistics
function updateStats() {
    const totalRevenue = orders
        .filter(order => order.status === 'success')
        .reduce((sum, order) => sum + order.amount, 0);
    
    const totalOrders = orders.length;
    const successOrders = orders.filter(order => order.status === 'success').length;
    const successRate = totalOrders > 0 ? Math.round((successOrders / totalOrders) * 100) : 0;

    document.getElementById('totalRevenue').textContent = `₹${totalRevenue}`;
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('successRate').textContent = `${successRate}%`;
}

// Show tab content
function showTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.admin-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Update active nav
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => link.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// Load recent orders
function loadRecentOrders() {
    const recentOrdersContainer = document.getElementById('recentOrders');
    const recentOrders = orders.slice(0, 5); // Get last 5 orders
    
    recentOrdersContainer.innerHTML = '';
    
    recentOrders.forEach(order => {
        const statusClass = `status-${order.status}`;
        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <div>${order.id}</div>
            <div>${order.product}</div>
            <div>${order.customer}</div>
            <div>₹${order.amount}</div>
            <div><span class="status-badge ${statusClass}">${order.status}</span></div>
            <div>${order.date}</div>
        `;
        recentOrdersContainer.appendChild(row);
    });
}

// Load all orders
function loadAllOrders() {
    const allOrdersContainer = document.getElementById('allOrders');
    
    allOrdersContainer.innerHTML = '';
    
    orders.forEach(order => {
        const statusClass = `status-${order.status}`;
        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <div>${order.id}</div>
            <div>${order.product}</div>
            <div>
                <strong>${order.customer}</strong><br>
                <small>${order.email}</small><br>
                <small>${order.phone}</small>
            </div>
            <div>₹${order.amount}</div>
            <div><span class="status-badge ${statusClass}">${order.status}</span></div>
            <div>
                <button class="btn btn-primary" onclick="viewOrder('${order.id}')">View</button>
                <button class="btn btn-success" onclick="updateOrderStatus('${order.id}', 'success')">Approve</button>
            </div>
        `;
        allOrdersContainer.appendChild(row);
    });
}

// Filter orders by status
function filterOrders(status) {
    const allOrdersContainer = document.getElementById('allOrders');
    let filteredOrders = orders;
    
    if (status !== 'all') {
        filteredOrders = orders.filter(order => order.status === status);
    }
    
    allOrdersContainer.innerHTML = '';
    
    filteredOrders.forEach(order => {
        const statusClass = `status-${order.status}`;
        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <div>${order.id}</div>
            <div>${order.product}</div>
            <div>
                <strong>${order.customer}</strong><br>
                <small>${order.email}</small><br>
                <small>${order.phone}</small>
            </div>
            <div>₹${order.amount}</div>
            <div><span class="status-badge ${statusClass}">${order.status}</span></div>
            <div>
                <button class="btn btn-primary" onclick="viewOrder('${order.id}')">View</button>
                <button class="btn btn-success" onclick="updateOrderStatus('${order.id}', 'success')">Approve</button>
            </div>
        `;
        allOrdersContainer.appendChild(row);
    });
}

// View order details
function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        alert(`Order Details:\n\nOrder ID: ${order.id}\nProduct: ${order.product}\nCustomer: ${order.customer}\nEmail: ${order.email}\nPhone: ${order.phone}\nCity: ${order.city}\nAmount: ₹${order.amount}\nStatus: ${order.status}\nDate: ${order.date}\nPayment ID: ${order.paymentId}`);
    }
}

// Update order status
function updateOrderStatus(orderId, status) {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        localStorage.setItem('adminOrders', JSON.stringify(orders));
        loadAllOrders();
        loadRecentOrders();
        updateStats();
        alert(`Order ${orderId} status updated to ${status}`);
    }
}

// Load products
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-actions">
                <button class="btn btn-primary" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div style="display: flex; justify-content: space-between; margin: 15px 0;">
                <span style="color: var(--success); font-weight: bold;">₹${product.price}</span>
                <span style="text-decoration: line-through; color: var(--text-light);">₹${product.originalPrice}</span>
            </div>
            <div style="background: var(--light); padding: 10px; border-radius: 8px;">
                <strong>Category:</strong> ${product.category}<br>
                <strong>Tags:</strong> ${product.tags}
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Show product form
function showProductForm() {
    document.getElementById('productForm').style.display = 'block';
}

// Hide product form
function hideProductForm() {
    document.getElementById('productForm').style.display = 'none';
    resetProductForm();
}

// Reset product form
function resetProductForm() {
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productOriginalPrice').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productTags').value = '';
    document.getElementById('productCategory').value = 'ssc';
}

// Save product
function saveProduct() {
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    const originalPrice = document.getElementById('productOriginalPrice').value;
    const description = document.getElementById('productDescription').value;
    const tags = document.getElementById('productTags').value;
    const category = document.getElementById('productCategory').value;
    
    if (!name || !price) {
        alert('Please fill in all required fields');
        return;
    }
    
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name: name,
        price: parseInt(price),
        originalPrice: parseInt(originalPrice) || parseInt(price) + 100,
        category: category,
        description: description,
        tags: tags
    };
    
    products.push(newProduct);
    localStorage.setItem('adminProducts', JSON.stringify(products));
    
    loadProducts();
    hideProductForm();
    updateStats();
    
    alert('Product saved successfully!');
}

// Edit product
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productOriginalPrice').value = product.originalPrice;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productTags').value = product.tags;
        document.getElementById('productCategory').value = product.category;
        
        showProductForm();
        
        // Change save button to update
        const saveBtn = document.querySelector('#productForm .pay-now-btn');
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Update Product';
        saveBtn.onclick = function() { updateProduct(productId); };
    }
}

// Update product
function updateProduct(productId) {
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        products[productIndex].name = document.getElementById('productName').value;
        products[productIndex].price = parseInt(document.getElementById('productPrice').value);
        products[productIndex].originalPrice = parseInt(document.getElementById('productOriginalPrice').value);
        products[productIndex].description = document.getElementById('productDescription').value;
        products[productIndex].tags = document.getElementById('productTags').value;
        products[productIndex].category = document.getElementById('productCategory').value;
        
        localStorage.setItem('adminProducts', JSON.stringify(products));
        loadProducts();
        hideProductForm();
        
        alert('Product updated successfully!');
    }
}

// Delete product
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('adminProducts', JSON.stringify(products));
        loadProducts();
        updateStats();
        alert('Product deleted successfully!');
    }
}

// Load customers
function loadCustomers() {
    const customersList = document.getElementById('customersList');
    
    // Extract unique customers from orders
    const uniqueCustomers = [];
    const customerEmails = new Set();
    
    orders.forEach(order => {
        if (!customerEmails.has(order.email)) {
            customerEmails.add(order.email);
            uniqueCustomers.push({
                id: `CUST${uniqueCustomers.length + 1}`,
                name: order.customer,
                email: order.email,
                phone: order.phone,
                city: order.city,
                orderCount: orders.filter(o => o.email === order.email).length
            });
        }
    });
    
    customersList.innerHTML = '';
    
    uniqueCustomers.forEach(customer => {
        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <div>${customer.id}</div>
            <div>${customer.name}</div>
            <div>${customer.email}</div>
            <div>${customer.phone}</div>
            <div>${customer.city}</div>
            <div>${customer.orderCount}</div>
        `;
        customersList.appendChild(row);
    });
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Export data function
function exportData() {
    const data = {
        orders: orders,
        products: products,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `studyzone-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// Import data function
function importData(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (data.orders && data.products) {
                    orders = data.orders;
                    products = data.products;
                    
                    localStorage.setItem('adminOrders', JSON.stringify(orders));
                    localStorage.setItem('adminProducts', JSON.stringify(products));
                    
                    updateStats();
                    loadRecentOrders();
                    loadAllOrders();
                    loadProducts();
                    loadCustomers();
                    
                    alert('Data imported successfully!');
                } else {
                    alert('Invalid data format');
                }
            } catch (error) {
                alert('Error parsing JSON file');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initAdmin);