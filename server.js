const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors()); // Permite que tu página web hable con este servidor
app.use(bodyParser.json());

// Carga tu archivo JSON descargado (asegúrate que esté en la misma carpeta)
const CREDENTIALS = require('./credenciales.json');
const CALENDAR_ID = '466845458679-f0v4ojseln3equ768m1s55s9noent2do.apps.googleusercontent.com'; // O el ID largo de tu calendario si no es el principal

// Configuración de Google
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key,
    },
    scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar({ version: 'v3', auth });

// RUTA PARA CREAR EL EVENTO
app.post('/api/crear-evento', async (req, res) => {
    try {
        const { name, email, phone, date, duration } = req.body;

        // Calcular hora fin
        const startTime = new Date(date);
        const endTime = new Date(startTime.getTime() + duration * 60000);

        const event = {
            summary: `Cita: ${name}`,
            description: `Cliente: ${name}\nEmail: ${email}\nTeléfono: ${phone}\n\nEstado: PENDIENTE DE PAGO`,
            start: {
                dateTime: startTime.toISOString(),
                timeZone: 'America/Mexico_City'
            },
            end: {
                dateTime: endTime.toISOString(),
                timeZone: 'America/Mexico_City'
            },
            attendees: [
                { email: email }
            ],
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 1440 }, // 1 día antes
                    { method: 'popup', minutes: 60 },   // 1 hora antes
                    { method: 'popup', minutes: 5 }     // 5 minutos antes
                ]
            },
            colorId: '9' // Azul para eventos pendientes de pago
        };

        const response = await calendar.events.insert({
            calendarId: CALENDAR_ID,
            resource: event,
            sendUpdates: 'all' // Envía notificación por email al cliente
        });

        console.log('✅ Evento creado:', response.data.id);

        res.status(200).json({
            msg: 'Éxito',
            link: response.data.htmlLink,
            eventId: response.data.id
        });
    } catch (error) {
        console.error('❌ Error al agendar:', error);
        res.status(500).json({
            msg: 'Error al agendar',
            error: error.message
        });
    }
});

// Arrancar servidor en puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📅 Google Calendar API configurado`);
});