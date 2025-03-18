// Navbar Toggle Functionality
let menu = document.querySelector("#menu-btn");
let navbar = document.querySelector(".navbar");

menu.onclick = () => {
  menu.classList.toggle("fa-times");
  navbar.classList.toggle("active");
};

window.onscroll = () => {
  menu.classList.remove("fa-times");
  navbar.classList.remove("active");
};

// Chatbot Functionality
document.addEventListener("DOMContentLoaded", () => {
  const chatbotToggleBtn = document.getElementById("chatbot-toggle-btn");
  const chatbotContainer = document.querySelector(".chatbot-container");
  const closeChatbotBtn = document.getElementById("close-chatbot");
  const sendMessageBtn = document.getElementById("send-message-btn");
  const chatbotInput = document.getElementById("chatbot-input");
  const chatbotBody = document.getElementById("chatbot-body");

  // Ensure the chatbot is hidden initially
  chatbotContainer.style.display = "none";

  // Toggle the chatbot on button click
  chatbotToggleBtn.addEventListener("click", () => {
    chatbotContainer.style.display =
      chatbotContainer.style.display === "none" || chatbotContainer.style.display === ""
        ? "flex"
        : "none";
  });

  // Close chatbot
  closeChatbotBtn.addEventListener("click", () => {
    chatbotContainer.style.display = "none";
  });

  // Send message on button click
  sendMessageBtn.addEventListener("click", sendMessage);

  // Handle Enter key press for sending message
  chatbotInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  function sendMessage() {
    const userMessage = chatbotInput.value.trim();
    if (userMessage === "") return;

    // Display user message
    const userMessageDiv = document.createElement("div");
    userMessageDiv.classList.add("chatbot-message", "user");
    userMessageDiv.textContent = userMessage;
    chatbotBody.appendChild(userMessageDiv);
    chatbotInput.value = "";

    // Scroll to the bottom
    chatbotBody.scrollTop = chatbotBody.scrollHeight;

    // Handle response
    handleBotResponse(userMessage);
  }

  async function handleBotResponse(message) {
    const lowerCaseMessage = message.toLowerCase();

    // Predefined responses
    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      addBotMessage("Hello! How can I assist you today?");
    } else if (lowerCaseMessage.includes("weather")) {
      addBotMessage("The weather today is sunny and 25°C.");
    } else if (lowerCaseMessage.includes("crop")) {
      addBotMessage("I can suggest the best crops based on your region.");
    } else if (lowerCaseMessage.includes("fact")) {
      addBotMessage("Octopuses have three hearts, and their blood is blue due to the presence of hemocyanin, a copper-based molecule that helps transport oxygen.");
    } else if (lowerCaseMessage.includes("joke")) {
      addBotMessage("Why don’t skeletons fight each other ? They don’t have the guts.");


    } else if (lowerCaseMessage.includes("quote")) {
      await fetchQuote();
    } else if (lowerCaseMessage.includes("game")) {
      startMiniGame();
    } else {
      addBotMessage("Sorry, I didn't quite catch that. Could you ask again?");
    }
  }

  async function fetchFact() {
    const apiKey = "6mv4dSKYpa3Ektvyq3Zh4w==Gn0Sg4QBrjD1BK5L"; // Replace with your API Ninjas key
    try {
      const response = await fetch(`https://api.api-ninjas.com/v1/facts?limit=1`, {
        headers: {
          "X-Api-Key": apiKey,
        },
      });
      const data = await response.json();
      const fact = data[0]?.fact || "I couldn't fetch a fact at the moment. Please try again.";
      addBotMessage(fact);
    } catch (error) {
      addBotMessage("Oops! Something went wrong while fetching a fact.");
    }
  }

  async function fetchJoke() {
    try {
      const response = await fetch("https://official-joke-api.appspot.com/random_joke");
      const data = await response.json();
      const joke = `${data.setup} ${data.punchline}`;
      addBotMessage(joke);
    } catch (error) {
      addBotMessage("Oops! Something went wrong while fetching a joke.");
    }
  }

  async function fetchQuote() {
    try {
      const response = await fetch("https://api.quotable.io/random");
      const data = await response.json();
      const quote = `"${data.content}" - ${data.author}`;
      addBotMessage(quote);
    } catch (error) {
      addBotMessage("Oops! Something went wrong while fetching a quote.");
    }
  }

  function startMiniGame() {
    addBotMessage("Let's play a game! Guess a number between 1 and 10.");
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    let attempts = 3;

    const handleGuess = (message) => {
      const guess = parseInt(message);
      if (isNaN(guess)) {
        addBotMessage("Please enter a valid number.");
        return;
      }

      attempts--;
      if (guess === randomNumber) {
        addBotMessage("Congratulations! You guessed the correct number!");
        chatbotInput.removeEventListener("keydown", guessListener);
      } else if (attempts > 0) {
        addBotMessage(`Wrong guess! You have ${attempts} attempts left.`);
      } else {
        addBotMessage(`Game over! The correct number was ${randomNumber}.`);
        chatbotInput.removeEventListener("keydown", guessListener);
      }
    };

    const guessListener = (e) => {
      if (e.key === "Enter") {
        handleGuess(chatbotInput.value.trim());
        chatbotInput.value = "";
      }
    };

    chatbotInput.addEventListener("keydown", guessListener);
  }

  function addBotMessage(message) {
    const botMessageDiv = document.createElement("div");
    botMessageDiv.classList.add("chatbot-message", "bot");
    botMessageDiv.textContent = message;
    chatbotBody.appendChild(botMessageDiv);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  }

  // Dark Mode Toggle Functionality
  const darkModeBtn = document.getElementById("dark-mode-btn");

  // Check if dark mode is enabled in localStorage
  const darkModeEnabled = localStorage.getItem("dark-mode") === "enabled";
  if (darkModeEnabled) {
    document.body.classList.add("dark-mode");
  }

  // Toggle dark mode when the button is clicked
  darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // Save the dark mode state to localStorage
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("dark-mode", "enabled");
    } else {
      localStorage.setItem("dark-mode", "disabled");
    }
  });

  // Crazy Feature: Add confetti on chatbot toggle
  chatbotToggleBtn.addEventListener("click", () => {
    if (chatbotContainer.style.display === "flex") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  });
});