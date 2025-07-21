const inputUserName = document.querySelector("#inp-username");
const formChat = document.querySelector("#form-chat");
const formSignIn = document.querySelector("#form-signin")
const containerChat = document.querySelector("#chat-screen");
const inputMessage = document.querySelector("#inp-msg")
const chatBox = document.querySelector("#chat-box")

const wss = new WebSocket("ws://localhost:8000");

wss.onopen = () => {
  console.log("WebSocket connection opened successfully!");
};

const user = {
  userId: "",
  userName: ""
};

// quando alguém enviar mensagem no servidor da api WSS, será exposto na interface do chatbot
wss.onmessage = ({ data }) => {
  const { userId, userName, content } = JSON.parse(data);

  if (userId === user.userId) {
    createMessageSelfElement(content)
  }
  else {
    createMessageOtherElement({
      userName, content
    })
  }
}

const scrollScreen = () => {
  chatBox.scrollTop = chatBox.scrollHeight
}

const createMessageSelfElement = (content) => {
  const div = document.createElement("div")
  div.classList.add("flex", "justify-end")

  const childDiv = document.createElement("div")
  childDiv.classList.add("bg-blue-500", "text-white", "p-2", "rounded-lg", "max-w-[75%]")

  chatBox.appendChild(div)
  div.appendChild(childDiv)

  childDiv.innerHTML = content
  scrollScreen()
}

const createMessageOtherElement = ({ userName, content }) => {
  const div = document.createElement("div")
  const childDiv = document.createElement("div")
  const childOtherDiv = document.createElement("div")

  div.classList.add("flex", "items-start", "gap-2")
  childDiv.classList.add("w-8", "h-8", "bg-gray-400", "text-white", "rounded-full", "flex", "items-center", "justify-center", "font-bold")
  childOtherDiv.classList.add("bg-gray-200", "text-gray-800", "p-2", "rounded-lg", "max-w-[75%]")

  chatBox.appendChild(div)
  div.appendChild(childDiv)
  div.appendChild(childOtherDiv)

  if (typeof userName === "string" && userName.length > 0) {
    childDiv.innerHTML = userName.charAt(0);
    childOtherDiv.innerHTML = `<strong>${userName}</strong> <br /> ${content}`
    scrollScreen()
  }
}

const handleSignIn = (event) => {
  event.preventDefault();

  if (!inputUserName.value.trim()) return;

  user.userId = crypto.randomUUID();
  user.userName = inputUserName.value.trim();

  formSignIn.classList.add("hidden");
  containerChat.classList.remove("hidden");

  if (wss.readyState !== WebSocket.OPEN) {
    console.log("WebSocket connection is not open yet.");
  }
};

const handleSendMessage = (event) => {
  event.preventDefault();

  const message = {
    userId: user.userId,
    userName: user.userName,
    content: inputMessage.value
  }

  if (wss.readyState === WebSocket.OPEN) {
    wss.send(JSON.stringify(message))
  }

  inputMessage.value = ""
};

formSignIn.addEventListener("submit", handleSignIn);
formChat.addEventListener("submit", handleSendMessage);