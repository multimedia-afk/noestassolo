# No Estás Solo - Landing Page

Sitio web funcional de acompañamiento emocional con integración a Google Calendar.

## 🎯 Características

- ✅ **11 secciones de contenido completas** según especificaciones
- ✅ **Diseño responsive** (mobile-first)
- ✅ **Integración con Google Calendar** preparada
- ✅ **Flujo de pago** estructurado y documentado
- ✅ **Estética cálida y empática** con animaciones suaves
- ✅ **Accesibilidad** optimizada
- ✅ **SEO** implementado

## 📁 Estructura del Proyecto

```
no-estas-solo/
├── index.html          # Estructura HTML completa
├── styles.css          # Sistema de diseño y estilos
├── script.js           # Lógica de interacción y reservas
└── README.md           # Esta documentación
```

## 🚀 Inicio Rápido

### Ver localmente

1. Abre una terminal en este directorio
2. Inicia un servidor local:

```bash
# Opción 1: Python
python3 -m http.server 8000

# Opción 2: PHP
php -S localhost:8000

# Opción 3: Node.js (requiere npx)
npx serve
```

3. Abre tu navegador en: `http://localhost:8000`

## 🗓️ Configuración de Google Calendar

### Opción 1: Enlace Directo (Recomendado para iniciar)

1. Ve a [Google Calendar](https://calendar.google.com)
2. Clic en ⚙️ → **Configuración**
3. En el menú izquierdo: **Horarios de citas**
4. Clic en **Crear**
5. Configura:
   - **Nombre**: "No Estás Solo - Sesiones"
   - **Duraciones**: 15, 30, 60 minutos
   - **Horario disponible**: Tu disponibilidad
6. Copia la URL de la página de reservas
7. En `script.js`, línea ~110, reemplaza:
   ```javascript
   const GOOGLE_CALENDAR_URL = 'TU_URL_AQUI';
   ```

### Opción 2: API Completa (Integración avanzada)

Ver comentarios detallados en `script.js` (líneas 150-250) con instrucciones completas para:
- Configurar Google Cloud Project
- Habilitar Calendar API
- Crear credenciales OAuth 2.0
- Implementar creación de eventos

## 💳 Integración de Pagos

### Proveedores Recomendados

- **Conekta** (Mexicano, recomendado)
- **Stripe** (Internacional)
- **Mercado Pago** (América Latina)
- **OpenPay**

### Configuración

1. Regístrate en tu proveedor elegido
2. Obtén tus claves API (pública y secreta)
3. Sigue las instrucciones en `script.js` (líneas 260-350)
4. Implementa el webhook en tu backend

### Flujo de Pago

```
Usuario → Selecciona duración → Completa datos → 
Google Calendar crea evento → Se dispara pago → 
Confirmación → Actualiza calendario
```

## 📋 Checklist de Integración

- [ ] Configurar Google Calendar (horarios de citas o API)
- [ ] Reemplazar `GOOGLE_CALENDAR_URL` en script.js
- [ ] Elegir proveedor de pagos
- [ ] Integrar SDK de pagos
- [ ] Configurar webhook de confirmación
- [ ] Implementar envío de correos
- [ ] Configurar recordatorios WhatsApp
- [ ] Probar flujo completo

## 🎨 Personalización

### Colores

Edita las variables CSS en `styles.css` (líneas 10-20):

```css
:root {
  --color-primary: #6B9AC4;
  --color-secondary: #E8B4A1;
  /* ... más colores */
}
```

### Contenido

Todo el texto está en `index.html` siguiendo las especificaciones exactas proporcionadas.

## 📱 Responsive Design

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Diseñado con enfoque mobile-first.

## ♿ Accesibilidad

- Navegación por teclado completa
- Etiquetas ARIA
- Contraste optimizado
- Soporte para `prefers-reduced-motion`

## 🔒 Seguridad y Privacidad

- Sin almacenamiento de datos en frontend
- Confirmación de confidencialidad visible
- Aviso de crisis obligatorio
- Enlaces de emergencia (Línea de la Vida, 911)

## 📞 Contacto

**Email**: contacto@noestasolo.com

---

## 🛠️ Desarrollo

### Tecnologías

- HTML5 semántico
- CSS3 (variables custom, grid, flexbox)
- JavaScript vanilla (ES6+)
- Google Fonts (Inter, Outfit)

### Navegadores Soportados

- Chrome/Edge (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Mobile Safari
- Chrome Mobile

## 📄 Licencia

© 2024 No estás solo. Todos los derechos reservados.

---

**Aviso Legal**: Este servicio NO sustituye atención profesional de salud mental. No somos psicólogos ni terapeutas.
