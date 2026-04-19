(function () {
    'use strict';

    // ========================================================================
    // BOT ENGINE CONFIG
    // ========================================================================
    const BOT_CONFIG = {
        apiBase: '/api/booking',
        businessPhone: '+2349069602020',
        services: ['Bridal', 'Photoshoot', 'Soft Glam', 'Owambe']
    };

    const STATES = {
        IDLE: 'IDLE',
        COLLECTING_SERVICE: 'COLLECTING_SERVICE',
        COLLECTING_DATE: 'COLLECTING_DATE',
        COLLECTING_NAME: 'COLLECTING_NAME',
        COLLECTING_PHONE: 'COLLECTING_PHONE',
        CONFIRMING: 'CONFIRMING',
        FINISHED: 'FINISHED'
    };

    let currentState = STATES.IDLE;
    let bookingData = { service: null, date: null, name: null, phone: null };

    // ========================================================================
    // INTENT RECOGNITION (Powered by Compromise NLP)
    // ========================================================================
    function getMessageIntent(text) {
        const doc = nlp(text.toLowerCase());
        
        if (doc.has('(hi|hello|hey|greetings|good morning|good afternoon)')) return 'GREETING';
        if (doc.has('(book|appointment|schedule|reserve|slot|booking)')) return 'BOOKING';
        if (doc.has('(price|cost|how much|rate|charge|fee)')) return 'PRICING';
        if (doc.has('(service|menu|what do you do|makeup type)')) return 'SERVICES';
        if (doc.has('(thanks|thank you|awesome|great|ok|cool)')) return 'THANKS';
        if (doc.has('(yes|yeah|yep|sure|confirm)')) return 'YES';
        if (doc.has('(no|nope|cancel|stop)')) return 'NO';
        
        return 'UNKNOWN';
    }

    function extractEntities(text) {
        const lower = text.toLowerCase();
        // Extract Service
        BOT_CONFIG.services.forEach(s => {
            if (lower.includes(s.toLowerCase())) bookingData.service = s;
        });
        // Extract Date (Look for YYYY-MM-DD or simple keywords)
        const dateMatch = text.match(/\d{4}-\d{2}-\d{2}/);
        if (dateMatch) bookingData.date = dateMatch[0];
    }

    // ========================================================================
    // CONVERSATIONAL LOGIC
    // ========================================================================
    async function handleUserMessage(message) {
        addMessage(message, 'user');
        extractEntities(message);
        const intent = getMessageIntent(message);

        // --- GLOBAL OVERRIDES (Can happen at any time) ---
        if (intent === 'GREETING') {
            addMessage('Hi there! Welcome to Glam By Olaitan. How can I help you today? ✨', 'bot');
            return;
        }
        if (intent === 'PRICING' || intent === 'SERVICES') {
            addMessage('We offer Bridal (₦150k+), Photoshoots (₦50k), Soft Glam (₦35k), and Owambe (₦40k) sessions. Would you like to book one?', 'bot');
            currentState = STATES.IDLE; // Reset to wait for "book" intent
            return;
        }
        if (intent === 'THANKS') {
            addMessage('You are very welcome! Let me know if you need anything else. 💄', 'bot');
            return;
        }

        // --- STATE-BASED FLOW ---
        switch (currentState) {
            case STATES.IDLE:
                if (intent === 'BOOKING' || bookingData.service) {
                    currentState = STATES.COLLECTING_SERVICE;
                    processFlow();
                } else {
                    addMessage('I am here to help you book appointments or answer questions about our luxury makeup services. What would you like to do?', 'bot');
                }
                break;

            case STATES.COLLECTING_SERVICE:
                if (bookingData.service) {
                    currentState = STATES.COLLECTING_DATE;
                    processFlow();
                } else {
                    addMessage('Which service would you like? (Bridal, Photoshoot, Soft Glam, or Owambe)', 'bot');
                }
                break;

            case STATES.COLLECTING_DATE:
                if (bookingData.date) {
                    verifyDateAvailability();
                } else {
                    addMessage('What date would you like to book? (Please use YYYY-MM-DD format, e.g., 2026-05-15)', 'bot');
                }
                break;

            case STATES.COLLECTING_NAME:
                bookingData.name = message;
                currentState = STATES.COLLECTING_PHONE;
                processFlow();
                break;

            case STATES.COLLECTING_PHONE:
                bookingData.phone = message;
                currentState = STATES.CONFIRMING;
                processFlow();
                break;

            case STATES.CONFIRMING:
                if (intent === 'YES') {
                    finalizeBooking();
                } else if (intent === 'NO') {
                    addMessage('No problem! Let me know if you want to change anything or start over.', 'bot');
                    currentState = STATES.IDLE;
                } else {
                    addMessage(`Ready to book ${bookingData.service} on ${bookingData.date}? Type "YES" to confirm.`, 'bot');
                }
                break;
        }
    }

    async function processFlow() {
        showTyping();
        await new Promise(r => setTimeout(r, 800));
        removeTyping();

        if (currentState === STATES.COLLECTING_SERVICE && !bookingData.service) {
            addMessage('I would love to help you book! Which service are you interested in?', 'bot');
        } else if (currentState === STATES.COLLECTING_DATE && !bookingData.date) {
            addMessage(`Excellent choice! For which date should we schedule your ${bookingData.service} session?`, 'bot');
        } else if (currentState === STATES.COLLECTING_NAME) {
            addMessage('Perfect. Can I have your full name for the booking?', 'bot');
        } else if (currentState === STATES.COLLECTING_PHONE) {
            addMessage('And a WhatsApp number where we can send the confirmation?', 'bot');
        } else if (currentState === STATES.CONFIRMING) {
            addMessage(`Got it! We are booking a **${bookingData.service}** for **${bookingData.name}** on **${bookingData.date}**. Does that look correct? (Yes/No)`, 'bot');
        }
    }

    async function verifyDateAvailability() {
        showTyping();
        try {
            const check = await fetch(BOT_CONFIG.apiBase, {
                method: 'POST',
                body: JSON.stringify({ action: 'check_availability', date: bookingData.date })
            });
            const availability = await check.json();
            removeTyping();

            if (availability.available) {
                addMessage(`Great news! That date is available (${availability.remaining} slots left).`, 'bot');
                currentState = STATES.COLLECTING_NAME;
                processFlow();
            } else {
                addMessage('I am so sorry, we are fully booked for that day. Is there another date that works for you?', 'bot');
                bookingData.date = null; // Clear broken date
            }
        } catch (e) {
            removeTyping();
            addMessage('I am having a bit of trouble checking my calendar. Could you try that date again?', 'bot');
        }
    }

    async function finalizeBooking() {
        showTyping();
        try {
            const response = await fetch(BOT_CONFIG.apiBase, {
                method: 'POST',
                body: JSON.stringify({ action: 'book', ...bookingData })
            });
            removeTyping();
            if (response.ok) {
                addMessage('✨ **IT\'S OFFICIAL!** Your booking is confirmed. We\'ve saved your details and will reach out on WhatsApp shortly to finalize everything. See you soon!', 'bot');
                currentState = STATES.FINISHED;
            } else {
                throw new Error();
            }
        } catch (e) {
            addMessage('❌ Something went wrong while saving your booking. Please message us directly on WhatsApp: ' + BOT_CONFIG.businessPhone, 'bot');
        }
    }

    // ========================================================================
    // UI UTILS
    // ========================================================================
    function addMessage(text, sender) {
        const container = document.getElementById('chat-messages');
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message ' + sender;
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        msgDiv.appendChild(bubble);
        container.appendChild(msgDiv);
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }

    function showTyping() {
        const container = document.getElementById('chat-messages');
        const div = document.createElement('div');
        div.className = 'chat-message bot';
        div.id = 'typing-indicator';
        div.innerHTML = '<div class="message-bubble"><p>...</p></div>';
        container.appendChild(div);
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }

    function removeTyping() { const el = document.getElementById('typing-indicator'); if (el) el.remove(); }

    function sendMessage() {
        const input = document.getElementById('chat-input');
        const msg = input.value.trim();
        if (msg) { handleUserMessage(msg); input.value = ''; }
    }

    // Expose to window
    window.toggleChat = () => {
        const active = document.getElementById('chat-widget').classList.toggle('active');
        if (active) {
            document.getElementById('chat-fab').style.display = 'none';
            if (currentState === STATES.IDLE) {
                addMessage('Hi! Welcome to **Glam By Olaitan** 💄✨', 'bot');
                addMessage('I can help you book appointments, check our services, or answer questions. How can I help you today?', 'bot');
            }
        } else {
            document.getElementById('chat-fab').style.display = 'flex';
        }
    };
    window.closeChat = () => {
        document.getElementById('chat-widget').classList.remove('active');
        document.getElementById('chat-fab').style.display = 'flex';
    };
    window.sendMessage = sendMessage;
    window.handleKeyPress = (e) => { if (e.key === 'Enter') sendMessage(); };
    window.bookService = (service) => {
        window.toggleChat();
        bookingData.service = service;
        currentState = STATES.COLLECTING_DATE;
        processFlow();
    };

})();
