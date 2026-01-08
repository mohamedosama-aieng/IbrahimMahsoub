/* ============================================
   Admin Dashboard JavaScript
   ============================================
   ⚠️ PRESERVATION LOCKED: This is a standalone admin panel. 
   ⚠️ DO NOT modify DataStore methods in app.js without checking usage here.
   ============================================ */

// === Section Navigation ===
function switchSection(sectionName) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionName) {
            item.classList.add('active');
        }
    });

    // Update sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`section-${sectionName}`).classList.add('active');

    // Update page title
    const titles = {
        dashboard: 'لوحة التحكم',
        services: 'الخدمات',
        products: 'المنتجات',
        offers: 'العروض',
        bookings: 'الحجوزات',
        settings: 'الإعدادات'
    };
    document.getElementById('pageTitle').textContent = titles[sectionName] || 'لوحة التحكم';

    // Refresh data
    loadSectionData(sectionName);
}

// === Modal Functions ===
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    // Reset forms
    const form = document.querySelector(`#${modalId} form`);
    if (form) form.reset();
}

// === Load Section Data ===
function loadSectionData(section) {
    switch (section) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'services':
            loadServices();
            break;
        case 'products':
            loadProducts();
            break;
        case 'offers':
            loadOffers();
            break;
        case 'bookings':
            loadBookings();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// === Dashboard ===
function loadDashboard() {
    // Stats
    document.getElementById('totalServices').textContent = DataStore.getServices().length;
    document.getElementById('totalProducts').textContent = DataStore.getProducts().length;
    document.getElementById('totalOffers').textContent = DataStore.getOffers().length;
    document.getElementById('totalBookings').textContent = DataStore.getBookings().length;

    // Recent bookings
    const bookings = DataStore.getBookings().slice(-5).reverse();
    const container = document.getElementById('recentBookings');

    if (bookings.length === 0) {
        container.innerHTML = '<p class="empty-state">لا توجد حجوزات</p>';
        return;
    }

    container.innerHTML = bookings.map(booking => {
        const service = DataStore.getServices().find(s => s.id === booking.serviceId);
        return `
            <div class="booking-item">
                <div class="booking-info">
                    <h4>${booking.name}</h4>
                    <span>${service ? service.name : 'خدمة'} - ${booking.date}</span>
                </div>
                <span class="status-badge status-${booking.status}">${getStatusText(booking.status)}</span>
            </div>
        `;
    }).join('');
}

function getStatusText(status) {
    const statuses = {
        pending: 'في الانتظار',
        confirmed: 'مؤكد',
        completed: 'مكتمل',
        cancelled: 'ملغي'
    };
    return statuses[status] || status;
}

// === Services ===
function loadServices() {
    const services = DataStore.getServices();
    const tbody = document.getElementById('servicesTable');

    if (services.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">لا توجد خدمات</td></tr>';
        return;
    }

    tbody.innerHTML = services.map(service => `
        <tr>
            <td>${service.icon || '✂️'}</td>
            <td>${service.name}</td>
            <td>${service.description}</td>
            <td>${service.price} ج.م</td>
            <td>
                <button class="action-btn edit" onclick="editService(${service.id})">✏️</button>
                <button class="action-btn delete" onclick="confirmDelete('service', ${service.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function editService(id) {
    const service = DataStore.getServices().find(s => s.id === id);
    if (!service) return;

    document.getElementById('serviceId').value = service.id;
    document.getElementById('serviceName').value = service.name;
    document.getElementById('serviceDescription').value = service.description;
    document.getElementById('servicePrice').value = service.price;
    document.getElementById('serviceIcon').value = service.icon || '✂️';
    document.getElementById('serviceModalTitle').textContent = 'تعديل خدمة';

    openModal('serviceModal');
}

// === Products ===
function loadProducts() {
    const products = DataStore.getProducts();
    const tbody = document.getElementById('productsTable');

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">لا توجد منتجات</td></tr>';
        return;
    }

    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>${product.price} ج.م</td>
            <td>
                <button class="action-btn edit" onclick="editProduct(${product.id})">✏️</button>
                <button class="action-btn delete" onclick="confirmDelete('product', ${product.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function editProduct(id) {
    const product = DataStore.getProducts().find(p => p.id === id);
    if (!product) return;

    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productModalTitle').textContent = 'تعديل منتج';

    openModal('productModal');
}

// === Offers ===
function loadOffers() {
    const offers = DataStore.getOffers();
    const tbody = document.getElementById('offersTable');

    if (offers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">لا توجد عروض</td></tr>';
        return;
    }

    tbody.innerHTML = offers.map(offer => `
        <tr>
            <td>${offer.title}</td>
            <td>${offer.description}</td>
            <td>${offer.oldPrice ? offer.oldPrice + ' ج.م' : '-'}</td>
            <td>${offer.newPrice ? offer.newPrice + ' ج.م' : (offer.discount || '-')}</td>
            <td>
                <button class="action-btn edit" onclick="editOffer(${offer.id})">✏️</button>
                <button class="action-btn delete" onclick="confirmDelete('offer', ${offer.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function editOffer(id) {
    const offer = DataStore.getOffers().find(o => o.id === id);
    if (!offer) return;

    document.getElementById('offerId').value = offer.id;
    document.getElementById('offerTitle').value = offer.title;
    document.getElementById('offerDescriptionInput').value = offer.description;
    document.getElementById('offerOldPrice').value = offer.oldPrice || '';
    document.getElementById('offerNewPrice').value = offer.newPrice || '';
    document.getElementById('offerBadge').value = offer.badge || '';
    document.getElementById('offerModalTitle').textContent = 'تعديل عرض';

    openModal('offerModal');
}

// === Bookings ===
function loadBookings() {
    const bookings = DataStore.getBookings();
    const tbody = document.getElementById('bookingsTable');

    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">لا توجد حجوزات</td></tr>';
        return;
    }

    tbody.innerHTML = bookings.map(booking => {
        const service = DataStore.getServices().find(s => s.id === booking.serviceId);
        return `
            <tr>
                <td>${booking.name}</td>
                <td>${booking.phone}</td>
                <td>${service ? service.name : 'غير محدد'}</td>
                <td>${booking.date}</td>
                <td>${booking.time}</td>
                <td><span class="status-badge status-${booking.status}">${getStatusText(booking.status)}</span></td>
                <td>
                    <select onchange="updateBookingStatus(${booking.id}, this.value)" style="padding: 0.25rem; background: var(--black); color: var(--white); border: 1px solid var(--gray); border-radius: 4px;">
                        <option value="pending" ${booking.status === 'pending' ? 'selected' : ''}>في الانتظار</option>
                        <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>مؤكد</option>
                        <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>مكتمل</option>
                        <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>ملغي</option>
                    </select>
                </td>
            </tr>
        `;
    }).join('');
}

function updateBookingStatus(id, status) {
    DataStore.updateBookingStatus(id, status);
    loadBookings();
    showNotification('تم تحديث حالة الحجز');
}

// === Settings ===
function loadSettings() {
    const settings = DataStore.getSettings();
    document.getElementById('settingPhone').value = settings.phone || '';
    document.getElementById('settingAddress').value = settings.address || '';
    document.getElementById('settingHours').value = settings.workingHours || '';
}

// === Delete Confirmation ===
let deleteTarget = { type: null, id: null };

function confirmDelete(type, id) {
    deleteTarget = { type, id };
    openModal('deleteModal');
}

function executeDelete() {
    const { type, id } = deleteTarget;

    switch (type) {
        case 'service':
            DataStore.deleteService(id);
            loadServices();
            break;
        case 'product':
            DataStore.deleteProduct(id);
            loadProducts();
            break;
        case 'offer':
            DataStore.deleteOffer(id);
            loadOffers();
            break;
    }

    closeModal('deleteModal');
    showNotification('تم الحذف بنجاح');
    loadDashboard();
}

// === Notification ===
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: var(--black-light);
        border: 1px solid ${type === 'success' ? 'var(--gold)' : '#f44336'};
        padding: 1rem 1.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

// === Form Handlers ===
document.addEventListener('DOMContentLoaded', () => {
    // Initialize
    DataStore.init();
    loadDashboard();

    // Set current date
    const today = new Date().toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('currentDate').textContent = today;

    // Nav click handlers
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            switchSection(item.dataset.section);
        });
    });

    // Delete confirmation
    document.getElementById('confirmDeleteBtn').addEventListener('click', executeDelete);

    // Service form
    document.getElementById('serviceForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const id = document.getElementById('serviceId').value;
        const data = {
            name: document.getElementById('serviceName').value,
            description: document.getElementById('serviceDescription').value,
            price: parseInt(document.getElementById('servicePrice').value),
            icon: document.getElementById('serviceIcon').value
        };

        if (id) {
            DataStore.updateService(parseInt(id), data);
            showNotification('تم تحديث الخدمة');
        } else {
            DataStore.addService(data);
            showNotification('تم إضافة الخدمة');
        }

        closeModal('serviceModal');
        loadServices();
        loadDashboard();
    });

    // Product form
    document.getElementById('productForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const id = document.getElementById('productId').value;
        const data = {
            name: document.getElementById('productName').value,
            description: document.getElementById('productDescription').value,
            price: parseInt(document.getElementById('productPrice').value)
        };

        if (id) {
            DataStore.updateProduct(parseInt(id), data);
            showNotification('تم تحديث المنتج');
        } else {
            DataStore.addProduct(data);
            showNotification('تم إضافة المنتج');
        }

        closeModal('productModal');
        loadProducts();
        loadDashboard();
    });

    // Offer form
    document.getElementById('offerForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const id = document.getElementById('offerId').value;
        const data = {
            title: document.getElementById('offerTitle').value,
            description: document.getElementById('offerDescriptionInput').value,
            oldPrice: parseInt(document.getElementById('offerOldPrice').value) || null,
            newPrice: parseInt(document.getElementById('offerNewPrice').value) || null,
            badge: document.getElementById('offerBadge').value
        };

        if (id) {
            DataStore.updateOffer(parseInt(id), data);
            showNotification('تم تحديث العرض');
        } else {
            DataStore.addOffer(data);
            showNotification('تم إضافة العرض');
        }

        closeModal('offerModal');
        loadOffers();
        loadDashboard();
    });

    // Settings form
    document.getElementById('settingsForm').addEventListener('submit', (e) => {
        e.preventDefault();

        DataStore.setSettings({
            phone: document.getElementById('settingPhone').value,
            address: document.getElementById('settingAddress').value,
            workingHours: document.getElementById('settingHours').value
        });

        showNotification('تم حفظ الإعدادات');
    });

    // Reset modal title on close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
});

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(-100px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
