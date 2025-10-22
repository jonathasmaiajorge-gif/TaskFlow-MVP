
// backend/services/TarefaService.js

class TarefaService {
    // Defesa POO: Encapsulamento. A conexão Supabase é privada aqui.
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
        this.TABLE_NAME = 'tarefas'; 
    }

    // CREATE
    // Defesa POO: Abstração. O controlador só chama 'criar'.
    async criar(dadosTarefa) {
        const { data, error } = await this.supabase
            .from(this.TABLE_NAME)
            .insert(dadosTarefa)
            .select();
        
        if (error) throw new Error(`Erro ao criar tarefa: ${error.message}`);
        return data;
    }
    
    // READ
    async buscarTodas() {
        const { data, error } = await this.supabase
            .from(this.TABLE_NAME)
            .select('*, projetos(nome)'); 

        if (error) throw new Error(`Erro ao buscar tarefas: ${error.message}`);
        return data;
    }

    // UPDATE
    async atualizar(id, dadosAtualizacao) {
        const { data, error } = await this.supabase
            .from(this.TABLE_NAME)
            .update(dadosAtualizacao)
            .eq('id', id)
            .select();
        
        if (error) throw new Error(`Erro ao atualizar tarefa: ${error.message}`);
        return data;
    }

    // DELETE
    async deletar(id) {
        const { error } = await this.supabase
            .from(this.TABLE_NAME)
            .delete()
            .eq('id', id);
        
        if (error) throw new Error(`Erro ao deletar tarefa: ${error.message}`);
        return { success: true, message: 'Tarefa excluída com sucesso.' };
    }
}

module.exports = TarefaService;