/**
 * MeuCaixa Tracking System
 *
 * Funcionalidades:
 * - Session ID generation
 * - SHA256 hashing para email e whatsapp
 * - Event deduplication (5s tolerance)
 * - N8N webhook integration
 * - Meta Pixel integration com hashes + external_id
 */

// ==================== CONFIG ====================
const TRACKING_CONFIG = {
  N8N_WEBHOOK_PAGEVIEW: 'https://meucaixa-n8n.x4ogwk.easypanel.host/webhook/page-view',
  N8N_WEBHOOK_IC: 'https://meucaixa-n8n.x4ogwk.easypanel.host/webhook/IC',
  SESSION_DURATION: 24 * 60 * 60 * 1000, // 24h
  DEDUP_TIMEOUT: 5000, // 5 seconds
  ASAAS_LINKS: {
    mensal: 'https://www.asaas.com/c/z2vua8g17geon3wi',
    anual: 'https://www.asaas.com/c/pyvss9mdn4f193yx'
  }
};

// ==================== SESSION ID ====================
function generateSessionId() {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function getOrCreateSessionId() {
  let sessionId = localStorage.getItem('meucaixa_session_id');
  let sessionTime = localStorage.getItem('meucaixa_session_time');

  const now = Date.now();

  // Se não existe ou expirou, cria novo
  if (!sessionId || !sessionTime || (now - parseInt(sessionTime)) > TRACKING_CONFIG.SESSION_DURATION) {
    sessionId = generateSessionId();
    localStorage.setItem('meucaixa_session_id', sessionId);
    localStorage.setItem('meucaixa_session_time', now.toString());
  }

  return sessionId;
}

// ==================== SHA256 HASH ====================
async function sha256(str) {
  const buffer = new TextEncoder().encode(str.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}


// ==================== DETECT DEVICE ====================
function getDeviceInfo() {
  const ua = navigator.userAgent;
  let device = 'desktop';
  let browser = 'unknown';

  if (/android/i.test(ua)) device = 'mobile';
  else if (/iphone|ipad|ipod/i.test(ua)) device = 'mobile';
  else if (/windows phone/i.test(ua)) device = 'mobile';

  if (/chrome/i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua)) browser = 'Safari';
  else if (/firefox/i.test(ua)) browser = 'Firefox';
  else if (/edge/i.test(ua)) browser = 'Edge';

  return { device, browser, ua };
}

// ==================== GET IP ====================
async function getClientIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (e) {
    console.warn('Não foi possível obter IP:', e);
    return 'unknown';
  }
}

// ==================== SEND TO N8N ====================
async function sendToN8N(webhookUrl, payload) {
  try {
    // Fire and forget (assíncrono)
    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    }).catch(err => console.warn('Erro ao enviar para N8N:', err));
  } catch (err) {
    console.warn('Erro ao enviar para N8N:', err);
  }
}

// ==================== GET UTM PARAMETERS ====================
function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || null,
    utm_medium: params.get('utm_medium') || null,
    utm_campaign: params.get('utm_campaign') || null,
    utm_content: params.get('utm_content') || null,
    utm_term: params.get('utm_term') || null
  };
}

// ==================== PAGEVIEW TRACKING ====================
async function trackPageView() {
  const sessionId = getOrCreateSessionId();

  const deviceInfo = getDeviceInfo();
  const ip = await getClientIP();
  const utm = getUTMParams();

  const payload = {
    external_id: sessionId,
    event: 'pageview',
    timestamp: new Date().toISOString(),
    page_url: window.location.href,
    referrer: document.referrer || null,
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
    device_type: deviceInfo.device,
    browser: deviceInfo.browser,
    ip: ip,
    user_agent: deviceInfo.ua
  };

  console.log('📊 Pageview:', payload);
  sendToN8N(TRACKING_CONFIG.N8N_WEBHOOK_PAGEVIEW, payload);
}

// ==================== BUTTON CLICK TRACKING ====================
function trackButtonClick(buttonId) {
  const sessionId = getOrCreateSessionId();

  const deviceInfo = getDeviceInfo();
  const utm = getUTMParams();

  const payload = {
    external_id: sessionId,
    event: 'button_click',
    button_id: buttonId,
    timestamp: new Date().toISOString(),
    page_url: window.location.href,
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
    device_type: deviceInfo.device
  };

  console.log('🖱️ Button click:', payload);
  sendToN8N(TRACKING_CONFIG.N8N_WEBHOOK_IC, payload);
}

