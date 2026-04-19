(function () {
    'use strict';

    // ========================================================================
    // BOT CONFIGURATION & STATES
    // ========================================================================
    const BOT_CONFIG = {
        apiBase: '/api/booking',
        businessPhone: '+2349069602020'
    };

    const STATES = {
        START: 'GREETING',
        CHOOSE_SERVICE: 'CHOOSE_SERVICE',
        PICK_DATE: 'PICK_DATE',
        GET_NAME: 'GET_NAME',
        GET_PHONE: 'GET_PHONE',
        CONFIRMING: 'CONFIRMING',
        FINISHED: 'FINISHED'
    };

    // ========================================================================
    // APP STATE
    // ========================================================================
    let currentState = STATES.START;
    let bookingData = {
        service: null,
        date: null,
        name: null,
        phone: null
    };

    // ========================================================================
    // UI CONTROLS
    // ========================================================================
    function openChat() {
        const widget = document.getElementById('chat-widget');
        const fab = document.getElementById('chat-fab');
        if (!widget || !fab) return;

        widget.classList.add('active');
        fab.style.display = 'none';
        
        // Focus input after animation
        setTimeout(() => {
            const input = document.getElementById('chat-input');
            if (input) input.focus();
        }, 350);

        // If it's the first time opening, start the greeting
        if (currentState === STATES.START) {
            processBotResponse();
        }
    }

    function closeChat() {
        document.getElementById('chat-widget').classList.remove('active');
        document.getElementById('chat-fab').style.display = 'flex';
    }

    // ========================================================================
    // THE "SMART" LOGIC (State Machine)
    // ========================================================================
    async function handleUserMessage(message) {
        addMessage(message, 'user');

        switch (currentState) {
            case STATES.CHOOSE_SERVICE:
                bookingData.service = message;
                currentState = STATES.PICK_DATE;
                break;

            case STATES.PICK_DATE:
                // Basic date validation (YYYY-MM-DD)
                if (!/^\d{4}-\d{2}-\d{2}$/.test(message)) {
                    addMessage('Please enter the date in YYYY-MM-DD format (e.g., 2026-05-15).', 'bot');
                    return;
                }
                
                showTyping();
                const check = await fetch(BOT_CONFIG.apiBase, {
                    method: 'POST',
                    body: JSON.stringify({ action: 'check_availability', date: message })
                });
                const availability = await check.json();
                removeTyping();

                if (availability.available) {
                    bookingData.date = message;
                    addMessage(`Great! We have ${availability.remaining} slots left for that day.`, 'bot');
                    currentState = STATES.GET_NAME;
                } else {
                    addMessage('I am so sorry, we are fully booked for that day (max 3 bookings). Please try another date!', 'bot');
                    return;
                }
                break;

            case STATES.GET_NAME:
                bookingData.name = message;
                currentState = STATES.GET_PHONE;
                break;

            case STATES.GET_PHONE:
                bookingData.phone = message;
                currentState = STATES.CONFIRMING;
                break;

            default:
                addMessage('I am currently processing your booking. One moment...', 'bot');
                return;
        }

        processBotResponse();
    }

    async function processBotResponse() {
        showTyping();
        await new Promise(r => setTimeout(r, 800)); // Human-like delay
        removeTyping();

        switch (currentState) {
            case STATES.START:
                addMessage('Hi! I am the Glam Booking Bot. Let\'s get you glowing! 💄', 'bot');
                addMessage('What service would you like? (Bridal, Photoshoot, Soft Glam, or Owambe)', 'bot');
                currentState = STATES.CHOOSE_SERVICE;
                break;

            case STATES.PICK_DATE:
                addMessage('What date would you like to book? (Please use YYYY-MM-DD format)', 'bot');
                break;

            case STATES.GET_NAME:
                addMessage('Perfect! Can I have your full name?', 'bot');
                break;

            case STATES.GET_PHONE:
                addMessage('And your WhatsApp phone number for confirmation?', 'bot');
                break;

            case STATES.CONFIRMING:
                addMessage(`Ready to book ${bookingData.service} for ${bookingData.name} on ${bookingData.date}? Type "YES" to confirm.`, 'bot');
                break;

            case STATES.FINISHED:
                showTyping();
                const response = await fetch(BOT_CONFIG.apiBase, {
                    method: 'POST',
                    body: JSON.stringify({ action: 'book', ...bookingData })
                });
                removeTyping();
                
                if (response.ok) {
                    addMessage('✅ YOUR BOOKING IS CONFIRMED! We have saved your details to our database. We will contact you on WhatsApp soon.', 'bot');
                    currentState = STATES.FINISHED;
                } else {
                    addMessage('❌ Error finalizing booking. Please WhatsApp us directly: ' + BOT_CONFIG.businessPhone, 'bot');
                }
                break;
        }
    }

    // ========================================================================
    // HELPER FUNCTIONS
    // ========================================================================
    function addMessage(text, sender) {
        const container = document.getElementById('chat-messages');
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message ' + sender;
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = `<p>${text}</p>`;
        msgDiv.appendChild(bubble);
        container.appendChild(msgDiv);
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        
        // Auto-confirm logic
        if (currentState === STATES.CONFIRMING && sender === 'user' && text.toUpperCase() === 'YES') {
            currentState = STATES.FINISHED;
            processBotResponse();
        }
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

    function removeTyping() {
        const el = document.getElementById('typing-indicator');
        if (el) el.remove();
    }

    function sendMessage() {
        const input = document.getElementById('chat-input');
        const msg = input.value.trim();
        if (msg) {
            handleUserMessage(msg);
            input.value = '';
        }
    }

    function handleKeyPress(e) { if (e.key === 'Enter') sendMessage(); }

    // Expose to window
    window.toggleChat = () => document.getElementById('chat-widget').classList.contains('active') ? closeChat() : openChat();
    window.openChat = openChat;
    window.closeChat = closeChat;
    window.sendMessage = sendMessage;
    window.handleKeyPress = handleKeyPress;
    window.bookService = (service) => { 
        openChat(); 
        bookingData.service = service; 
        currentState = STATES.PICK_DATE;
        processBotResponse(); 
    };

})();
