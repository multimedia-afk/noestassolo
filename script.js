/* ============================================
   NO ESTÁS SOLO - JAVASCRIPT
   Booking flow & Google Calendar Integration
   ============================================ */

// ============================================
// GLOBAL STATE
// ============================================
const bookingState = {
  selectedDuration: null,
  selectedPrice: null,
  userData: {
    name: '',
    email: '',
    phone: ''
  }
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
  durationButtons: document.querySelectorAll('.duration-btn'),
  bookingForm: document.getElementById('booking-form'),
  selectedDurationDisplay: document.getElementById('selected-duration'),
  durationText: document.getElementById('duration-text'),
  userNameInput: document.getElementById('user-name'),
  userEmailInput: document.getElementById('user-email'),
  userPhoneInput: document.getElementById('user-phone')
};

// ============================================
// SMOOTH SCROLL FOR NAVIGATION
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    // Only prevent default for internal links
    if (href !== '#' && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// ============================================
// DURATION SELECTION
// ============================================
elements.durationButtons.forEach(button => {
  button.addEventListener('click', function () {
    const duration = this.getAttribute('data-duration');
    const price = this.getAttribute('data-price');

    // Update state
    bookingState.selectedDuration = duration;
    bookingState.selectedPrice = price;

    // Update UI - highlight selected button
    elements.durationButtons.forEach(btn => {
      btn.classList.remove('btn--primary');
      btn.classList.add('btn--outline');
    });
    this.classList.remove('btn--outline');
    this.classList.add('btn--primary');

    // Show selected duration
    elements.durationText.textContent = `${duration} minutos - $${price} MXN`;
    elements.selectedDurationDisplay.style.display = 'block';

    // Show booking form
    elements.bookingForm.style.display = 'block';

    // Smooth scroll to form
    elements.bookingForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});

// ============================================
// FORM SUBMISSION & GOOGLE CALENDAR INTEGRATION
// ============================================
elements.bookingForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Validate form
  if (!elements.userNameInput.value || !elements.userEmailInput.value || !elements.userPhoneInput.value) {
    alert('Por favor completa todos los campos requeridos.');
    return;
  }

  // Validate duration selection
  if (!bookingState.selectedDuration) {
    alert('Por favor selecciona una duración antes de continuar.');
    return;
  }

  // Update state with user data
  bookingState.userData = {
    name: elements.userNameInput.value,
    email: elements.userEmailInput.value,
    phone: elements.userPhoneInput.value
  };

  // ============================================
  // GOOGLE CALENDAR DIRECT LINK (EASY METHOD)
  // ============================================

  /* 
    PASOS PARA CONFIGURAR TU CALENDARIO:
    
    1. Ve a Google Calendar (calendar.google.com)
    2. Haz clic en el ícono de configuración (⚙️) → Configuración
    3. En el menú izquierdo, busca "Horarios de citas" 
    4. Haz clic en "Crear" para crear un nuevo horario de citas
    5. Configura:
       - Nombre: "No Estás Solo - Sesiones"
       - Duraciones: 15, 30, 60 minutos
       - Horarios disponibles
       - Formulario de reserva (opcional)
    6. Copia la URL de tu página de reservas
    7. Pega esa URL abajo donde dice 'TU_URL_DE_CALENDARIO_AQUI'
    
    La URL se verá algo así:
    https://calendar.google.com/calendar/appointments/schedules/AcZssZ1234567890abcdef
  */

  const GOOGLE_CALENDAR_URL = 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1S21yyB9i3EsZf7LdXy7nfX4xFFOBtKo-ZmzylW30xuqDGCrIkbMNnd3ILWJoK8cJBqbB6KUOd';

  // Check if calendar URL is configured
  if (GOOGLE_CALENDAR_URL === 'TU_URL_DE_CALENDARIO_AQUI') {
    // Mostrar datos recopilados para desarrollo
    console.log('📅 DATOS DE RESERVA RECOPILADOS:', {
      duration: bookingState.selectedDuration + ' minutos',
      price: '$' + bookingState.selectedPrice + ' MXN',
      userData: bookingState.userData
    });

    alert(
      `✅ Datos recibidos correctamente:\n\n` +
      `Nombre: ${bookingState.userData.name}\n` +
      `Email: ${bookingState.userData.email}\n` +
      `Teléfono: ${bookingState.userData.phone}\n` +
      `Duración: ${bookingState.selectedDuration} minutos\n` +
      `Precio: $${bookingState.selectedPrice} MXN\n\n` +
      `⚠️ CONFIGURACIÓN PENDIENTE:\n\n` +
      `Para activar el calendario:\n` +
      `1. Ve a Google Calendar\n` +
      `2. Crea un "Horario de citas"\n` +
      `3. Copia la URL de reservas\n` +
      `4. Pégala en script.js donde dice 'TU_URL_DE_CALENDARIO_AQUI'`
    );

    return;
  }

  // Preparar URL con datos del usuario (para prellenar el formulario)
  const calendarParams = new URLSearchParams({
    name: bookingState.userData.name,
    email: bookingState.userData.email
  });

  const fullCalendarURL = `${GOOGLE_CALENDAR_URL}?${calendarParams.toString()}`;

  // Guardar datos para flujo de pago posterior
  localStorage.setItem('pendingBooking', JSON.stringify({
    ...bookingState,
    timestamp: new Date().toISOString()
  }));

  console.log('✅ Redirigiendo a Google Calendar...');
  console.log('📋 Datos guardados:', bookingState);

  // Redirigir a Google Calendar
  window.location.href = fullCalendarURL;
});

// Helper function to get current line number (for debugging)
function getLineNumber() {
  const line = new Error().stack.split('\n')[2];
  const match = line.match(/:(\d+):/);
  return match ? match[1] : 'unknown';
}

// ============================================
// PAYMENT INTEGRATION PREPARATION
// ============================================

/* 
  PAYMENT FLOW INTEGRATION POINTS
  ================================
  
  The payment should be triggered AFTER the Google Calendar event is created.
  This ensures we have a confirmed appointment before processing payment.
  
  RECOMMENDED PAYMENT PROVIDERS FOR MEXICO:
  - Conekta (Mexican, very popular)
  - Stripe (International, widely used)
  - Mercado Pago (Latin America)
  - OpenPay
  
  INTEGRATION STEPS:
  
  1. INITIALIZE PAYMENT PROVIDER (example with Conekta):
     <script src="https://cdn.conekta.io/js/latest/conekta.js"></script>
     <script>
       Conekta.setPublicKey('YOUR_PUBLIC_KEY');
     </script>
  
  2. CREATE PAYMENT FUNCTION:
*/

function initiatePaymentFlow(calendarEventId) {
  /* 
    This function will be called AFTER the calendar event is created.
    It should:
    1. Create a payment order linked to the calendar event ID
    2. Display payment form or redirect to payment page
    3. Process payment
    4. Update calendar event with payment confirmation
    5. Send confirmation email/WhatsApp
  */

  const paymentData = {
    amount: bookingState.selectedPrice * 100, // Convert to cents
    currency: 'MXN',
    description: `Sesión de acompañamiento - ${bookingState.selectedDuration} min`,
    customer: {
      name: bookingState.userData.name,
      email: bookingState.userData.email,
      phone: bookingState.userData.phone
    },
    metadata: {
      calendar_event_id: calendarEventId,
      duration: bookingState.selectedDuration,
      service: 'no-estas-solo-session'
    }
  };

  // EXAMPLE: Conekta Payment Integration
  /*
  Conekta.Token.create({
    card: {
      number: cardNumber,
      name: cardholderName,
      exp_year: expirationYear,
      exp_month: expirationMonth,
      cvc: cvv
    }
  }, function(token) {
    // Send token to your server
    fetch('/api/process-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: token.id,
        ...paymentData
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Update calendar event to mark as paid
        updateCalendarEventStatus(calendarEventId, 'PAID');
        
        // Show confirmation
        showPaymentConfirmation(calendarEventId);
      }
    });
  }, function(error) {
    console.error('Payment error:', error);
    alert('Error al procesar el pago. Por favor intenta de nuevo.');
  });
  */

  console.log('💳 PAYMENT FLOW INITIATED:', paymentData);

  // For development: show payment data
  alert(
    `💳 FLUJO DE PAGO\n\n` +
    `Evento de calendario: ${calendarEventId}\n` +
    `Monto: $${bookingState.selectedPrice} MXN\n\n` +
    `Integra tu proveedor de pago aquí (Conekta, Stripe, etc.)`
  );
}

/*
  PAYMENT WEBHOOK HANDLER (Backend)
  ==================================
  
  Your backend should handle payment webhooks to:
  1. Verify payment was successful
  2. Update calendar event color (green for confirmed)
  3. Update event description with payment confirmation
  4. Send confirmation email
  5. Send WhatsApp reminder 5 minutes before session
  
  Example webhook endpoint:
  
  POST /webhook/payment-confirmed
  {
    "payment_id": "pay_xxx",
    "calendar_event_id": "evt_xxx",
    "status": "paid",
    "amount": 200
  }
  
  Backend action:
  1. Verify webhook signature
  2. Update Google Calendar event:
     - Change color to green (colorId: '10')
     - Update description to include "PAGO CONFIRMADO"
  3. Schedule WhatsApp reminder
  4. Send confirmation email
*/

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateBookingID() {
  // Generate unique booking ID
  return 'NES-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function updateCalendarEventStatus(eventId, status) {
  // Update calendar event after payment confirmation
  console.log(`Updating event ${eventId} with status: ${status}`);

  /*
  gapi.client.calendar.events.patch({
    calendarId: CALENDAR_ID,
    eventId: eventId,
    resource: {
      description: event.description + '\n\nEstado del pago: ' + status,
      colorId: status === 'PAID' ? '10' : '9'  // Green for paid, blue for pending
    }
  });
  */
}

function showPaymentConfirmation(eventId) {
  // Show success message after payment
  alert(
    `✅ ¡Pago confirmado!\n\n` +
    `Tu espacio ha sido reservado.\n` +
    `Recibirás un correo de confirmación y un recordatorio por WhatsApp 5 minutos antes de tu sesión.\n\n` +
    `ID de reserva: ${eventId}`
  );

  // Redirect to confirmation page or reset form
  window.location.href = '#inicio';
  resetBookingForm();
}

function resetBookingForm() {
  // Reset form and state
  bookingState.selectedDuration = null;
  bookingState.selectedPrice = null;
  bookingState.userData = { name: '', email: '', phone: '' };

  elements.bookingForm.reset();
  elements.bookingForm.style.display = 'none';
  elements.selectedDurationDisplay.style.display = 'none';

  elements.durationButtons.forEach(btn => {
    btn.classList.remove('btn--primary');
    btn.classList.add('btn--outline');
  });
}

// ============================================
// FAQ ACCORDION
// ============================================
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
  question.addEventListener('click', function () {
    const answer = this.nextElementSibling;
    const isActive = this.classList.contains('active');

    // Close all other FAQs
    faqQuestions.forEach(q => {
      q.classList.remove('active');
      q.setAttribute('aria-expanded', 'false');
      q.nextElementSibling.classList.remove('active');
    });

    // Toggle current FAQ
    if (!isActive) {
      this.classList.add('active');
      this.setAttribute('aria-expanded', 'true');
      answer.classList.add('active');
    }
  });
});