// ==================== LEAD CAPTURE TRACKING ====================
async function trackLeadCapture(email, whatsapp, plan) {
  const sessionId = getOrCreateSessionId();

  // Hash email e whatsapp
  const emailHash = await sha256(email);
  const whatsappHash = await sha256(whatsapp);

  const deviceInfo = getDeviceInfo();
  const ip = await getClientIP();
  const utm = getUTMParams();

  // Determinar valor baseado no plano
  const planValues = {
    mensal: 39.90,
    anual: 358.80
  };

  const value = planValues[plan] || 39.90;

  const payload = {
    external_id: sessionId,
    event: 'lead_capture',
    timestamp: new Date().toISOString(),
    page_url: window.location.href,
    referrer: document.referrer || null,
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,

    user_data: {
      email: email,
      email_hash: emailHash,
      whatsapp: whatsapp,
      whatsapp_hash: whatsappHash
    },

    conversion_data: {
      event_type: 'InitiateCheckout',
      plan: plan,
      value: value,
      currency: 'BRL'
    },

    device_type: deviceInfo.device,
    browser: deviceInfo.browser,
    ip: ip,
    user_agent: deviceInfo.ua
  };

  console.log('📝 Lead capture:', payload);
  sendToN8N(TRACKING_CONFIG.N8N_WEBHOOK_IC, payload);

  // Enviar para Meta Pixel com hashes
  if (typeof fbq !== 'undefined') {
    fbq('track', 'InitiateCheckout', {
      value: value,
      currency: 'BRL',
      content_name: `Plano ${plan === 'mensal' ? 'Mensal' : 'Anual'}`,
      content_type: 'product',
      em: emailHash,
      ph: whatsappHash,
      external_id: sessionId
    });
    console.log('📱 Meta Pixel InitiateCheckout enviado');
  }

  return emailHash;
}

// ==================== FORM ERROR TRACKING ====================
function trackFormError(errorType) {
  const sessionId = getOrCreateSessionId();

  const payload = {
    external_id: sessionId,
    event: 'form_error',
    error_type: errorType,
    timestamp: new Date().toISOString(),
    page_url: window.location.href
  };

  console.log('⚠️ Form error:', payload);
  sendToN8N(TRACKING_CONFIG.N8N_WEBHOOK_IC, payload);
}

// ==================== VALIDAÇÕES ====================
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validateWhatsApp(whatsapp) {
  // Remove caracteres especiais para validação
  const clean = whatsapp.replace(/\D/g, '');
  // Deve ter 10 ou 11 dígitos (formato brasileiro)
  return clean.length >= 10 && clean.length <= 11;
}

function formatWhatsApp(value) {
  // Remove caracteres não numéricos
  let clean = value.replace(/\D/g, '');

  // Limita a 11 dígitos
  clean = clean.substring(0, 11);

  // Aplica máscara: (XX) XXXXX-XXXX
  if (clean.length === 0) return '';
  if (clean.length <= 2) return `(${clean}`;
  if (clean.length <= 7) return `(${clean.slice(0, 2)}) ${clean.slice(2)}`;
  return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
}

// ==================== MODAL ====================
function initializeModal() {
  const modal = document.getElementById('lead-capture-modal');
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.querySelector('.modal-close');
  const backBtn = document.getElementById('modal-back-btn');
  const submitBtn = document.getElementById('modal-submit-btn');
  const emailInput = document.getElementById('modal-email');
  const whatsappInput = document.getElementById('modal-whatsapp');

  // Store selected plan
  let selectedPlan = null;

  // Close modal function
  function closeModal() {
    modal.style.display = 'none';
    overlay.style.display = 'none';
    selectedPlan = null;
  }

  // Open modal function
  function openModal(plan) {
    selectedPlan = plan;
    modal.style.display = 'block';
    overlay.style.display = 'block';
    emailInput.value = '';
    whatsappInput.value = '';
    emailInput.focus();
  }

  // Close button
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  backBtn.addEventListener('click', closeModal);

  // WhatsApp masking
  whatsappInput.addEventListener('input', function() {
    this.value = formatWhatsApp(this.value);
  });

  // Form submission
  submitBtn.addEventListener('click', async function() {
    const email = emailInput.value.trim();
    const whatsapp = whatsappInput.value.trim();

    // Validação
    if (!email) {
      trackFormError('empty_email');
      emailInput.classList.add('input-error');
      emailInput.focus();
      return;
    }

    if (!validateEmail(email)) {
      trackFormError('invalid_email');
      emailInput.classList.add('input-error');
      emailInput.focus();
      return;
    }

    if (!whatsapp) {
      trackFormError('empty_whatsapp');
      whatsappInput.classList.add('input-error');
      whatsappInput.focus();
      return;
    }

    if (!validateWhatsApp(whatsapp)) {
      trackFormError('invalid_whatsapp');
      whatsappInput.classList.add('input-error');
      whatsappInput.focus();
      return;
    }

    // Remove error classes
    emailInput.classList.remove('input-error');
    whatsappInput.classList.remove('input-error');

    // Track lead capture
    await trackLeadCapture(email, whatsapp, selectedPlan);

    // Close modal
    closeModal();

    // Redirect to Asaas
    const asaasLink = TRACKING_CONFIG.ASAAS_LINKS[selectedPlan];
    if (asaasLink) {
      setTimeout(() => {
        window.location.href = asaasLink;
      }, 100); // Small delay para garantir que N8N recebeu
    }
  });

  // Enter key to submit
  whatsappInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      submitBtn.click();
    }
  });

  emailInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      whatsappInput.focus();
    }
  });

  // Attach openModal to CTA buttons
  document.querySelectorAll('[data-cta-button]').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const plan = this.getAttribute('data-plan');
      trackButtonClick(`cta_${plan}`);
      openModal(plan);
    });
  });
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
  // Track pageview
  trackPageView();

  // Initialize modal
  initializeModal();

  console.log('🚀 MeuCaixa Tracking System initialized');
});
