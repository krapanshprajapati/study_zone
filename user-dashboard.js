// User Dashboard Functionality
class UserDashboard {
    constructor() {
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.loadUserData();
        this.setupEventListeners();
    }

    // ऑथेंटिकेशन चेक करें
    checkAuthentication() {
        if (!auth.currentUser) {
            window.location.href = 'login.html';
            return;
        }
    }

    // यूजर डेटा लोड करें
    loadUserData() {
        this.updateStats();
        this.loadProfile();
        this.loadOrders();
        this.loadDownloads();
        this.loadProducts();
        this.hideLoadingScreen();
    }

    // स्टैट्स अपडेट करें
    updateStats() {
        const user = auth.currentUser;
        if (!user) return;

        document.getElementById('totalOrders').textContent = user.orders?.length || 0;
        document.getElementById('totalDownloads').textContent = user.downloads?.length || 0;
        
        // एक्टिव प्रोडक्ट्स काउंट
        const activeProducts = user.orders?.filter(order => 
            order.status === 'success'
        ).length || 0;
        document.getElementById('activeProducts').textContent = activeProducts;

        // मेंबर शिप ड्यूरेशन
        const joinDate = new Date(user.createdAt);
        const today = new Date();
        const daysSinceJoin = Math.floor((today - joinDate) / (1000 * 60 * 60 * 24));
        document.getElementById('memberSince').textContent = daysSinceJoin;
    }

    // प्रोफाइल लोड करें
    loadProfile() {
        const user = auth.currentUser;
        if (!user) return;

        document.getElementById('profileName').value = user.name;
        document.getElementById('profileEmail').value = user.email;
        document.getElementById('profilePhone').value = user.profile?.phone || '';
        document.getElementById('profileCity').value = user.profile?.city || '';
        document.getElementById('profileEducation').value = user.profile?.education || '';
        document.getElementById('profileExam').value = user.profile?.examTarget || '';
    }

    // ऑर्डर लोड करें
    loadOrders() {
        const user = auth.currentUser;
        const ordersList = document.getElementById('ordersList');
        
        if (!user || !user.orders || user.orders.length === 0) {
            ordersList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-light);">
                    <i class="fas fa-shopping-bag" style="font-size: 3rem; margin-bottom: 15px;"></i>
                    <h3>अभी तक कोई ऑर्डर नहीं</h3>
                    <p>अपना पहला ऑर्डर करें और यहाँ देखें</p>
                    <button onclick="window.location.href='index.html'" class="offer-btn">
                        <i class="fas fa-shopping-cart"></i> प्रोडक्ट्स देखें
                    </button>
                </div>
            `;
            return;
        }

        ordersList.innerHTML = user.orders.map(order => `
            <div class="order-card">
                <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 10px;">
                    <div>
                        <h4 style="margin: 0 0 5px 0;">${order.product}</h4>
                        <p style="margin: 0; color: var(--text-light); font-size: 0.9rem;">
                            ऑर्डर ID: ${order.id} | ${new Date(order.date).toLocaleDateString('hi-IN')}
                        </p>
                    </div>
                    <div style="text-align: right;">
                        <span style="background: var(--success); color: white; padding: 5px 10px; border-radius: 15px; font-size: 0.8rem;">
                            ₹${order.amount}
                        </span>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    <button class="offer-btn" onclick="viewOrderDetails('${order.id}')" style="padding: 8px 15px;">
                        <i class="fas fa-eye"></i> डिटेल्स
                    </button>
                    <button class="offer-btn" onclick="downloadInvoice('${order.id}')" style="padding: 8px 15px;">
                        <i class="fas fa-receipt"></i> इनवॉइस
                    </button>
                </div>
            </div>
        `).join('');
    }

    // डाउनलोड हिस्ट्री लोड करें
    loadDownloads() {
        const user = auth.currentUser;
        const downloadsList = document.getElementById('downloadsList');
        
        if (!user || !user.downloads || user.downloads.length === 0) {
            downloadsList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-light);">
                    <i class="fas fa-download" style="font-size: 3rem; margin-bottom: 15px;"></i>
                    <h3>अभी तक कोई डाउनलोड नहीं</h3>
                    <p>प्रोडक्ट्स खरीदें और डाउनलोड करें</p>
                </div>
            `;
            return;
        }

