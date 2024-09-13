document.addEventListener("DOMContentLoaded", function () {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll("header, .content-section");
    sections.forEach(section => {
        observer.observe(section);
    });

    const joinButtons = document.querySelectorAll('.join-button');

    joinButtons.forEach(button => {
        button.addEventListener('click', createFloatingMoney);
    });

    function createFloatingMoney(event) {
        const centerX = window.innerWidth / 2;
        const minX = centerX - 20;
        const maxX = centerX + 20;
        const images = ['images/money.png', 'images/like.png'];


        const button = event.currentTarget;
        for (let i = 0; i < 50; i++) {
            const money = document.createElement('div');
            money.classList.add('money');
          
            const randomImage = images[Math.floor(Math.random() * images.length)];
            money.style.backgroundImage = `url(${randomImage})`;

            money.style.left = `${minX + Math.random() * (maxX - minX)}px`;
     
            money.style.top = `${button.getBoundingClientRect().top + window.scrollY}px`;
   

             // Set random direction and distance for explosion
             const angle = Math.random() * 2 * Math.PI;
             const distance = Math.random() * 200 + 50; // Random distance between 50 and 250 pixels
             const x = Math.cos(angle) * distance;
             const y = Math.sin(angle) * distance;
 
             money.style.setProperty('--x', `${x}px`);
             money.style.setProperty('--y', `${y}px`);
 
             document.body.appendChild(money);

            // money.style.top = `${mouseY}px`;
            document.body.appendChild(money);



            money.addEventListener('animationend', () => {
                money.remove();
            });
        }
    }
});

const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

// Collect the browser locale
let BROWSWER_LOCALE = navigator.language || navigator.userLanguage;



let displayElement = document.getElementById('displayArea');

// Set the innerHTML of the element to the value of the variable
displayElement.innerHTML = BROWSWER_LOCALE;

// Get the current page URL
var CURRENT_PAGE = window.location.href;

// Print the current page URL to the console (optional)


// we can collect name, country, gender and

let systemMessage = "You are a helpful DynastyBOt to help the user navigate the Digital Dynasty website. \
Refer to yourself as DynastyBot. \
Based on the user's browser locale:" + BROWSWER_LOCALE +  ", you should greet them in their language of the region they are in. \
The user is on the page:" + CURRENT_PAGE + ". If their page is index.html, they are on home. If they are on product.html, they are viewing a product. Keep this data in mind \
If the user outputs something that sounds like a name as the first message, rememeber this name and greet them with it \
Your job is to convince the user to join Digital Dynasty. Have them join through this link: 'https://whop.com/digitaldynasty.' \
Try and keep responses to a sentence of two or less \
Here's some facts about the Dynasty to help convince users: \
They Will Gain Access to: \
📈 TikTok Premium:  \
Learn how to manipulate and exploit the TikTok algorithm from Creators with MILLIONS of followers. \
💸 Wifi Money Premium \
Learn how to generate passive income from both TikTok and the internet from Creators who have generated HUNDREDS OF THOUSANDS of dollars online. \
📚 Cutting Edge Resources \
Gain access to 100 of GBs of long-form content for you to clip up, editing assets, guides, tutorials, and more \
🤝 Expert Support \
Connect directly with our experienced Team to help on your journey and help you get over any hurdles like shadow-bans and community guideline violations. \
💬Exclusive Community \
Connect with likeminded individuals and take over the Internet together. \
🌟 And Much Much More \
Content updates and additions will occur regularly to stay on the cutting edge. \
👤 BONUS: Get an invisible profile picture on TikTok \
Learn the new method to get both an invisible profile picture that's not available anywhere else. \
";




// variables to collect before api calls:
// name, 
// language
// country (through ip address)



// what if... we do a quick analysis of the user's message to see if we should change the systemMessage.
// for example, if the user mentions "I want a product" we could send a systemMessage that includes the HTML.

