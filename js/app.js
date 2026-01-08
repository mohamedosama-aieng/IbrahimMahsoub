/* ============================================
   IBRAHEEM MAHSOB - Main Application
   ============================================
   ⚠️ LOGIC LOCKED: This file couples tightly with HTML IDs (navToggle, offersSlider, etc).
   ⚠️ Do not rename object keys in DataStore without updating all HTML templates.
   ============================================ */

// === Data Store (Using LocalStorage) ===
const DataStore = {
    // Default data
    defaults: {
        services: [
            { id: 1, name: 'حلاقة كلاسيكية', description: 'قص شعر احترافي مع تصفيف مميز', price: 50, icon: '✂️' },
            { id: 2, name: 'تهذيب اللحية', description: 'تشكيل وتهذيب اللحية باحترافية', price: 30, icon: '🧔' },
            { id: 3, name: 'حلاقة ملكية', description: 'تجربة حلاقة VIP كاملة مع ماسك', price: 100, icon: '💈' },
            { id: 4, name: 'صبغة شعر', description: 'ألوان عصرية وصبغات طبيعية', price: 80, icon: '🎨' },
            { id: 5, name: 'حلاقة أطفال', description: 'قص شعر للأطفال بعناية', price: 35, icon: '👦' },
            { id: 6, name: 'سبا للشعر', description: 'علاج وترطيب عميق للشعر', price: 120, icon: '🧴' }
        ],
        products: [
            { id: 1, name: 'شامبو بريميوم', description: 'شامبو للعناية اليومية بالشعر', price: 150, image: null, category: 'hair' },
            { id: 2, name: 'جل تصفيف', description: 'جل تثبيت قوي', price: 80, image: null, category: 'styling' },
            { id: 3, name: 'زيت لحية', description: 'زيت طبيعي للحية', price: 120, image: null, category: 'beard' },
            { id: 4, name: 'صبغة شعر', description: 'صبغة طبيعية للشعر', price: 200, image: null, category: 'hair' },
            { id: 5, name: 'بلسم اللحية', description: 'مرطب ومنعم للحية', price: 90, image: null, category: 'beard' },
            { id: 6, name: 'واكس للشعر', description: 'تثبيت ومظهر طبيعي', price: 100, image: null, category: 'styling' }
        ],
        offers: [
            { id: 1, title: 'باقة العريس', description: 'حلاقة + لحية + ماسك + سبا', oldPrice: 300, newPrice: 200, badge: 'الأكثر طلباً' },
            { id: 2, title: 'خصم الطلاب', description: 'خصم 20% على جميع الخدمات', oldPrice: null, newPrice: null, badge: 'عرض خاص', discount: '20%' }
        ],
        bookings: [],
        settings: {
            phone: '01000000000',
            address: 'شارع الرئيسي، المنطقة',
            workingHours: 'يومياً من 10 صباحاً - 10 مساءً'
        }
    },

    // Initialize data
    init() {
        // Force reset if legacy data exists or version mismatch
        const DATA_VERSION = 'v2';
        if (localStorage.getItem('im_data_version') !== DATA_VERSION) {
            console.log('Migrating data to', DATA_VERSION);
            localStorage.clear(); // Clear all old data
            localStorage.setItem('im_data_version', DATA_VERSION);
        }

        if (!localStorage.getItem('im_services')) {
            this.setServices(this.defaults.services);
        }

        const storedProducts = this.getProducts();
        if (storedProducts.length < this.defaults.products.length || (storedProducts.length > 0 && !storedProducts[0].category)) {
            this.setProducts(this.defaults.products);
        }

        if (!localStorage.getItem('im_offers')) {
            this.setOffers(this.defaults.offers);
        }
        if (!localStorage.getItem('im_bookings')) {
            this.setBookings(this.defaults.bookings);
        }
        if (!localStorage.getItem('im_settings')) {
            this.setSettings(this.defaults.settings);
        }
    },

    // Services
    getServices() {
        return JSON.parse(localStorage.getItem('im_services')) || [];
    },
    setServices(services) {
        localStorage.setItem('im_services', JSON.stringify(services));
    },
    addService(service) {
        const services = this.getServices();
        service.id = Date.now();
        services.push(service);
        this.setServices(services);
        return service;
    },
    updateService(id, data) {
        const services = this.getServices();
        const index = services.findIndex(s => s.id === id);
        if (index !== -1) {
            services[index] = { ...services[index], ...data };
            this.setServices(services);
        }
    },
    deleteService(id) {
        const services = this.getServices().filter(s => s.id !== id);
        this.setServices(services);
    },

    // Products
    getProducts() {
        return JSON.parse(localStorage.getItem('im_products')) || [];
    },
    setProducts(products) {
        localStorage.setItem('im_products', JSON.stringify(products));
    },
    addProduct(product) {
        const products = this.getProducts();
        product.id = Date.now();
        products.push(product);
        this.setProducts(products);
        return product;
    },
    updateProduct(id, data) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...data };
            this.setProducts(products);
        }
    },
    deleteProduct(id) {
        const products = this.getProducts().filter(p => p.id !== id);
        this.setProducts(products);
    },

    // Offers
    getOffers() {
        return JSON.parse(localStorage.getItem('im_offers')) || [];
    },
    setOffers(offers) {
        localStorage.setItem('im_offers', JSON.stringify(offers));
    },
    addOffer(offer) {
        const offers = this.getOffers();
        offer.id = Date.now();
        offers.push(offer);
        this.setOffers(offers);
        return offer;
    },
    updateOffer(id, data) {
        const offers = this.getOffers();
        const index = offers.findIndex(o => o.id === id);
        if (index !== -1) {
            offers[index] = { ...offers[index], ...data };
            this.setOffers(offers);
        }
    },
    deleteOffer(id) {
        const offers = this.getOffers().filter(o => o.id !== id);
        this.setOffers(offers);
    },

    // Bookings
    getBookings() {
        return JSON.parse(localStorage.getItem('im_bookings')) || [];
    },
    setBookings(bookings) {
        localStorage.setItem('im_bookings', JSON.stringify(bookings));
    },
    addBooking(booking) {
        const bookings = this.getBookings();
        booking.id = Date.now();
        booking.status = 'pending';
        booking.createdAt = new Date().toISOString();
        bookings.push(booking);
        this.setBookings(bookings);
        return booking;
    },
    updateBookingStatus(id, status) {
        const bookings = this.getBookings();
        const index = bookings.findIndex(b => b.id === id);
        if (index !== -1) {
            bookings[index].status = status;
            this.setBookings(bookings);
        }
    },

    // Settings
    getSettings() {
        return JSON.parse(localStorage.getItem('im_settings')) || {};
    },
    setSettings(settings) {
        localStorage.setItem('im_settings', JSON.stringify(settings));
    }
};