// ============================================
// SCROLL-TRIGGERED ANIMATIONS
// ============================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fade-in-up');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.card, .step-card, .pricing-card').forEach(el => {
  observer.observe(el);
});

// ============================================
// PHONE NUMBER FORMATTING
// ============================================
elements.userPhoneInput.addEventListener('input', function (e) {
  let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

  // Format as Mexican phone number
  if (value.length > 0) {
    if (value.length <= 2) {
      value = '+' + value;
    } else if (value.length <= 4) {
      value = '+' + value.slice(0, 2) + ' ' + value.slice(2);
    } else if (value.length <= 7) {
      value = '+' + value.slice(0, 2) + ' ' + value.slice(2, 5) + ' ' + value.slice(5);
    } else if (value.length <= 10) {
      value = '+' + value.slice(0, 2) + ' ' + value.slice(2, 5) + ' ' + value.slice(5, 8) + ' ' + value.slice(8);
    } else {
      value = '+' + value.slice(0, 2) + ' ' + value.slice(2, 5) + ' ' + value.slice(5, 8) + ' ' + value.slice(8, 12);
    }
  }

  e.target.value = value;
});

// ============================================
// LEGAL MODALS (Click to open)
// ============================================

/* 
  📝 INSTRUCCIONES PARA EDITAR EL CONTENIDO LEGAL
  ================================================
  
  Para cambiar el texto de los avisos legales, busca la sección 
  "LEGAL CONTENT - EDIT HERE" más abajo (línea ~520) y modifica:
  
  - 'aviso-legal': Información sobre el aviso legal
  - 'terminos': Términos y condiciones de uso
  - 'privacidad': Política de privacidad
  
  Cada uno tiene un título y contenido que puedes personalizar.
*/

