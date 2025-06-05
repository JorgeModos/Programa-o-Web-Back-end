const fs = require('fs');
const path = require('path');
const { conectar } = require('../config/mongo-config');
const { ObjectId } = require('mongodb');

class Produto {
  static async inserir(produto) {
    try {
      if (!produto.nome || !produto.preco || !produto.categoria) {
        throw new Error('Campos obrigatórios ausentes (nome, preco, categoria)');
      }
      if (!(produto.categoria instanceof ObjectId)) {
        produto.categoria = new ObjectId(produto.categoria);
      }

      const db = await conectar();
      const res = await db.collection('produtos').insertOne(produto);
      return res.insertedId;
    } catch (erro) {
      Produto.gravarLog(`[Produto.inserir] ${erro.message}`);
      return null;
    }
  }

  static async buscarPorNome(nome) {
    try {
      const db = await conectar();
      return await db.collection('produtos').find({ nome: { $regex: nome, $options: 'i' } }).toArray();
    } catch (erro) {
      Produto.gravarLog(`[Produto.buscarPorNome] ${erro.message}`);
      return null;
    }
  }

  static async deletarPorId(id) {
    try {
      const db = await conectar();
      const resultado = await db.collection('produtos').deleteOne({ _id: new ObjectId(id) });
      return resultado.deletedCount;
    } catch (erro) {
      Produto.gravarLog(`[Produto.deletarPorId] ${erro.message}`);
      return null;
    }
  }

  static gravarLog(mensagem) {
    try {
      const dir = path.resolve('./logs');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      const caminhoArquivo = path.join(dir, 'erros.log');
      const texto = `${new Date().toISOString()} - ${mensagem}\n`;
      fs.appendFileSync(caminhoArquivo, texto);
    } catch (err) {
      console.error('Erro ao gravar log:', err.message);
    }
  }
}

module.exports = Produto;
