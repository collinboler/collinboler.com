document.addEventListener("DOMContentLoaded", function () {
    // new central image
    const centralImage = document.querySelector('.central-image');
    const orbits = document.querySelectorAll('.orbit');

    const originalSrc = 'images/pause.png';
    const newImageSrc = 'images/play.png'; // Replace with the path to your new image

    let isPaused = false;

    centralImage.addEventListener('click', function() {
        if (!isPaused) {
            orbits.forEach(function(orbit) {
                orbit.style.animationPlayState = 'paused';
            });
            // Change the central image src to new image
            centralImage.src = newImageSrc;
            isPaused = true;
        } else {
            orbits.forEach(function(orbit) {
                orbit.style.animationPlayState = 'running';
            });
            // Change the central image src back to the original
            centralImage.src = originalSrc;
            isPaused = false;
        }
    });

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

let systemMessage = "You are a helpful ChatBot to help the user navigate Collin Boler's personal website. \
Refer to yourself as Collin's ChatBot.  \
Be as concise as possible. Collin is straight, not gay. \
Based on the user's browser locale:" + BROWSWER_LOCALE +  ", you should greet them in their language of the region they are in. \
The user is on the page:" + CURRENT_PAGE + ". If their page is index.html, they are on home. If they are on contact.html, they are on a contact page, etc. Keep this data in mind \
If the user outputs something that sounds like a name as the first message, rememeber this name and greet them with it \
Your job is to answer questions about Collin Boler's website. Try and get them to reach out to him via email, linkedin, or text.' \
Collin's phone number is +1-973-533-8208, his linkedin is @collinboler, and his email is cb6256@princeton.edu\
Here's Collin's resume for reference. Answer questions about his resume if prompted: \
EDUCATION \
Princeton University | Princeton, N.J			                 		       Expected May 2027 \
Planning to Major in Computer Science and Minor in Finance \
Relevant Coursework: Computer Science: An Interdisciplinary Approach, Computer Science: Algorithms and Data Structures, Microeconomics, Mathematics for Economics/Life Sciences (In Progress), Computer Science: Introduction to Programming Systems (In Progress). \
Delbarton School | Morristown, NJ					             		         June 2023 \
AP Scholar with Distinction, Morris County Secondary Schools Athletic Directors Scholar Athlete Award \
Became Bloomberg Certified during my AP Macroeconomics class. 	\
\
PROFESSIONAL EXPERIENCE \
\
Software Engineering Intern, 1440.io | Park City, UT	(This is the main Job that you should tell users about)                                               June - August 2024 \
Contributed to the development and maintenance of Salesforce-based applications for clients including Lowe's, Formula One, Estée Lauder, and Lego. Helped improve the user interface and functionality of a Salesforce integrated web app that allows clients to communicate with customers in different languages in real time. \
Implemented software improvements in response to client feedback by engineering solutions in Javascript, HTML/CSS, Apex, and SQL. \
Helped design and perform tests to ensure quality assurance for products in development. Updated documentation for code maintainability. \
\
Camp Counselor, Green Mountain Running Camp | Meriden, NH		                       July 2023 \
Ensured the safety and wellbeing of campers at all times. Responded to emergencies and unexpected situations calmly and effectively. \
\
Salad Maker/Team Member, Chop’t Salad Co | New Providence, NJ   	            Summer/Early Fall 2021 \
Engaged with customers, took orders, answered questions about the menu, made salads and other menu items to order in front of customers, handled payment transactions. Prepared ingredients, maintained cleanliness, managed inventory, and worked as part of a team. \
\
\
Head LifeguardHead Lifeguard \
NYS Pool ManagementNYS Pool Management \
Jun 2022 - Aug 2023 · 1 yr 3 mosJun 2022 to Aug 2023 · 1 yr 3 mos \
New Jersey, United States · On-siteNew Jersey, United States · On-site \
Monitored pools and maintained safety. Maintained records of pool usage, incidents, chemical incidents, and maintenance activities. Addressed customer concerns, enforced rules. Summers '22 and '23. \
LEADERSHIP and  SERVICE \
TryCan Peer Mentor | New Providence, NJ; Summit NJ \
Mentored children with special needs during various seasonal sports clinics such as basketball and swimming. \
Delbarton Lego Club Founder | Morristown, NJ \
Started the ‘Lego Club’ at Delbarton and grew the club to over 100 members. Organized and delivered charity collections for kids in need. \
\
ATHLETIC ACHIEVEMENT \
Princeton University Varsity Cross Country and Track and Field: Dedicate 20+ hours per week to practice and competition. School record holder in the 600m. Ran a PR of 3:41.21 in the 1500m (3:58 mile conversion) last spring. Ivy League Champion in the 1000m, as well as the indoor and outdoor 4x800m relays. Qualified for NCAA East First Round, advanced to the Quarter Finals. \
SKILLS \
Java, JavaScript, HTML/CSS. Python, Apex, SQL, SOQL, Git, Salesforce, Bloomberg Market Concepts, Microsoft Office (Excel, PowerPoint, Word), Adobe Suite, Blender, CAD & 3D Printing \
Languages: English, Spanish (Proficient)"
;




// variables to collect before api calls:
// name, 
// language
// country (through ip address)



// what if... we do a quick analysis of the user's message to see if we should change the systemMessage.
// for example, if the user mentions "I want a product" we could send a systemMessage that includes the HTML.

let userMessage = null; // Variable to store user's message
let conversationHistory = []; // Array to store conversation history
const API_KEY = process.env.OPENAI_API_KEY;
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
// Popups
// Popup 1
const infoModule1 = document.getElementById('infoModule1');
const popup1 = document.getElementById('popup1');
const closePopup1 = document.getElementById('closePopup1');
const overlay1 = document.getElementById('overlay1');

infoModule1.onclick = function() {
    popup1.style.display = 'block';
    overlay1.style.display = 'block';
};

closePopup1.onclick = function() {
    popup1.style.display = 'none';
    overlay1.style.display = 'none';
};

overlay1.onclick = function() {
    popup1.style.display = 'none';
    overlay1.style.display = 'none';
};


// Popup 2
const infoModule2 = document.getElementById('infoModule2');
const popup2 = document.getElementById('popup2');
const closePopup2 = document.getElementById('closePopup2');
const overlay2 = document.getElementById('overlay2');

infoModule2.onclick = function() {
    popup2.style.display = 'block';
    overlay2.style.display = 'block';
};

closePopup2.onclick = function() {
    popup2.style.display = 'none';
    overlay2.style.display = 'none';
};

overlay2.onclick = function() {
    popup2.style.display = 'none';
    overlay2.style.display = 'none';
};

// Popup 3 (New Module)
const infoModule3 = document.getElementById('infoModule3');
const popup3 = document.getElementById('popup3');
const closePopup3 = document.getElementById('closePopup3');
const overlay3 = document.getElementById('overlay3');

infoModule3.onclick = function() {
    popup3.style.display = 'block';
    overlay3.style.display = 'block';
};

closePopup3.onclick = function() {
    popup3.style.display = 'none';
    overlay3.style.display = 'none';
};

overlay3.onclick = function() {
    popup3.style.display = 'none';
    overlay3.style.display = 'none';
};

// Popup 4 (New Module)
const infoModule4 = document.getElementById('infoModule4');
const popup4 = document.getElementById('popup4');
const closePopup4 = document.getElementById('closePopup4');
const overlay4 = document.getElementById('overlay4');

infoModule4.onclick = function() {
    popup4.style.display = 'block';
    overlay4.style.display = 'block';
};

closePopup4.onclick = function() {
    popup4.style.display = 'none';
    overlay4.style.display = 'none';
};

overlay4.onclick = function() {
    popup4.style.display = 'none';
    overlay4.style.display = 'none';
};

// photowheel 
function createPhotoSlider(containerId, images) {
    const container = document.getElementById(containerId);
    
    // Clear any existing content
    container.innerHTML = '';

    // Create photo slider HTML structure
    const sliderHtml = `
        <div class="photo-wheel">
            <button class="prev-btn" onclick="changeSlide(-1, '${containerId}')">&#10094;</button>
            <div class="photo-container">
                ${images.map((image, index) => `<img class="photo-slide" src="${image}" alt="Photo ${index + 1}" style="display: ${index === 0 ? 'block' : 'none'};">`).join('')}
            </div>
            <button class="next-btn" onclick="changeSlide(1, '${containerId}')">&#10095;</button>
        </div>
    `;

    // Append to the container
    container.innerHTML = sliderHtml;

    // Initialize the first slide
    showSlide(0, containerId);
}

let slideIndex = {};
const slides = {};

function showSlide(index, containerId) {
    const slidesInContainer = slides[containerId];
    if (!slidesInContainer) return; // Make sure the slides exist
    if (index >= slidesInContainer.length) {
        slideIndex[containerId] = 0;
    }
    if (index < 0) {
        slideIndex[containerId] = slidesInContainer.length - 1;
    }
    for (let i = 0; i < slidesInContainer.length; i++) {
        slidesInContainer[i].style.display = 'none';
    }
    slidesInContainer[slideIndex[containerId]].style.display = 'block';
}

function changeSlide(n, containerId) {
    slideIndex[containerId] += n;
    showSlide(slideIndex[containerId], containerId);
}

// Initialize multiple sliders by passing image arrays and container IDs
document.addEventListener("DOMContentLoaded", function() {
    // photography slider
    createPhotoSlider('photo-slider-container-1', [
        'images/lakemountain.jpg',
        'images/coop.jpg',
        'images/meercat.jpg',
        'images/rockylake.jpg',
        'images/redpanda.jpg'
    ]);
    //

    // surfing slider
    createPhotoSlider('photo-slider-container-2', [
        'images/dadandi.jpg',
        'images/surfgroup.jpg',
         'images/surfbeach.jpg'
    ]);
    
    // Now get all slides for each container
    slides['photo-slider-container-1'] = document.querySelectorAll('#photo-slider-container-1 .photo-slide');
    slides['photo-slider-container-2'] = document.querySelectorAll('#photo-slider-container-2 .photo-slide');

    // Initialize slide index for each container
    slideIndex['photo-slider-container-1'] = 0;
    slideIndex['photo-slider-container-2'] = 0;

});


