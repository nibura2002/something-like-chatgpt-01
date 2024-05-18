let chatHistory = [];
let chatSessions = [];
let thinkingIndicator;

function handleKeyDown(event) {
    if ((event.key === 'Enter' && event.ctrlKey) || (event.key === 'Enter' && event.metaKey)) {
        sendPrompt();
    }
}

async function sendPrompt() {
    const prompt = document.getElementById('prompt').value;
    if (!prompt) return;

    chatHistory.push({ role: 'user', message: prompt });
    updateChatOutput();
    document.getElementById('prompt').value = '';

    showThinkingIndicator();

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) {
            const data = await response.json();
            console.error('Error:', data.error);
            alert('Error: ' + data.error);
            hideThinkingIndicator();
            return;
        }

        const data = await response.json();
        chatHistory.push({ role: 'assistant', message: data.response });

        updateChatOutput();
        document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
        hideThinkingIndicator();
    } catch (error) {
        hideThinkingIndicator();
        console.error('Error:', error);
        alert('Error: ' + error);
    }
}

function showThinkingIndicator() {
    const chatOutput = document.getElementById('chat-output');
    thinkingIndicator = document.createElement('div');
    thinkingIndicator.className = 'assistant-message thinking-indicator';
    thinkingIndicator.innerHTML = '...';
    chatOutput.appendChild(thinkingIndicator);
    document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
}

function hideThinkingIndicator() {
    if (thinkingIndicator) {
        thinkingIndicator.remove();
        thinkingIndicator = null;
    }
}

function updateChatOutput() {
    const chatOutput = document.getElementById('chat-output');
    chatOutput.innerHTML = '';
    chatHistory.forEach(entry => {
        const messageDiv = document.createElement('div');
        messageDiv.className = entry.role === 'user' ? 'user-message' : 'assistant-message';
        messageDiv.innerText = entry.message;
        chatOutput.appendChild(messageDiv);
        chatOutput.appendChild(document.createElement('br')); // 空行を追加して区切りを明確に
    });
}

function updateHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    chatSessions.forEach((session, index) => {
        const historyItem = document.createElement('li');
        historyItem.innerText = getTruncatedMessage(session[0].message);
        historyItem.onclick = () => loadSession(index);
        historyList.appendChild(historyItem);
    });
}

function getTruncatedMessage(message, maxLength = 30) {
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
}

function startNewChat() {
    if (chatHistory.length > 0) {
        chatSessions.push([...chatHistory]);
        chatHistory = [];
        updateHistory();
        updateChatOutput();
    }
}

function loadSession(index) {
    chatHistory = chatSessions[index];
    updateChatOutput();
}

async function changeModel() {
    const model = document.getElementById('model-select').value;
    try {
        const response = await fetch('/set_model', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ model: model })
        });
        if (!response.ok) {
            const data = await response.json();
            console.error('Error:', data.error);
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error);
    }
}