// === UI Functions ===
const UI = {
    // Toggle mobile menu
    toggleMobileMenu() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
    },

    // Render offers on homepage
    renderOffers() {
        const container = document.getElementById('offersSlider');
        if (!container) return;

        const offers = DataStore.getOffers();

        if (offers.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--gray);">لا توجد عروض حالياً</p>';
            return;
        }

        container.innerHTML = offers.map(offer => `
            <div class="offer-card">
                <span class="offer-badge">${offer.badge || 'عرض'}</span>
                <h3>${offer.title}</h3>
                <p>${offer.description}</p>
                ${offer.oldPrice && offer.newPrice ? `
                    <div class="offer-price">
                        <span class="old-price">${offer.oldPrice} ج.م</span>
                        <span class="new-price">${offer.newPrice} ج.م</span>
                    </div>
                ` : offer.discount ? `
                    <div class="offer-price">
                        <span class="new-price">${offer.discount} خصم</span>
                    </div>
                ` : ''}
            </div>
        `).join('');
    },

    // Render services
    renderServices(containerId = 'servicesGrid') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const services = DataStore.getServices();

        container.innerHTML = services.map(service => `
            <div class="service-card">
                <div class="service-icon">${service.icon || '✂️'}</div>
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <span class="service-price">${service.price} ج.م</span>
            </div>
        `).join('');
    },

    // Render products
    renderProducts(containerId = 'productsGrid') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const products = DataStore.getProducts();

        if (products.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--gray); grid-column: 1/-1;">لا توجد منتجات حالياً</p>';
            return;
        }

        container.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    ${product.image ? `<img src="${product.image}" alt="${product.name}">` : `<span>${product.name.charAt(0)}</span>`}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <span class="product-price">${product.price} ج.م</span>
                </div>
            </div>
        `).join('');
    },

    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
};

// === Initialize ===
document.addEventListener('DOMContentLoaded', () => {
    // Initialize data store
    DataStore.init();

    // Initialize UI
    UI.toggleMobileMenu();
    UI.renderOffers();
    UI.renderServices();
    UI.renderProducts();
});

// === Export for admin usage ===
window.DataStore = DataStore;
window.UI = UI;
