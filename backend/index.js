
const express = require('express');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

const TarefaService = require('./services/TarefaService');
dotenv.config();


const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_ANON_KEY
);
const tarefaService = new TarefaService(supabase);

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
const cors = require('cors'); 
app.use(cors()); 



app.get('/tarefas', async (req, res) => {
    
    const { data: tarefas, error } = await supabase
        .from('tarefas')
        .select(`
            *,
            projetos ( nome )
        `); 

    if (error) {
        console.error('Erro ao buscar tarefas:', error);
        return res.status(500).json({ error: error.message });
    }

    
    res.status(200).json(tarefas);
});

app.post('/tarefas', async (req, res) => {
    try {
        
        const novaTarefa = await tarefaService.criar(req.body); 
        res.status(201).json(novaTarefa); 
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.put('/tarefas/:id', async (req, res) => {
    try {
       
        const id = req.params.id;
        const tarefaAtualizada = await tarefaService.atualizar(id, req.body);
        res.status(200).json(tarefaAtualizada);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.delete('/tarefas/:id', async (req, res) => {
    try {
       
        const id = req.params.id;
        const resultado = await tarefaService.deletar(id);
       
        res.status(200).json(resultado); 
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Teste GET: http://localhost:${PORT}/tarefas`);
});