const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiService = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  },

  // Auth endpoints
  async register(email, password, userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, ...userData }),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  async getCurrentUser() {
    const data = await this.request('/auth/me');
    return data.user;
  },

  async updateProfile(updates) {
    const data = await this.request('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.user;
  },

  // Product endpoints
  async getProducts(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const data = await this.request(`/products?${queryParams}`);
    return data.products;
  },

  async getProduct(id) {
    const data = await this.request(`/products/${id}`);
    return data.product;
  },

  async createProduct(productData) {
    const data = await this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return data.product;
  },

  async updateProduct(id, updates) {
    const data = await this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.product;
  },

  async deleteProduct(id) {
    await this.request(`/products/${id}`, { method: 'DELETE' });
  },

  async generateAIPosts(productData) {
    const data = await this.request('/products/generate-ai', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return data.aiPosts;
  },

  async saveAIPosts(productId, aiPosts) {
    const data = await this.request(`/products/${productId}/ai-posts`, {
      method: 'PUT',
      body: JSON.stringify({ aiPosts }),
    });
    return data.product;
  },

  async getArtisanProducts(artisanId) {
    const data = await this.request(`/products/artisan/${artisanId}`);
    return data.products;
  },

  // Order endpoints
  async createOrder(orderData) {
    const data = await this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return data;
  },

  async verifyPayment(paymentData) {
    const data = await this.request('/orders/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
    return data;
  },

  async getOrders() {
    const data = await this.request('/orders');
    return data.orders;
  },

  async getOrder(id) {
    const data = await this.request(`/orders/${id}`);
    return data.order;
  },

  async cancelOrder(id) {
    const data = await this.request(`/orders/${id}/cancel`, {
      method: 'PUT',
    });
    return data;
  },

  async acceptOrder(id) {
    const data = await this.request(`/orders/${id}/accept`, {
      method: 'PUT',
    });
    return data;
  },

  async rejectOrder(id) {
    const data = await this.request(`/orders/${id}/reject`, {
      method: 'PUT',
    });
    return data;
  },

  async getArtisanOrders() {
    const data = await this.request('/orders/artisan/orders');
    return data.orders;
  },

  logout() {
    localStorage.removeItem('token');
  },

  // Favourite endpoints
  async getFavourites() {
    const data = await this.request('/favourites');
    return data.products;
  },

  async getFavouriteIds() {
    const data = await this.request('/favourites/ids');
    return data.ids;
  },

  async addFavourite(productId) {
    await this.request(`/favourites/${productId}`, { method: 'POST' });
  },

  async removeFavourite(productId) {
    await this.request(`/favourites/${productId}`, { method: 'DELETE' });
  },

  // Trust Score endpoints
  async getTrustScore(artisanId) {
    const data = await this.request(`/trust/${artisanId}`);
    return data;
  },

  async analyzeTrustScore(artisanId) {
    const data = await this.request(`/trust/analyze/${artisanId}`, {
      method: 'POST',
    });
    return data;
  },

  async getPaymentRecommendation(artisanId) {
    const data = await this.request(`/trust/payment-recommendation/${artisanId}`);
    return data;
  },
};
