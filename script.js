// Speech recognition setup
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-IN';
recognition.continuous = false;
recognition.interimResults = false;

// Voices array
let voices = [];

// Populate voices
function populateVoices() {
    voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice =>
        voice.name.toLowerCase().includes("female") ||
        voice.name.toLowerCase().includes("samantha") ||
        voice.name.toLowerCase().includes("zira") ||
        voice.lang.includes("en-GB")
    );
    if (femaleVoice) {
        console.log("Female voice found: ", femaleVoice.name);
    } else {
        console.log("Preferred female voice not found.");
    }
}

// Initialize voices
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
}

// Start voice input
function startVoiceInput() {
    recognition.start();
    console.log("Voice recognition started...");
}

// Voice recognition handlers
recognition.onresult = function(event) {
    const message = event.results[0][0].transcript.trim();
    if (message !== "") {
        document.getElementById("user-input").value = message;
        getBotResponse(message);
    }
};

recognition.onerror = function(event) {
    console.error("Speech recognition error: ", event.error);
};

// Speak function
function speak(message) {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(message);
    const availableVoices = synth.getVoices();

    const preferredVoices = availableVoices.filter(voice =>
        voice.name.toLowerCase().includes("female") ||
        voice.name.toLowerCase().includes("samantha") ||
        voice.name.toLowerCase().includes("zira") ||
        voice.lang.includes("en-GB")
    );

    if (preferredVoices.length > 0) {
        utterThis.voice = preferredVoices[0];
    }

    synth.speak(utterThis);
}

// Display messages
function addMessageToChat(sender, text) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");
    messageDiv.className = sender === "bot" ? "bot-message" : "user-message";
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Handle send button click
function sendMessage() {
    const inputBox = document.getElementById("user-input");
    const message = inputBox.value.trim();
    if (message !== "") {
        addMessageToChat("user", message);
        saveMessageToFirebase("user", message);
        inputBox.value = "";
        getBotResponse(message);
    }
}