// Create modal element
const legalModal = document.createElement('div');
legalModal.className = 'legal-modal';
legalModal.innerHTML = `
  <div class="legal-modal__overlay"></div>
  <div class="legal-modal__container">
    <div class="legal-modal__header">
      <h2 class="legal-modal__title"></h2>
      <button class="legal-modal__close" aria-label="Cerrar">×</button>
    </div>
    <div class="legal-modal__content"></div>
  </div>
`;
document.body.appendChild(legalModal);

const modalOverlay = legalModal.querySelector('.legal-modal__overlay');
const modalContainer = legalModal.querySelector('.legal-modal__container');
const modalTitle = legalModal.querySelector('.legal-modal__title');
const modalContent = legalModal.querySelector('.legal-modal__content');
const modalClose = legalModal.querySelector('.legal-modal__close');

// ============================================
// LEGAL CONTENT - EDIT HERE! 📝
// ============================================
const legalContent = {
  'aviso-legal': {
    title: 'Aviso Legal',
    content: `
      <p><strong>Bienvenido a No estás solo.</strong> Al utilizar nuestro sitio web y contratar nuestros servicios, usted acepta los presentes Términos y Condiciones. Por favor, léalos detenidamente.</p>

      <h4>1. Naturaleza del Servicio: Acompañamiento Emocional</h4>
      <p>No estás solo es un servicio de acompañamiento basado exclusivamente en la escucha humana activa, la empatía y la contención emocional básica.</p>
      
      <p><strong>⚠️ IMPORTANTE (Deslinde de Responsabilidad Profesional):</strong></p>
      <ul>
        <li><strong>No somos profesionales de la salud:</strong> No somos psicólogos, terapeutas ni médicos.</li>
        <li><strong>Sin Diagnósticos:</strong> No ofrecemos diagnósticos, análisis clínicos ni tratamos trastornos de salud mental.</li>
        <li><strong>No es Terapia:</strong> Este servicio no reemplaza ni sustituye la atención profesional de salud mental. Nada de lo expresado en las sesiones debe interpretarse como consejo clínico o intervención médica.</li>
      </ul>

      <h4>2. Protocolo de Emergencias y Crisis</h4>
      <p>Este servicio no es apto para emergencias. Si usted se encuentra en una situación de riesgo, tiene ideas de autolesión o vive violencia grave, debe contactar de inmediato a servicios profesionales:</p>
      <ul>
        <li><strong>Línea de la Vida (México):</strong> <a href="tel:8009112000">800 911 2000</a></li>
        <li><strong>Emergencias:</strong> <a href="tel:911">911</a></li>
      </ul>

      <h4>3. Proceso de Contratación y Pagos</h4>
      <ul>
        <li><strong>Agendamiento:</strong> Las sesiones se reservan mediante nuestro calendario en línea, con duraciones de 15, 30 o 60 minutos.</li>
        <li><strong>Pagos:</strong> El pago se realiza de forma segura a través de medios digitales antes de la sesión. Las tarifas actuales son:
          <ul>
            <li>15 min: $100 MXN</li>
            <li>30 min: $200 MXN</li>
            <li>60 min: $400 MXN</li>
          </ul>
        </li>
        <li><strong>Extensión de Sesión:</strong> Al finalizar, el usuario puede solicitar tiempo adicional sujeto a disponibilidad del escucha.</li>
      </ul>

      <h4>4. Dinámica de las Sesiones</h4>
      <ul>
        <li><strong>Contacto:</strong> El equipo contactará al usuario al número indicado mediante llamada de voz o videollamada. Se enviará un recordatorio por WhatsApp 5 minutos antes.</li>
        <li><strong>Libertad de Expresión:</strong> El usuario marca el ritmo y puede hablar de cualquier tema, siempre que no sea ilegal o implique daño inmediato.</li>
        <li><strong>Anonimato:</strong> Se permite el uso de nombres ficticios para proteger la identidad del usuario.</li>
      </ul>

      <h4>5. Reglas de Convivencia y Cancelación</h4>
      <p>Para mantener un espacio seguro, se establecen las siguientes normas:</p>
      <ul>
        <li>Se prohíbe cualquier comportamiento ofensivo, amenazante o inapropiado hacia el personal.</li>
        <li>No estás solo se reserva el derecho de cancelar la sesión de forma inmediata ante cualquier falta de respeto o conducta agresiva.</li>
      </ul>

      <h4>6. Confidencialidad y Privacidad</h4>
      <ul>
        <li><strong>Privacidad:</strong> La información personal solo se utiliza para la gestión de las sesiones y no se comparte con terceros.</li>
        <li><strong>No Grabación:</strong> Las sesiones son 100% confidenciales y bajo ninguna circunstancia son grabadas.</li>
      </ul>

      <h4>7. Contacto</h4>
      <p>Para dudas, soporte o aclaraciones, el usuario puede dirigirse a: <a href="mailto:aquiestoymail@gmail.com">aquiestoymail@gmail.com</a></p>
    `
  },
  'terminos': {
    title: 'Términos y Condiciones',
    content: `
      <h4>Aceptación de los términos</h4>
      <p>Al agendar una sesión, el usuario acepta nuestras políticas de privacidad, reglas de uso y lineamientos, confirmando haber leído y entendido la naturaleza del servicio.</p>

      <h4>Descripción del servicio</h4>
      <p>Servicio de acompañamiento emocional basado en escucha activa humana y empática. Sesiones de 15, 30 o 60 minutos por llamada de voz o videollamada.</p>

      <h4>Obligaciones del usuario</h4>
      <ul>
        <li>Mantener comportamiento respetuoso (conductas ofensivas cancelan la sesión inmediatamente)</li>
        <li>Proporcionar número de contacto válido</li>
        <li>No tratar temas de actividades ilegales o daño inmediato</li>
      </ul>

      <h4>Política de cancelación</h4>
      <p>La violación de lineamientos faculta a "No estás solo" para cancelar la sesión sin reembolso. Extensiones de tiempo sujetas a disponibilidad.</p>

      <h4>Limitación de responsabilidad</h4>
      <ul>
        <li><strong>No somos profesionales:</strong> No ofrecemos diagnósticos ni tratamientos clínicos</li>
        <li><strong>No sustituye terapia profesional</strong></li>
        <li><strong>Casos de crisis:</strong> No es servicio de emergencias. Contacte Línea de la Vida (800 911 2000) o 911</li>
      </ul>

      <h4>Modificaciones</h4>
      <p>Nos reservamos el derecho de actualizar estos términos para cumplir con cambios legales o mejoras en el servicio.</p>
    `
  },
  'privacidad': {
    title: 'Política de Privacidad',
    content: `
      <h4>Qué datos recopilamos</h4>
      <p>Solo información necesaria para la sesión: nombre (puede ser ficticio) y número telefónico para contacto vía voz o WhatsApp.</p>

      <h4>Cómo usamos los datos</h4>
      <p>Exclusivamente para gestión de citas, recordatorios (5 min antes) y realizar la llamada o videollamada.</p>

      <h4>Con quién compartimos</h4>
      <p><strong>Con nadie.</strong> No compartimos información personal con terceros bajo ninguna circunstancia.</p>

      <h4>Cómo protegemos los datos</h4>
      <ul>
        <li>Sesiones 100% confidenciales</li>
        <li>No grabamos audio ni video</li>
        <li>Estrictas reglas internas de respeto y privacidad</li>
      </ul>

      <h4>Derechos del usuario (ARCO)</h4>
      <p>Derecho a solicitar eliminación de sus datos. Para dudas: <a href="mailto:aquiestoymail@gmail.com">aquiestoymail@gmail.com</a></p>

      <h4>Uso de cookies</h4>
      <p>Utilizamos cookies técnicas para procesar pagos seguros en línea.</p>
    `
  }
};

