document.addEventListener('DOMContentLoaded', function() {
    // Interatividade do mapa
    const interactiveMap = document.getElementById('interactive-map');
    
    if (interactiveMap) {
        interactiveMap.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Cria um marcador no local clicado
            const marker = document.createElement('div');
            marker.className = 'map-marker';
            marker.style.left = (x - 10) + 'px';
            marker.style.top = (y - 10) + 'px';
            
            // Adiciona o marcador ao mapa
            this.parentNode.appendChild(marker);
            
            // Mostra modal para adicionar informações
            setTimeout(() => {
                const reportType = prompt('Que tipo de risco você quer reportar?\n1. Assédio\n2. Roubo\n3. Área escura');
                if (reportType) {
                    alert('Obrigada por contribuir com a segurança de todas! Seu relato foi registrado.');
                }
            }, 100);
        });
    }
    
    // Botão de emergência
    const emergencyBtn = document.getElementById('emergency-btn');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', function() {
            if (confirm('Você está em perigo? Podemos alertar seus contatos de confiança.')) {
                // Simular envio de alerta
                alert('Mensagem de emergência enviada para seus contatos com sua localização.');
            }
        });
    }
    
    // Botão para ligar para a polícia
    const policeBtn = document.getElementById('police-btn');
    if (policeBtn) {
        policeBtn.addEventListener('click', function() {
            if (confirm('Ligar para a Polícia Militar (190)?')) {
                // Simular chamada
                alert('Redirecionando para chamada de emergência...');
            }
        });
    }
    
    // Botão para abrigos
    const shelterBtn = document.getElementById('shelter-btn');
    if (shelterBtn) {
        shelterBtn.addEventListener('click', function() {
            alert('Abrigos próximos:\n\n1. Casa Abrigo Recife - (81) 9999-9999\n2. Lar da Mulher Pernambucana - (81) 8888-8888');
        });
    }
    
    // Adiciona estilo dinâmico para os marcadores
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
    `;
    document.head.appendChild(style);


    // Inicializa o mapa centralizado no Recife
    const map = L.map('mapid').setView([-8.0476, -34.8770], 13);

    // Adiciona mapa base (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Marcador clicável de exemplo (Praça do Diário)
    L.marker([-8.0640917, -34.8804661,1691])
        .addTo(map)
        .bindPopup("<b>Praça do Diário</b><br>Área com alto índice de assédio após as 18h")
        .openPopup();

    // Função para marcar locais perigosos
    
    map.on('click', function(e) {
    // Cria o formulário no popup
        const form = document.createElement('form');
        form.innerHTML = `
            <h3>Reportar Perigo</h3>
            <div class="form-group">
                <label>Tipo:</label>
                <select class="danger-type">
                    <option value="Assédio">Assédio</option>
                    <option value="Roubo">Roubo</option>
                    <option value="Iluminação">Iluminação</option>
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
        
        // Adiciona o evento de submit
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const tipo = form.querySelector('.danger-type').value;
            const descricao = form.querySelector('.danger-description').value;
            
            // Cria o marcador como o da Praça do Diário
            L.marker([e.latlng.lat, e.latlng.lng])
                .addTo(map)
                .bindPopup(`
                    <div class="custom-popup">
                        <h4>${tipo}</h4>
                        <div class="popup-content">${descricao || 'Sem descrição adicional'}</div>
                        <div class="popup-footer">${new Date().toLocaleString()}</div>
                    </div>
                `);
            
            map.closePopup();
        });
    });

    function saveReport(lat, lng, tipo) {
        // Cria um marcador no mapa
        const marker = L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`<b>${tipo}</b><br>Reportado em ${new Date().toLocaleTimeString()}`);
        
        // Adiciona ao array de marcadores temporários (se necessário)
        
        
        console.log(`Marcador criado em ${lat}, ${lng} - Tipo: ${tipo}`);
    }

    
});

// CHATBOT 
document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');
    
    // Respostas pré-definidas
    const responses = {
        "denúncia":  "\n Você pode denunciar:\n• Pelo 180 (Central da Mulher)\n• No app Salve Maria Recife\n• Em qualquer DEAM (Delegacia da Mulher) \n",
        "abrigo": "\n Abrigos na RMR:\n\n1. Casa da Mulher Pernambucana\nEndereço: Rua Real da Torre, 299\nTelefone: (81) 3184-3450\n\n2. Casa Abrigo Sigilosa\n(Contato via 180 ou polícia) \n",
        "medida": `
        MEDIDAS PROTETIVAS - INFORMAÇÕES ESSENCIAIS

        O que são:
        Ordens judiciais que determinam:
        - Afastamento do agressor (no mínimo 200 metros)
        - Proibição de contato por qualquer meio
        - Suspensão da posse de armas

        Como obter:
        1. Registre um Boletim de Ocorrência em qualquer delegacia
        2. Solicite expressamente a medida protetiva
        3. Apresente documentos e evidências:
           * RG e CPF
           * Relatos detalhados dos fatos
           * Provas como mensagens ou fotos

        Prazos:
        - Concessão em até 48 horas
        - Validade inicial de 6 meses (prorrogável)

        O que fazer se descumprida:
        1. Ligue imediatamente para a Polícia Militar (190)
        2. Registre novo BO relatando o descumprimento
        3. Procure a Defensoria Pública se precisar de assistência jurídica

        Contatos úteis em Recife:
        - DEAM Central: (81) 3182-7600
        - Defensoria Pública: (81) 3182-8400
        - Plantão Judiciário: (81) 3182-8500
    `,
        "default": "\n Digite:\n• 'denúncia'\n• 'abrigo'\n• 'medida'\n\nPara informações específicas\n"
    };

    // Mostrar/ocultar chatbot
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.style.display = chatbotContainer.style.display === 'flex' ? 'none' : 'flex';
        if (chatbotContainer.style.display === 'flex') {
            addBotMessage("Olá! Sou a assistente do Salve Maria Recife. Como posso ajudar?");
        }
    });

    // Fechar chatbot
    chatbotClose.addEventListener('click', () => {
        chatbotContainer.style.display = 'none';
    });

    // Processar mensagens
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && chatbotInput.value.trim() !== '') {
            const userText = chatbotInput.value.toLowerCase();
            addUserMessage(userText);
            chatbotInput.value = '';
            
            setTimeout(() => {
                let reply = responses.default;
                if (userText.includes('denúncia')) reply = responses["denúncia"];
                if (userText.includes('denuncia')) reply = responses["denúncia"];
                if (userText.includes('abrigo')) reply = responses["abrigo"];
                if (userText.includes('medida')) reply = responses["medida"];
                
                addBotMessage(reply);
            }, 500);
        }
    });

    // Funções auxiliares
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
        msgDiv.innerHTML = text.replace(/\n/g, '<br>'); // Transforma quebras de linha
        chatbotMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
});