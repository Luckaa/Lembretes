<template>
  <div>


     <!-- Formulario normal--> 
    <v-dialog v-model="mostrarForm" width="400" > 
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Adicionar Livro
        </v-card-title>
          <v-form ref="form"  v-if="mostrarForm" v-model="valid" enctype="multipart/form-data"  persistent lazy-validation style="padding:10px">
          <v-text>Escolha uma Imagem:</v-text> <input name ="Escolha uma imagem" type="file" ref="file" @change="selectedFile" > 
          <v-text-field v-model="livro.nome" label="Nome" required></v-text-field>
          <v-text-field type=number  v-model="livro.paginas" label="Paginas" required></v-text-field>


          <v-btn @click="submit">Salvar</v-btn>
          <v-btn @click="clear">Cancelar</v-btn>
        </v-form>
      </v-card>
    </v-dialog>
   <!-- Formulario -->


    <v-data-table  :headers="headers" :items="livros" hide-actions  :loading="true" light class="elevation-1">
      <template slot="items" slot-scope="props">
        <td  class="text-xs-left"> {{ (props.item.nome)}} </td>
        <td  class="text-xs-left"> {{ props.item.paginas }}</td>
        <td  class="text-xs-left"><img style="width:100px;height:100px;overflow:hidden" :src="props.item.foto"></td>

        <td>
          <v-flex>
            <v-btn flat icon color="blue" @click="editarLivro(props.item)">
              <v-icon>edit</v-icon>
            </v-btn>
          </v-flex>
            <v-flex>
            <v-btn flat icon color="red" v-if="!excluirMesmo" @click="exibirExcluir">
              <v-icon v-model="excluirMesmo">delete</v-icon>
            </v-btn>
          </v-flex>
        </td>

          <v-dialog  persistent v-model="excluirMesmo" width="300"  > 
              <v-card>
                  <v-card-title class="headline">Deseja mesmo excluir esse livro?</v-card-title>
                  <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-1" flat @click="exibirExcluir()">Não</v-btn>
                  <v-btn color="green darken-1" flat @click="deletarLivro(props.item)">Sim</v-btn>
                  </v-card-actions>
              </v-card>
      </v-dialog>
      </template>
    </v-data-table>

    <div style="padding:1px">
      <v-btn  color="info" v-if="!mostrarForm" @click="exibirForm">Adicionar Livro</v-btn>
    </div>
  </div>
</template>
<script>
var noBase = "5beb834cef6707115022278b";
var b64 = btoa(noBase);
console.log(noBase);
console.log(b64);
const API_URL = "http://localhost:3000/";

import axios from "axios";
import API from "../lib/API";

  

export default {
  mounted() {
    this.load();
  },
  methods: {
selectedFile(event) {
      this.file = this.$refs.file.files[0];
    },

    load() {
      API.getLivros().then(livros => {
        this.livros = livros;
        console.log(livros); 
      });

    },
        submit() {
          
      if (this.livro._id == null) {
        if (this.$refs.form.validate()) {

      var reader = new FileReader();
      reader.readAsDataURL(this.file);
      let livro = this.livro
      let refresh = this.load
      let limpar = this.clear
      reader.onload = function() {
        console.log(reader.result);
        livro.foto = reader.result;
        axios.post(API_URL + "livros", livro)
        .then(res => {
          console.log(res);
          console.log("sucesso");
            limpar();
            refresh();
        })
        .catch(err => {
          console.log(err);
        });
      };
      reader.onerror = function(error) {
        console.log("Error: ", error);
      }
        }
      } else {
        if (this.$refs.form.validate()) {
          API.editarLivros(this.livro).then(response => {
            if (response) {
              console.log("livro editado com Sucesso!", "success");
            } else {
              console.log("Erro ao editar livro!", "error");
            }
            this.clear();
            this.load();
          });
        }
      }
    },
    
    clear() {
      this.$refs.form.reset();
      this.exibirForm();
    },
    exibirForm() {
      this.mostrarForm = !this.mostrarForm;
    },
    exibirExcluir() {
      this.excluirMesmo = !this.excluirMesmo;
    },
    deletarLivro(livro) {
      console.log(livro);
      this.exibirExcluir();
      API.deletarLivros(livro).then(response => {
        if (response) {
          console.log("livro removido com Sucesso!", "success");
          this.load();
        } else {
          console.log("Erro ao remover livro!", "error");
        }
      });
    },
    editarLivro(livro) {
      this.livro = livro;
      this.mostrarForm = true;
    },
    onFileSelected(event) {
      console.log(event);
    }
  },
  data() {
    return {
      livro:{},
      livros: [],
      valid: true,
      dialog: false,
      mostrarForm: false,
      excluirMesmo: false,
      headers: [
        {
          text: "Nome",
          value: "nome"
        },
        {
          text: "Páginas",
          value: "paginas"
        },
            {
          text: "Foto",
          value: "foto"
        },
        {
          text: "Ações",
          value: ""
        }
      ],
      nomeRules: [
        v => !!v || "Nome é Obrigatório!",
        v =>
          (v && v.length <= 5000) || "Nome deve ter no máximo 1000 characters!"
      ]
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>