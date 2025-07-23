document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('search-btn')?.addEventListener('click', () => {
        const address = document.getElementById('address-input').value;
        if (!address) return;

        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const { lat, lon } = data[0];
                    map.setView([lat, lon], 16);
                    
                    map.closePopup();

                    const form = document.createElement('form');
                    form.innerHTML = `
                        <h3>Reportar Perigo em:</h3>
                        <p><strong>${address}</strong></p>
                        <div class="form-group">
                            <label>Tipo de Ocorrência:</label>
                            <select class="occurrence-type">
                                <option value="Assédio">Assédio</option>
                                <option value="Roubo">Roubo</option>
                                <option value="Iluminação">Iluminação</option>
                                <option value="Abrigo">Abrigo</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Nível de Risco:</label>
                            <select class="danger-level">
                                <option value="alto-risco">Alto Risco</option>
                                <option value="cuidado">Cuidado</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Descrição:</label>
                            <textarea class="danger-description" placeholder="Ex: Homem de camisa vermelha assediando mulheres"></textarea>
                        </div>
                        <button type="submit">Enviar</button>
                    `;
                    
                    const popup = L.popup()
                        .setLatLng([lat, lon])
                        .setContent(form)
                        .openOn(map);

                    form.addEventListener('submit', function(event) {
                        event.preventDefault();
                        const occurrenceType = form.querySelector('.occurrence-type').value;
                        const dangerLevel = form.querySelector('.danger-level').value;
                        const description = form.querySelector('.danger-description').value;

                        const colors = {
                            'alto-risco': '#e74c3c',
                            'cuidado': '#f39c12',
                            'seguro': '#2ecc71'
                        };

                        const marker = L.marker([lat, lon], {
                            icon: L.divIcon({
                                className: 'custom-marker',
                                html: `<div style="background: ${colors[dangerLevel]}; 
                                       width: 24px; 
                                       height: 24px; 
                                       border-radius: 50%; 
                                       border: 3px solid white;
                                       box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
                                iconSize: [24, 24]
                            })
                        }).addTo(map)
                        .bindPopup(`
                            <div class="custom-popup">
                                <h4 style="color: ${colors[dangerLevel]}">${occurrenceType.toUpperCase()}</h4>
                                <p><strong>Local:</strong> ${address}</p>
                                <p><strong>Nível:</strong> ${dangerLevel.replace('-', ' ')}</p>
                                <div class="popup-content">${description || 'Sem descrição adicional'}</div>
                                <div class="popup-footer">${new Date().toLocaleString()}</div>
                            </div>
                        `);

                        map.closePopup();
                        saveReport(lat, lon, occurrenceType, dangerLevel, description);
                    });

                } else {
                    alert("Endereço não encontrado!");
                }
            })
            .catch(() => alert("Erro ao buscar endereço. Tente novamente."));
    });


    const emergencyBtn = document.getElementById('emergency-btn');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', function() {
            if (confirm('Você está em perigo? Podemos alertar seus contatos de confiança.')) {
                alert('Mensagem de emergência enviada para seus contatos com sua localização.');

            }
        });
    }

    const policeBtn = document.getElementById('police-btn');
    if (policeBtn) {
        policeBtn.addEventListener('click', function() {
            if (confirm('Ligar para a Polícia Militar (190)?')) {
                alert('Redirecionando para chamada de emergência...');
                window.location.href = 'tel:190'; 
            }
        });
    }

    const shelterBtn = document.getElementById('shelter-btn');
    if (shelterBtn) {
        shelterBtn.addEventListener('click', function() {
            window.location.href = 'abrigos.html';
        });
    } 
    

    
    const style = document.createElement('style');
    style.textContent = `
        .map-marker {
            position: absolute;
            width: 20px;
            height: 20px;
            background-color: #e74c3c;
            border-radius: 50%;
            border: 2px solid white;
            cursor: pointer;
            z-index: 10;
            animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        .custom-marker {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .temp-marker {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    `;
    document.head.appendChild(style);

    const map = L.map('mapid').setView([-8.0476, -34.8770], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.popup()
    .setLatLng(map.getCenter())
    .setContent(`<div style="text-align:center;">
        <h3>Como usar o mapa:</h3>
        <p><strong>Clique em qualquer lugar</strong> para marcar um local perigoso</p>
        <p><strong></strong>Use a busca em cima do mapa para encontrar endereços</p>
    </div>`)
    .openOn(map);
    setTimeout(() => map.closePopup(), 16000);


    L.marker([-8.0489691,-34.942389], {
    icon: L.divIcon({
        className: 'custom-marker',
        html: '<div style="background: #2ecc71; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white;"></div>',
        iconSize: [24, 24]
    })
    }).addTo(map)
    .bindPopup("<b>Abrigo casa de isabel</b><br>Atende meninas e mulheres em situação de vulnerabilidade")

    
    L.marker([-8.063549,-34.8904319], {
    icon: L.divIcon({
        className: 'custom-marker',
        html: '<div style="background: #2ecc71; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white;"></div>',
        iconSize: [24, 24]
    })
    }).addTo(map)
    .bindPopup("<b>Abrigo casa menina mulher</b><br>Atende meninas e mulheres em situação de vulnerabilidade")
   

    L.marker([-8.0924377,-34.9321112], {
    icon: L.divIcon({
        className: 'custom-marker',
        html: '<div style="background: #2ecc71; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white;"></div>',
        iconSize: [24, 24]
    })
    }).addTo(map)
    .bindPopup("<b>SER- Centro de Referência Clarice Lispector</b><br>Atende meninas e mulheres em situação de vulnerabilidade")


    map.on('click', function(e) {
        const form = document.createElement('form');
        form.innerHTML = `
            <h3>Reportar Perigo</h3>
            <div class="form-group">
                <label>Tipo de Ocorrência:</label>
                <select class="occurrence-type">
                    <option value="Assédio">Assédio</option>
                    <option value="Roubo">Roubo</option>
                    <option value="Iluminação">Iluminação</option>
                    <option value="Abrigo">Abrigo</option>
                    <option value="Outro">Outro</option>
                </select>
            </div>
            <div class="form-group">
                <label>Nível de Risco:</label>
                <select class="danger-level">
                    <option value="alto-risco">Alto Risco</option>
                    <option value="cuidado">Cuidado</option>
                </select>
            </div>
            <div class="form-group">
                <label>Descrição:</label>
                <textarea class="danger-description" placeholder="Ex: Homem de camisa vermelha assediando mulheres"></textarea>
            </div>
            <button type="submit">Enviar</button>
        `;
        
        const popup = L.popup()
            .setLatLng(e.latlng)
            .setContent(form)
            .openOn(map);
        
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const occurrenceType = form.querySelector('.occurrence-type').value;
            const dangerLevel = form.querySelector('.danger-level').value;
            const description = form.querySelector('.danger-description').value;

            const colors = {
                'alto-risco': '#e74c3c',
                'cuidado': '#f39c12',
                'seguro': '#2ecc71'
            };

            const marker = L.marker([e.latlng.lat, e.latlng.lng], {
                icon: L.divIcon({
                    className: 'custom-marker',
                    html: `<div style="background: ${colors[dangerLevel]}; 
                           width: 24px; 
                           height: 24px; 
                           border-radius: 50%; 
                           border: 3px solid white;
                           box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
                    iconSize: [24, 24]
                })
            }).addTo(map)
            .bindPopup(`
                <div class="custom-popup">
                    <h4 style="color: ${colors[dangerLevel]}">${occurrenceType.toUpperCase()}</h4>
                    <p><strong>Nível:</strong> ${dangerLevel.replace('-', ' ')}</p>
                    <div class="popup-content">${description || 'Sem descrição adicional'}</div>
                    <div class="popup-footer">${new Date().toLocaleString()}</div>
                </div>
            `);

            map.closePopup();
            saveReport(e.latlng.lat, e.latlng.lng, occurrenceType, dangerLevel, description);
        });
    });

    function saveReport(lat, lng, occurrenceType, dangerLevel, description) {
        console.log(`Marcador criado em ${lat}, ${lng} - Tipo: ${occurrenceType}, Nível: ${dangerLevel}, Descrição: ${description}`);
        
    }


});


document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');
    
    const responses = {
        "denúncia": "Você pode denunciar de três formas:<br>1. <strong>Ligue 180</strong> (Central da Mulher)<br>2. <strong>Registre um BO online</strong> no site da Polícia Civil<br>3. <strong>Procure uma DEAM</strong> (Delegacia da Mulher)",
        "abrigo": "Abrigos disponíveis:<br><br>1. <strong>Casa Abrigo Sigilosa</strong><br>- Contato via 180 ou 190<br><br>2. <strong>Casa da Mulher Pernambucana</strong><br>- Endereço: Rua Real da Torre, 299<br>- Telefone: (81) 3184-3450",
        "medida protetiva": "Para conseguir uma <strong>medida protetiva</strong>:<br>1. Registre um BO em qualquer delegacia<br>2. Solicite a medida ao delegado<br>3. Leve documentos (RG, comprovante de residência)<br><br><em>Em caso de descumprimento, ligue 190 imediatamente!</em>",
        "default": "Digite:<br><strong>'denúncia'</strong> - Para como denunciar<br><strong>'abrigo'</strong> - Lista de abrigos seguros<br><strong>'medida protetiva'</strong> - Informações sobre medidas protetivas"
    };

    chatbotToggle?.addEventListener('click', () => {
        chatbotContainer.style.display = chatbotContainer.style.display === 'flex' ? 'none' : 'flex';
        if (chatbotContainer.style.display === 'flex') {
            addBotMessage("Olá! Sou a assistente do Salve Maria. Como posso ajudar? Digite as palavras chaves 'abrigo', 'medida protetiva' e 'denúncia'");
        }
    });

    chatbotClose?.addEventListener('click', () => {
        chatbotContainer.style.display = 'none';
    });

    chatbotInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && chatbotInput.value.trim() !== '') {
            const userText = chatbotInput.value.toLowerCase();
            addUserMessage(userText);
            chatbotInput.value = '';
            
            setTimeout(() => {
                let reply = responses.default;
                if (userText.includes('denúncia') || userText.includes('denuncia')) reply = responses["denúncia"];
                if (userText.includes('abrigo')) reply = responses["abrigo"];
                if (userText.includes('medida')) reply = responses["medida protetiva"];
                
                addBotMessage(reply);
            }, 500);
        }
    });

    function addUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'user-message';
        msgDiv.textContent = text;
        chatbotMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function addBotMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'bot-message';
        msgDiv.innerHTML = text.replace(/\n/g, '<br>');
        chatbotMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
});