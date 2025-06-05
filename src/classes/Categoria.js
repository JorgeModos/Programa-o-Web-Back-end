const fs = require('fs');
const path = require('path');
const { conectar } = require('../config/mongo-config');

class Categoria {
  static async inserir(categoria) {
    try {
      if (!categoria.nome) throw new Error('Campo "nome" é obrigatório');
      const db = await conectar();
      return await db.collection('categorias').insertOne(categoria);
    } catch (erro) {
      Categoria.gravarLog(`[Categoria.inserir] ${erro.message}`);
      return null;
    }
  }

  static async listarTodas() {
    try {
      const db = await conectar();
      return await db.collection('categorias').find().toArray();
    } catch (erro) {
      Categoria.gravarLog(`[Categoria.listarTodas] ${erro.message}`);
      return null;
    }
  }

  static async deletarPorId(id) {
    try {
      const db = await conectar();
      const { ObjectId } = require('mongodb');
      const resultado = await db.collection('categorias').deleteOne({ _id: new ObjectId(id) });
      return resultado.deletedCount;
    } catch (erro) {
      Categoria.gravarLog(`[Categoria.deletarPorId] ${erro.message}`);
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

module.exports = Categoria;