        downloadsList.innerHTML = user.downloads.map(download => `
            <div class="download-card">
                <div style="display: flex; justify-content: between; align-items: start;">
                    <div>
                        <h4 style="margin: 0 0 5px 0;">${download.chapter}</h4>
                        <p style="margin: 0; color: var(--text-light); font-size: 0.9rem;">
                            ${download.product} | ${new Date(download.date).toLocaleDateString('hi-IN')}
                        </p>
                    </div>
                    <div style="text-align: right;">
                        <span style="color: var(--success); font-size: 0.8rem;">
                            <i class="fas fa-check-circle"></i> सफल
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // यूजर प्रोडक्ट्स लोड करें
    loadProducts() {
        const user = auth.currentUser;
        const userProducts = document.getElementById('userProducts');
        
        if (!user || !user.orders || user.orders.length === 0) {
            userProducts.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-light);">
                    <i class="fas fa-book" style="font-size: 3rem; margin-bottom: 15px;"></i>
                    <h3>कोई प्रोडक्ट्स नहीं</h3>
                    <p>अपना पहला प्रोडक्ट खरीदें</p>
                </div>
            `;
            return;
        }

        const successfulOrders = user.orders.filter(order => order.status === 'success');
        userProducts.innerHTML = successfulOrders.map(order => `
            <div class="folder">
                <div class="folder-icon">
                    <i class="fas fa-book"></i>
                </div>
                <h3>${order.product}</h3>
                <p>खरीदा गया: ${new Date(order.date).toLocaleDateString('hi-IN')}</p>
                <div class="price">₹${order.amount}</div>
                <button onclick="accessProduct('${order.id}')">
                    <i class="fas fa-external-link-alt"></i> एक्सेस करें
                </button>
            </div>
        `).join('');
    }

    // इवेंट लिसनर्स सेटअप
    setupEventListeners() {
        // प्रोफाइल फॉर्म सबमिशन
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateProfile();
            });
        }
    }

    // प्रोफाइल अपडेट
    async updateProfile() {
        const profileData = {
            name: document.getElementById('profileName').value,
            phone: document.getElementById('profilePhone').value,
            city: document.getElementById('profileCity').value,
            education: document.getElementById('profileEducation').value,
            examTarget: document.getElementById('profileExam').value
        };

        try {
            await auth.updateProfile(profileData);
            this.showNotification('प्रोफाइल सफलतापूर्वक अपडेट हो गई', 'success');
        } catch (error) {
            this.showNotification(error, 'error');
        }
    }

    // नोटिफिकेशन शो करें
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
            <span>${message}</span>
        `;

        // स्टाइल्स एड करें
        if (!document.querySelector('#notificationStyles')) {
            const style = document.createElement('style');
            style.id = 'notificationStyles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 10px;
                    color: white;
                    z-index: 10000;
                    animation: slideIn 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .notification.success { background: var(--success); }
                .notification.error { background: var(--secondary); }
                .notification.info { background: var(--primary); }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    // लोडिंग स्क्रीन हाइड करें
    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
        }, 1000);
    }
}

// ग्लोबल फंक्शन्स
function showTab(tabName) {
    // सभी टैब्स हाइड करें
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.dashboard-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // सेलेक्टेड टैब शो करें
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

function goBack() {
    window.location.href = 'index.html';
}

function viewOrderDetails(orderId) {
    const user = auth.currentUser;
    const order = user.orders.find(o => o.id === orderId);
    
    if (order) {
        alert(`ऑर्डर डिटेल्स:\n\nप्रोडक्ट: ${order.product}\nऑर्डर ID: ${order.id}\nरकम: ₹${order.amount}\nतारीख: ${new Date(order.date).toLocaleDateString('hi-IN')}\nस्टेटस: ${order.status}`);
    }
}

function accessProduct(orderId) {
    window.location.href = `download.html?order=${orderId}`;
}

function changePassword() {
    alert('This feature will be available soon!');
}

function exportData() {
    const user = auth.currentUser;
    const dataStr = JSON.stringify(user, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `studyzone-data-${user.id}.json`;
    link.click();
}

function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        // Remove user from localStorage
        const users = JSON.parse(localStorage.getItem('studyzone_users')) || [];
        const updatedUsers = users.filter(u => u.id !== auth.currentUser.id);
        localStorage.setItem('studyzone_users', JSON.stringify(updatedUsers));
        localStorage.removeItem('currentUser');
        
        alert('Account deleted successfully');
        window.location.href = 'index.html';
    }
}

// डैशबोर्ड इनिशियलाइज करें
document.addEventListener('DOMContentLoaded', () => {
    new UserDashboard();
});