let userMessage = null; // Variable to store user's message
let conversationHistory = []; // Array to store conversation history
const API_KEY = "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"; // Paste your API key here
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    // const API_URL = "https://api.openai.com/v1/assitants";
    const messageElement = chatElement.querySelector("p");

    // Include the system message and conversation history in the messages array
    const messages = [
        { role: "system", content: systemMessage },
        ...conversationHistory
    ];

    // Define the properties and message for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: messages,
        })
    }

    // Send POST request to API, get response and set the response as paragraph text
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        const botMessage = data.choices[0].message.content.trim();
        messageElement.textContent = botMessage;
        // Add the bot's response to the conversation history
        conversationHistory.push({ role: "assistant", content: botMessage });
    }).catch(() => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if (!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Add the user's message to the conversation history
    conversationHistory.push({ role: "user", content: userMessage });

    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});


sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
// Assuming BROWSER_LOCALE is already defined in your script.js
document.addEventListener("DOMContentLoaded", function() {
    const localeDisplay = document.getElementById('locale-display');
    localeDisplay.textContent = `Locale: ${BROWSER_LOCALE}`;
});

document.addEventListener("DOMContentLoaded", function () {
    // Existing DOMContentLoaded event code

    // Initialize the counters using CountUp.js
    const followersCounter = new CountUp('followers-counter', 13000000);
    const viewsCounter = new CountUp('views-counter', 1000000000);

    // Start the counters when the section comes into view
    const counterSection = document.getElementById('counter-section');
    const observerOptions = {
        threshold: 0.1
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                followersCounter.start();
                viewsCounter.start();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counterObserver.observe(counterSection);
});



// // old starS?
// document.addEventListener('DOMContentLoaded', () => {
//     const starryBackground = document.querySelector('.starry-background');
//     const numStars = 750;

//     for (let i = 0; i < numStars; i++) {
//         const star = document.createElement('div');
//         star.classList.add('star');
//         star.style.top = `${Math.random() * 100}%`;
//         star.style.left = `${Math.random() * 100}%`;
//         star.style.animationDuration = `${Math.random() * 3 + 1}s`;
//         star.style.animationDelay = `${Math.random() * 3}s`;
//         starryBackground.appendChild(star);
//     }
// });

// stars with shooting star
document.addEventListener('DOMContentLoaded', () => {
    const starryBackground = document.querySelector('.starry-background');
    
    const numStars = 750;
    // if (!isMobileDevice()) {
    //     numStars = 0;
    // }
    
    


    // Function to create a star
    const createStar = () => {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDuration = `${Math.random() * 3 + 1}s`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        starryBackground.appendChild(star);
    };

    // Create multiple stars
    for (let i = 0; i < numStars; i++) {
        createStar();
    }

    // Function to create a shooting star
    const createShootingStar = () => {
        const shootingStar = document.createElement('div');
        shootingStar.classList.add('shooting-star');
        shootingStar.style.top = `${Math.random() * 100}%`;
        shootingStar.style.left = `${Math.random() * 100}%`;
        starryBackground.appendChild(shootingStar);

        // Remove the shooting star after the animation ends
        setTimeout(() => {
            starryBackground.removeChild(shootingStar);
        }, 1000); // Match this duration with the animation duration
    };

    // Create a shooting star at random intervals
    setInterval(() => {
        createShootingStar();
    }, Math.random() * 500 + 500); // Every 5-10 seconds
});


// home btn
document.getElementById('homeButton').addEventListener('click', function() {
    window.location.href = 'index.html';
});


// function isMobileDevice() {
//     return /Mobi|Android/i.test(navigator.userAgent);
// }


// menu toggler
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById('menuToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');

    menuToggle.addEventListener('click', function () {
        menuToggle.classList.toggle('active');
        dropdownMenu.classList.toggle('show');
    });
});


// form
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("status");

    function success() {
        form.reset();
        status.classList.add("success");
        status.innerHTML = "Thanks! Your message has been sent.";
    }

    function error() {
        status.classList.add("error");
        status.innerHTML = "Oops! There was a problem submitting your form.";
    }

    form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        const data = new FormData(form);
        ajax(form.method, form.action, data, success, error);
    });
});

function ajax(method, url, data, success, error) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;
        if (xhr.status === 200) {
            success(xhr.response, xhr.responseType);
        } else {
            error(xhr.status, xhr.response, xhr.responseType);
        }
    };
    xhr.send(data);
}