// Get all legal links
const legalLinks = document.querySelectorAll('.legal-link');

// Open modal on click
legalLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    const legalType = this.getAttribute('data-legal-type');
    const content = legalContent[legalType];

    if (content) {
      modalTitle.textContent = content.title;
      modalContent.innerHTML = content.content;
      legalModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  });
});

// Close modal function
function closeModal() {
  legalModal.classList.remove('active');
  document.body.style.overflow = ''; // Restore scrolling
}

// Close modal when clicking close button
modalClose.addEventListener('click', closeModal);

// Close modal when clicking overlay
modalOverlay.addEventListener('click', closeModal);

// Close modal on Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && legalModal.classList.contains('active')) {
    closeModal();
  }
});

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  console.log('🌟 No Estás Solo - Landing Page Loaded');
  console.log('📋 For Google Calendar integration, see comments in script.js');

  // Check if returning from calendar booking
  const pendingBooking = localStorage.getItem('pendingBooking');
  if (pendingBooking) {
    const booking = JSON.parse(pendingBooking);
    console.log('📅 Pending booking found:', booking);

    // Here you could check if payment was completed
    // and show appropriate messaging
  }
});

/* ============================================
   FINAL INTEGRATION CHECKLIST
   ============================================
   
   [ ] 1. Set up Google Calendar appointment schedule
   [ ] 2. Replace GOOGLE_CALENDAR_URL with your actual URL
   [ ] 3. Choose payment provider (Conekta, Stripe, etc.)
   [ ] 4. Add payment provider script to HTML
   [ ] 5. Implement payment processing function
   [ ] 6. Set up backend webhook handler
   [ ] 7. Configure email confirmations
   [ ] 8. Set up WhatsApp reminder system
   [ ] 9. Test complete booking flow
   [ ] 10. Test payment processing
   [ ] 11. Test calendar event creation
   [ ] 12. Test confirmation emails/messages
   
   ============================================ */
