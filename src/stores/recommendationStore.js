import { defineStore } from 'pinia';
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import api from '@/plugins/axios';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/authStore';

export const useRecommendationStore = defineStore('recommendation', () => {
  const questions = ref([]);
  const recommendations = ref([]);
  const products = ref([]);
  const orders = ref([]);
  const loading = ref(false);
  const loadingMore = ref(false);
  const productPage = ref(1);
  const productLastPage = ref(1);
  const hasMoreProducts = ref(false);
  const scoringMode = ref('');
  const isPersonalized = ref(false);
  const sessionId = ref(localStorage.getItem('gluzo_session_id') || '');
  const toast = useToast();

  /**
   * Ensure we have a session ID for guest tracking.
   */
  function ensureSessionId() {
    if (!sessionId.value) {
      sessionId.value = uuidv4();
      localStorage.setItem('gluzo_session_id', sessionId.value);
    }
    return sessionId.value;
  }

  /**
   * Fetch questionnaire questions from API.
   */
  async function fetchQuestions() {
    loading.value = true;
    try {
      const response = await api.get('/questionnaire/questions');
      questions.value = response.data.data.questions;
      return { success: true };
    } catch (err) {
      console.error('Error fetching questions:', err);
      return { success: false, message: err.response?.data?.message || 'Failed to load questions' };
    } finally {
      loading.value = false;
    }
  }

  /**
   * Submit questionnaire answers.
   */
  async function submitQuestionnaire(answers) {
    loading.value = true;
    try {
      const authStore = useAuthStore();
      const payload = { answers };

      // Only send session_id for guest users
      if (!authStore.user) {
        const sid = ensureSessionId();
        payload.session_id = sid;
      }

      const response = await api.post('/questionnaire', payload);
      return { success: true, data: response.data.data };
    } catch (err) {
      console.error('Error submitting questionnaire:', err);
      const message = err.response?.data?.message || 'Failed to submit questionnaire';
      return { success: false, message };
    } finally {
      loading.value = false;
    }
  }

  /**
   * Fetch product recommendations.
   */
  async function fetchRecommendations(limit = 10) {
    loading.value = true;
    try {
      const authStore = useAuthStore();
      const params = { limit };

      // Only send session_id for guest users
      if (!authStore.user && sessionId.value) {
        params.session_id = sessionId.value;
      }

      const response = await api.get('/recommendations', { params });
      const data = response.data.data;

      recommendations.value = data.recommendations;
      scoringMode.value = data.scoring_mode;
      isPersonalized.value = data.is_personalized;

      return { success: true };
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      const message = err.response?.data?.message || 'Failed to load recommendations';
      return { success: false, message };
    } finally {
      loading.value = false;
    }
  }

  /**
   * Fetch products (page 1 — resets list).
   */
  async function fetchProducts(perPage = 12) {
    loading.value = true;
    try {
      const response = await api.get('/products', {
        params: { page: 1, per_page: perPage },
      });
      const data = response.data.data;
      products.value = data.products ?? data;
      productPage.value = data.pagination?.current_page ?? 1;
      productLastPage.value = data.pagination?.last_page ?? 1;
      hasMoreProducts.value = productPage.value < productLastPage.value;
      return { success: true };
    } catch (err) {
      console.error('Error fetching products:', err);
      return { success: false, message: err.response?.data?.message || 'Failed to load products' };
    } finally {
      loading.value = false;
    }
  }

  /**
   * Load next page of products (appends to existing list).
   */
  async function loadMoreProducts(perPage = 12) {
    if (loadingMore.value || !hasMoreProducts.value) return { success: false };

    loadingMore.value = true;
    try {
      const nextPage = productPage.value + 1;
      const response = await api.get('/products', {
        params: { page: nextPage, per_page: perPage },
      });
      const data = response.data.data;
      const newProducts = data.products ?? data;
      products.value = [...products.value, ...newProducts];
      productPage.value = data.pagination?.current_page ?? nextPage;
      productLastPage.value = data.pagination?.last_page ?? 1;
      hasMoreProducts.value = productPage.value < productLastPage.value;
      return { success: true };
    } catch (err) {
      console.error('Error loading more products:', err);
      return { success: false, message: err.response?.data?.message || 'Failed to load more products' };
    } finally {
      loadingMore.value = false;
    }
  }

  /**
   * Mock purchase a product.
   */
  async function mockPurchase(productId, quantity = 1) {
    try {
      const response = await api.post('/orders/mock-purchase', {
        product_id: productId,
        quantity,
      });
      toast.success(response.data.message || 'Purchase recorded!');
      return { success: true, data: response.data.data };
    } catch (err) {
      console.error('Error recording purchase:', err);
      const message = err.response?.data?.message || 'Failed to record purchase';
      toast.error(message);
      return { success: false, message };
    }
  }

  /**
   * Fetch user's order history.
   */
  async function fetchOrders() {
    loading.value = true;
    try {
      const response = await api.get('/orders');
      orders.value = response.data.data;
      return { success: true };
    } catch (err) {
      console.error('Error fetching orders:', err);
      return { success: false, message: err.response?.data?.message || 'Failed to load orders' };
    } finally {
      loading.value = false;
    }
  }

  return {
    questions,
    recommendations,
    products,
    orders,
    loading,
    loadingMore,
    hasMoreProducts,
    scoringMode,
    isPersonalized,
    sessionId,
    ensureSessionId,
    fetchQuestions,
    submitQuestionnaire,
    fetchRecommendations,
    fetchProducts,
    loadMoreProducts,
    mockPurchase,
    fetchOrders,
  };
});
