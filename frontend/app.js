// frontend/app.js
const API_URL = 'http://localhost:3000/tarefas';

// --- READ (Busca e Exibe) ---

async function fetchTarefas() {
    try {
        const response = await fetch(API_URL);
        const tarefas = await response.json();
        renderizarTarefas(tarefas);
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        document.getElementById('lista-tarefas').innerHTML = 
            '<p>Erro ao carregar tarefas. Verifique se o Backend está rodando (porta 3000).</p>';
    }
}

function renderizarTarefas(tarefas) {
    const listaDiv = document.getElementById('lista-tarefas');
    listaDiv.innerHTML = ''; 

    if (tarefas.length === 0) {
        listaDiv.innerHTML = '<p>Nenhuma tarefa encontrada. Crie uma nova!</p>';
        return;
    }

    tarefas.forEach(tarefa => {
        // Criar um elemento simples para cada tarefa
        const card = document.createElement('div');
        card.className = `tarefa-card status-${tarefa.status.replace(/\s/g, '')}`;
        card.innerHTML = `
            <h4>${tarefa.titulo} (${tarefa.projetos && tarefa.projetos.nome ? tarefa.projetos.nome : 'Sem Projeto'})</h4>
            <p>Prioridade: ${tarefa.prioridade} | Status: ${tarefa.status}</p>
            <p>${tarefa.descricao}</p>
            <button onclick="prepararEdicao(${tarefa.id}, '${tarefa.titulo}', '${tarefa.descricao}', '${tarefa.prioridade}', '${tarefa.status}', ${tarefa.projeto_id})">Editar</button>
            <button onclick="deletarTarefa(${tarefa.id})" class="delete-btn">Excluir</button>
            ${tarefa.status !== 'Concluído' ? 
                `<button onclick="mudarStatus(${tarefa.id}, 'Concluído')">Marcar como Concluído</button>` : ''}
        `;
        listaDiv.appendChild(card);
    });
}


// --- DELETE (Excluir) e UPDATE Rápido ---

async function deletarTarefa(id) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Tarefa excluída com sucesso!');
                fetchTarefas(); // Recarrega a lista
            } else {
                throw new Error('Falha ao excluir.');
            }
        } catch (error) {
            console.error('Erro ao deletar:', error);
            alert('Erro ao deletar tarefa. Tente novamente.');
        }
    }
}

async function mudarStatus(id, novoStatus) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: novoStatus })
        });

        if (response.ok) {
            fetchTarefas(); // Recarrega a lista
        } else {
            throw new Error('Falha ao atualizar status.');
        }
    } catch (error) {
        console.error('Erro ao mudar status:', error);
        alert('Erro ao atualizar status.');
    }
}


// --- CREATE/UPDATE (Salvar com Form) ---

document.getElementById('form-tarefa').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const id = document.getElementById('tarefa-id').value;
    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    // Criar o objeto de dados a partir do formulário
    const dados = {
        titulo: document.getElementById('titulo').value,
        descricao: document.getElementById('descricao').value,
        prioridade: document.getElementById('prioridade').value,
        // Simplificando: Novo item é sempre 'A Fazer' e 'projeto_id' é fixo para o primeiro projeto criado (ID 1)
        status: id ? document.getElementById('status').value : 'A Fazer', 
        projeto_id: 1 
    };

    try {
        const response = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            alert('Tarefa salva com sucesso!');
            document.getElementById('modal-tarefa').style.display = 'none';
            fetchTarefas(); // Recarrega a lista
        } else {
            throw new Error('Falha ao salvar a tarefa.');
        }
    } catch (error) {
        console.error('Erro ao salvar:', error);
        alert('Erro ao salvar tarefa. Verifique o console.');
    }
});


// --- Funções de UI do Modal ---

function prepararEdicao(id, titulo, descricao, prioridade, status, projetoId) {
    // Preenche o formulário para edição
    document.getElementById('tarefa-id').value = id;
    document.getElementById('titulo').value = titulo;
    document.getElementById('descricao').value = descricao;
    document.getElementById('prioridade').value = prioridade;
    // Para simplificar, o status só é alterado com o botão rápido ou pelo PUT, mas a prioridade deve ser carregada.
    
    document.getElementById('modal-tarefa').style.display = 'block';
}

// Eventos de abrir/fechar o modal
document.getElementById('abrir-modal-nova-tarefa').addEventListener('click', () => {
    // Limpa o formulário para nova tarefa
    document.getElementById('form-tarefa').reset(); 
    document.getElementById('tarefa-id').value = '';
    document.getElementById('modal-tarefa').style.display = 'block';
});
document.getElementById('fechar-modal').addEventListener('click', () => {
    document.getElementById('modal-tarefa').style.display = 'none';
});


// Inicializa a aplicação
fetchTarefas();