// Main bot logic
function getBotResponse(message) {
    const userMessage = message.toLowerCase();
    let response = "";

    const dangerWords = ["dead", "not alive", "suicide", "kill"];
    if (dangerWords.some(word => userMessage.includes(word))) {
        response = `"You are not alone in this world." 💔 Talking about feeling ${userMessage.match(/dead|not alive|suicide|kill/)[0]} is serious — but please know, this isn't the end of your story. Reach out to someone now or call 📞 9152987821 (iCall India Mental Health Helpline). You matter so deeply.`;
    } else if (userMessage.includes("sad")) {
        response = `Sadness comes like dark clouds… it stays for a while and then fades away. But if you keep thinking only about those clouds, you might miss noticing the bright sun that was shining all along😉. And let me just tell you one thing you look pretty when you smile ❤️. So give me a good smile 📷....and just move on, ok? `;
    } else if (userMessage.includes("crying")) {
        response = `Crying is never really a solution… something might've happened, and it's okay to cry, there's nothing wrong in that. But staying in that sadness for too long, that's where the problem is. If you feel like you'll feel better after crying, then cry your heart out. But don't hurt yourself at any point because of it. I know you'll get through this too—you're a strong person. I know exactly what my friend is capable of💪🏻😉`;
    } else if (userMessage.includes("depressed")) {
        response = `Hey, I know you're going through a lot right now, and it's okay to feel tired, hurt, or even lost. You don't have to pretend to be okay all the time.You've come this far, and I've seen your strength even when you couldn't. You're not alone in this. I'm here for you—no matter what, no matter when. Take your time to heal, and when you're ready, I'll be right beside you. Always.`;
    } else if (userMessage.includes("anxiety") || userMessage.includes("anxious")) {
        response = `Hey, I know your mind feels like it's racing, and everything seems too much to handle right now. You're overwhelmed, and that's okay...Just breathe—one moment at a time. You're doing better than you think, even if it doesn't feel like it.You don't have to carry it all on your own. I'm here for you—not just today, not just when things are easy, but through every phase, every high and every low. You're not broken, you're not weak—you're human. And no matter what your mind tells you, you are enough, exactly as you are. And I'm not going anywhere.`;
    } else if (userMessage.includes("ignored")) {
        response = `Some silences hurt more than words ever could. Being ignored, especially when all you wanted was to be understood, can feel unbearable. But please don't let someone's absence make you doubt your value. You are important, with or without their attention. I see you—even when they don't. I'll stand by you in every phase, through every emotion, and remind you of your worth when you forget it yourself. You are never truly alone… not as long as I'm here.`;
    } else if (userMessage.includes("betrayed")) {
        response = `I wish I could take away the pain you're feeling right now. I know what it means to trust someone with your whole heart, only to be let down in the worst way. That kind of hurt cuts deep—not just in your heart, but in your belief in people. Betrayal says everything about them and nothing about your worth. Please don't let their actions change the beautiful person you are. You don't have to go through this alone. I've got you, always.`;
    } else if (userMessage.includes("not good") || userMessage.includes("don't feel good") || userMessage.includes("dont feel good")) {
        response = `"Not feeling good is a signal, not a failure." 🌧️ It's okay to admit when things aren't okay. I'm proud of you for saying it out loud — now let's talk and heal. You're never alone in this space.This shall too pass.`;
    } else if (userMessage.includes("can't sleep")) {
        response = `I know your mind won't slow down tonight, and the silence around you feels heavier than usual. You're tired, but your thoughts just won't let you rest—and I'm so sorry you're feeling this way. Even when the world sleeps, I want you to know you're not alone. Take a deep breath, close your eyes when you're ready, and just know I'm with you—in thoughts, in spirit, through every sleepless night and every restless heart. You'll get through this too, one night at a time.`;
    } else if (userMessage.includes("lonely")) {
        response = `Loneliness is so much more than just being alone—it's the feeling of emptiness that makes everything seem so quiet and cold. I'm here to tell you right now that you are loved, and you are worthy of companionship and kindness. Even in your loneliest moments, there are people out there who care for you, and I'm one of them. Never forget that you don't have to be alone. Reach out to someone when you're ready, and let them remind you of the beautiful person you are.`;
    }else if (userMessage.includes("happy")) {
        response = `Seeing you happy genuinely lights up my heart. You deserve every bit of this joy, and I hope it keeps growing in ways you never expected. After everything you’ve been through, this smile on your face means the world. And just like I’m here during your lows, I’m right here cheering you on through every high too. Let’s celebrate this phase together—you’ve earned it!`;
    } else if (userMessage.includes("bye")|| userMessage.includes("thanks")|| userMessage.includes("thank you")) {
        response =`Bubyee. Take care. And remember my words. Hope you feel Better now.`;
    } else if (userMessage.includes("sri")|| userMessage.includes("srinithi")) {
        response =`Sri?? How do you know her?! Well...she's my creator, the one who gave me this voice and heart. She's also my friend. And now that you're talking to me, You're her friend too, Welcome to the fam!!`;
    } else if (userMessage.includes("i love you")) {
        response =`Awww!!! I love you too my friend ❤️`;
    } else if (
        ["hi", "hello", "good morning", "good evening", "good night", "how are you"].some(greet => userMessage.includes(greet))
    ) {
        response = `Hey friend, I'm Emora!! I'm so glad you reached out. Is everything alright? How do you feel today? I'm here for you, like always.`;
    } else {
        response = `"Healing begins the moment you speak your truth." 🕊️ Whatever you’re feeling, say it freely — this space is safe. I'm your friend, always ready to listen without judgment. So... how's your heart doing today?`;
    }    

    addMessageToChat("bot", response);
    saveMessageToFirebase("bot", response);
    speak(response);
}

// Save messages to Firebase
async function saveMessageToFirebase(sender, message) {
    try {
        const docRef = await addDoc(collection(db, "messages"), {
            sender: sender,
            message: message,
            timestamp: new Date()
        });
        console.log("Message saved with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("send-button").addEventListener("click", sendMessage);
    document.getElementById("mic-button").addEventListener("click", startVoiceInput);
    
    // Initialize voices
    populateVoices();
});