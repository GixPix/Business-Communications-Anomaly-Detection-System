document.getElementById('submitMessage').addEventListener('click', async function () {
    const API_URL = 'http://localhost:3000';
    const message = document.getElementById('messageInput').value;
    if (message.trim() === '') {
        showAlert('Please enter a message!', 'danger');
        return;
    }
    try {
        const response = await fetch(`${API_URL}/api/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        if (data.message === 'Dangerous message detected') {
            showAlert(`Anomaly detected with risk: ${data.risk}`, 'danger');
            addAnomalyToTable(message, data.risk, true);
        } else if (data.message === 'Message saved as normal') {
            addAnomalyToTable(message, false, false);
            showAlert('Message saved successfully!', 'success');
        }
    } catch (error) {
        showAlert('Error submitting message. Please try again later.', 'danger');
    }
    document.getElementById('messageInput').value = '';
});


document.getElementById('populateDatabase').addEventListener('click', async function () {
    const API_URL = 'http://localhost:3000'
    try {
        const response = await fetch(`${API_URL}/api/populate`, {
            method: 'POST'
        });
        const data = await response.json();
        showAlert(data.message, 'success');
    } catch (error) {
        showAlert('Error populating database. Please try again later.', 'danger');
    }
});

function showAlert(message, type) {
    const alert = document.getElementById('resultAlert');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.classList.remove('d-none');
    setTimeout(() => alert.classList.add('d-none'), 5000);
}

function addAnomalyToTable(message, riskScore, isAnomaly) {
    const table = document.getElementById('anomaliesTable');
    const row = document.createElement('tr');
    const messageClass = isAnomaly ? 'text-danger' : '';
    row.innerHTML = `
        <td class="${messageClass}">${message}</td>
        <td class="${messageClass}">${riskScore}</td>
        <td class="${messageClass}">${new Date().toLocaleString()}</td>
    `;
    table.appendChild(row);
}
