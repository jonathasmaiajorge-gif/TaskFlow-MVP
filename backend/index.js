
const express = require('express');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');


dotenv.config();


const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_ANON_KEY
);

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



app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Teste GET: http://localhost:${PORT}/tarefas`);
});