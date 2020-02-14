const API_URL = "http://localhost:3000/";
import axios from 'axios';

export default {

  //Livros

  getLivros() {
    return fetch(API_URL + "livros")
      .then(response => response.json(0))
  },

  deletarLivros(livro) {

    return axios.delete(API_URL + "livros", {
        data: livro
      })
      .then(response => response.data)
  },

  adicionarLivros(livro) {
    return axios.post(API_URL + "livros", livro)
      .then(response => response.data)
  },

  editarLivros(livro) {
    return axios.put(API_URL + "livros", livro)
      .then(response => response.data)
  },



  //Lembrete
  getLembretes() {
    return fetch(API_URL + "lembretes")
      .then(response => response.json(0))
  },

  deletarLembretes(lembrete) {
    return axios.delete(API_URL + "lembretes", {
        data: lembrete
      })
      .then(response => response.data)
  },

  adicionarLembretes(lembrete) {
    return axios.post(API_URL + "lembretes", lembrete)
      .then(response => response.data)
  },
  editarLembretes(lembrete) {
    return axios.put(API_URL + "lembretes", lembrete)
      .then(response => response.data)
  },
}
