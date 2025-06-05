const fs = require('fs');
const path = require('path');
const { conectar } = require('../config/mongo-config');

class Cliente {
  static async inserir(cliente) {
    try {
      if (!cliente.nome || !cliente.email) throw new Error('Campos obrigatórios ausentes (nome, email)');
      const db = await conectar();
      return await db.collection('clientes').insertOne(cliente);
    } catch (erro) {
      Cliente.gravarLog(`[Cliente.inserir] ${erro.message}`);
      return null;
    }
  }

  static async buscarPorEmail(email) {
    try {
      const db = await conectar();
      return await db.collection('clientes').findOne({ email });
    } catch (erro) {
      Cliente.gravarLog(`[Cliente.buscarPorEmail] ${erro.message}`);
      return null;
    }
  }

  static async deletarPorId(id) {
    try {
      const db = await conectar();
      const { ObjectId } = require('mongodb');
      const resultado = await db.collection('clientes').deleteOne({ _id: new ObjectId(id) });
      return resultado.deletedCount;
    } catch (erro) {
      Cliente.gravarLog(`[Cliente.deletarPorId] ${erro.message}`);
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

module.exports = Cliente;
