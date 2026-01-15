// Auto-update year
document.getElementById('year').textContent = new Date().getFullYear();

// Toggle Mode
function toggleMode() {
  document.body.classList.toggle('light-mode');
}

// === AI CHATBOT ===
let chatHistory = [];

async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  addMessageToDisplay(message, 'user');
  input.value = '';
  chatHistory.push({ role: "user", content: message });

  // Show loading indicator
  addMessageToDisplay("...", 'bot');

  try {
    const response = await fetch("/.netlify/functions/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: chatHistory }),
    });

    const data = await response.json();

    // Remove loading dots
    const chatDisplay = document.getElementById("chatDisplay");
    chatDisplay.removeChild(chatDisplay.lastChild);

    if (response.ok) {
      addMessageToDisplay(data.reply, 'bot');
      chatHistory.push({ role: "assistant", content: data.reply });
    } else {
      addMessageToDisplay("Oops! Something went wrong. Please try again.", 'bot');
    }
  } catch (err) {
    const chatDisplay = document.getElementById("chatDisplay");
    chatDisplay.removeChild(chatDisplay.lastChild);
    addMessageToDisplay("Failed to connect. Check your internet.", 'bot');
  }
}

function addMessageToDisplay(text, sender) {
  const chatDisplay = document.getElementById("chatDisplay");
  const msgDiv = document.createElement("div");
  msgDiv.className = sender;
  msgDiv.textContent = text;
  chatDisplay.appendChild(msgDiv);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

document.getElementById("userInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
