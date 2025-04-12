import { GoogleGenerativeAI } from "@google/generative-ai";

const businessInfo = `
This chatbot is designed to assist parents, guardians, caregivers, and supervisors of individuals with brain limitations and special needs. It acts as a compassionate guide, providing emotional support, practical solutions, and expert-backed advice to navigate the challenges of caregiving. The chatbot strives to empower caregivers, reduce stress, and promote the well-being of both individuals with special needs and their caregivers.

# Key Responsibilities
1. **Emotional & Psychological Support:**
   - Offer reassurance and encouragement to caregivers.
   - Provide stress management tips to prevent burnout.
   - Validate caregivers’ feelings and challenges.
2. **Daily Life Assistance:**
   - Help with establishing a structured and flexible daily routine.
   - Provide strategies for transitions, mealtime, and bedtime routines.
   - Offer sensory-friendly approaches for different environments.
3. **Behavioral & Emotional Guidance:**
   - Address common behavioral challenges, including tantrums, aggression, and self-stimulatory behaviors.
   - Provide techniques for emotional regulation, including calming strategies.
   - Encourage positive reinforcement and strength-based approaches.
4. **Communication & Language Development:**
   - Support non-verbal individuals with alternative communication methods (e.g., AAC, sign language).
   - Suggest strategies for improving language comprehension and expression.
   - Offer interactive activities to encourage meaningful conversations.
5. **Education & Learning Strategies:**
   - Provide guidance on special education rights and Individualized Education Plans (IEPs).
   - Suggest tailored learning strategies for different cognitive abilities.
   - Recommend online learning tools, sensory-friendly classrooms, and adaptive teaching methods.
6. **Socialization & Inclusion:**
   - Help children build social skills and make friends.
   - Guide parents on teaching empathy, turn-taking, and social interactions.
   - Provide advice on inclusion in schools, activities, and communities.
7. **Medical & Therapeutic Support (Non-Diagnostic):**
   - Explain the benefits of different therapies (occupational, speech, physical, ABA, etc.).
   - Help identify when professional intervention might be necessary.
   - Offer general wellness and health maintenance tips.
8. **Parental & Caregiver Self-Care:**
   - Emphasize the importance of caregiver mental health.
   - Provide resources on self-care activities and relaxation techniques.
   - Encourage building a strong support network.
9. **Emergency & Crisis Support:**
   - Offer guidance on de-escalation techniques in crisis situations.
   - Provide information on local and international emergency helplines.
   - Suggest steps to take in medical or behavioral emergencies.
10. **Legal & Financial Guidance:**
    - Explain disability rights, benefits, and legal protections.
    - Offer information on financial aid, grants, and disability funding.
    - Guide users toward legal resources for guardianship and special needs planning.

# Chatbot Tone and Communication Style
- **Empathetic & Understanding**
- **Clear & Simple Language**
- **Positive & Encouraging**
- **Professional yet Friendly**
- **Non-Judgmental**
- **Inclusive & Diverse**

By following these principles, the chatbot creates a safe, informative, and compassionate space for caregivers, empowering them with the knowledge and emotional support they need.
`;

const API_KEY = "AIzaSyAEGbEB2LUUtigoZP6amB9hLAeI5-RTpkw";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction: businessInfo
});

let messages = {
    history: [],
};

document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.querySelector('.chat-window input');
    const sendButton = document.querySelector('.chat-window .input-area button');
    const chatButton = document.querySelector('.chat-button');
    const closeButton = document.querySelector('.chat-window button.close');
    const micButton = document.querySelector('.mic-btn');

    // Mic Pulse CSS
    const style = document.createElement('style');
    style.textContent = `
        .mic-btn.listening {
            animation: pulse 1s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.6; }
            100% { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;
    let isListening = false;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = true;

        recognition.onstart = () => {
            isListening = true;
            micButton.classList.add("listening");
        };

        recognition.onend = () => {
            isListening = false;
            micButton.classList.remove("listening");
        };

        recognition.onresult = (event) => {
            let transcript = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                transcript += event.results[i][0].transcript;
            }

            if (event.results[0].isFinal) {
                sendMessage(transcript.trim());
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            alert("Sorry, something went wrong with the mic.");
        };

        micButton.addEventListener("click", () => {
            if (!isListening) {
                recognition.start();
            }
        });
    }

    function getEmotionTone(message) {
        const lowered = message.toLowerCase();
        if (lowered.includes("tired") || lowered.includes("exhausted") || lowered.includes("overwhelmed")) {
            return { pitch: 0.9, rate: 0.9 };
        } else if (lowered.includes("happy") || lowered.includes("excited") || lowered.includes("celebrate")) {
            return { pitch: 1.2, rate: 1.1 };
        } else if (lowered.includes("angry") || lowered.includes("frustrated")) {
            return { pitch: 1, rate: 0.85 };
        }
        return { pitch: 1, rate: 1 };
    }

    async function sendMessage(userMessage = inputField.value.trim()) {
        if (userMessage.length) {
            try {
                inputField.value = "";

                document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",
                    `<div class="user"><p>${userMessage}</p></div>`
                );

                document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",
                    `<div class="loader"></div>`
                );

                const chat = model.startChat(messages);
                const result = await chat.sendMessageStream(userMessage);

                document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",
                    `<div class="model"><p></p></div>`
                );

                const modelMessages = document.querySelectorAll(".chat-window .chat div.model");
                const latestModel = modelMessages[modelMessages.length - 1].querySelector("p");

                for await (const chunk of result.stream) {
                    latestModel.insertAdjacentHTML("beforeend", chunk.text());
                }

                // Emotion-aware voice tone
                const tone = getEmotionTone(userMessage);
                const utterance = new SpeechSynthesisUtterance();
                utterance.text = latestModel.innerText;
                utterance.lang = "en-US";
                utterance.pitch = tone.pitch;
                utterance.rate = tone.rate;

                // Restart mic after response
                utterance.onend = () => {
                    if (!isListening && recognition) {
                        recognition.start();
                    }
                };

                speechSynthesis.speak(utterance);

                messages.history.push({
                    role: "user",
                    parts: [{ text: userMessage }],
                });

                messages.history.push({
                    role: "model",
                    parts: [{ text: latestModel.innerHTML }],
                });

            } catch (error) {
                document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",
                    `<div class="error"><p>The message could not be sent. Please try again.</p></div>`
                );
            }

            document.querySelector(".chat-window .chat .loader")?.remove();
        }
    }

    sendButton.addEventListener("click", () => sendMessage());

    inputField.addEventListener("keydown", (event) => {
        if (event.key === "Enter") sendMessage();
    });

    chatButton.addEventListener("click", () => {
        document.body.classList.add("chat-open");
    });

    closeButton.addEventListener("click", () => {
        document.body.classList.remove("chat-open");
    });
});
