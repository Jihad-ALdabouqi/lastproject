const API_KEY = "AIzaSyAGWOyX_CIWeuft6t9xF2PE3VwXG3iD5Fw";

async function sendToGemini(message) {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: message }] }]
      })
    }
  );

  const data = await response.json();

  if (!data.candidates) {
    return "API Error: تأكد أن المفتاح صحيح وأن الموديل متاح.";
  }

  let reply = data.candidates[0].content.parts[0].text;
  reply = reply.replace(/[*_~`]/g, ""); 
  return reply;
}

function addMessage(sender, text, cls) {
  const chat = document.getElementById("chat");
  chat.innerHTML += `
    <div class="msg ${cls}">
      <div class="sender">${sender}</div>
      <div class="text">${text}</div>
    </div>
  `;
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("inputBox");
  const text = input.value.trim();
  if (!text) return;
  addMessage("You", text, "user");
  input.value = "";
  const reply = await sendToGemini(text);
  addMessage("Bot", reply, "bot");
}

document.getElementById("sendBtn").onclick = sendMessage;

document.getElementById("inputBox").addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    await sendMessage();
  }
});