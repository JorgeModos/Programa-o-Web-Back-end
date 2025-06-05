const Produto = require('./src/classes/Produto');
const Categoria = require('./src/classes/Categoria');
const Cliente = require('./src/classes/Cliente');
const { fechar } = require('./src/config/mongo-config');

(async () => {
  try {
    console.log('\n--- INSERINDO DADOS ---');

    // Inserir categorias
    await Categoria.inserir({ nome: 'Eletrônicos', descricao: 'Dispositivos eletrônicos' });
    await Categoria.inserir({ nome: 'Livros', descricao: 'Livros diversos' });

    // Listar categorias para obter o ID
    const categorias = await Categoria.listarTodas();
    const catEletronicos = categorias.find(c => c.nome === 'Eletrônicos');
    const catLivros = categorias.find(c => c.nome === 'Livros');

    // Inserir clientes
    await Cliente.inserir({ nome: 'João Silva', email: 'joao@gmail.com', endereco: 'Rua A, 123' });
    await Cliente.inserir({ nome: 'Maria Souza', email: 'maria@gmail.com', endereco: 'Av. B, 456' });

    // Inserir produtos
    await Produto.inserir({ nome: 'Smartphone', preco: 1200.0, categoria: catEletronicos._id });
    await Produto.inserir({ nome: 'Notebook Gamer', preco: 4500.0, categoria: catEletronicos._id });
    await Produto.inserir({ nome: 'Livro JavaScript', preco: 80.0, categoria: catLivros._id });

    console.log('\n--- BUSCANDO DADOS ---');

    // Buscar produtos por nome
    const produtosSmart = await Produto.buscarPorNome('note');
    console.log('Produtos com "note":', produtosSmart);

    const produtosLivro = await Produto.buscarPorNome('livro');
    console.log('Produtos com "livro":', produtosLivro);

    // Buscar cliente por email
    const clienteJoao = await Cliente.buscarPorEmail('joao@gmail.com');
    console.log('Cliente encontrado:', clienteJoao);

    // Listar todas as categorias
    const todasCategorias = await Categoria.listarTodas();
    console.log('Categorias cadastradas:', todasCategorias);

    console.log('\n--- DELETANDO DADOS (EXEMPLO) ---');

    // Deletar um produto específico
    if (produtosSmart.length > 0) {
      await Produto.deletarPorId(produtosSmart[0]._id);
      console.log(`Produto deletado (id: ${produtosSmart[0]._id})`);
    }

  } catch (erro) {
    console.error('Erro geral no script:', erro.message);
  } finally {
    await fechar();
    console.log('\nConexão com MongoDB encerrada.');
  }
})();
