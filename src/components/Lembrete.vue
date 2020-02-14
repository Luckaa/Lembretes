<template>
  <div>


     <!-- Formulario normal--> 
    <v-dialog v-model="mostrarForm" width="400" > 
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Adicionar lembrete
        </v-card-title>
          <v-form ref="form"  v-if="mostrarForm" v-model="valid" enctype="multipart/form-data"  persistent lazy-validation style="padding:10px">
           <v-select
      v-model="lembrete.livroHeader"
      :items="listaFinal"
      label="Livros"
    ></v-select>

     <v-autocomplete
            v-model="lembrete.horaDia"
            :items="diasSemana"
            label="Dia da Semana"
            placeholder="Selecione um dia"
      ></v-autocomplete>

          <v-autocomplete
            v-model="lembrete.diaSemana"
            :items="horasdoDia"
            label="Hora para Lembrete"
            placeholder="Selecione uma hora"
          ></v-autocomplete>



          <v-btn @click="submit">Salvar</v-btn>
          <v-btn @click="clear">Cancelar</v-btn>
        </v-form>
      </v-card>
    </v-dialog>
   <!-- Formulario -->


    <v-data-table  :headers="headers" :items="lembretes" hide-actions  :loading="true" light class="elevation-1">
      <template slot="items" slot-scope="props">
        <td  class="text-xs-left"> {{ props.item.livroHeader }}</td>
        <td  class="text-xs-left"> {{ (props.item.diaSemana)}} </td>
        <td  class="text-xs-left"> {{ props.item.horaDia }}</td>

        <td>
          <v-flex>
            <v-btn flat icon color="blue" @click="editarLembrete(props.item)">
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
                  <v-card-title class="headline">Deseja mesmo excluir esse lembrete?</v-card-title>
                  <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-1" flat @click="exibirExcluir()">Não</v-btn>
                  <v-btn color="green darken-1" flat @click="deletarLembrete(props.item)">Sim</v-btn>
                  </v-card-actions>
              </v-card>
      </v-dialog>
      </template>
    </v-data-table>

    <div style="padding:1px">
      <v-btn  color="info" v-if="!mostrarForm" @click="exibirForm">Adicionar lembrete</v-btn>
    </div>
  </div>
</template>
<script>



var listaFinalx= []
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
    this.loadLivro();
  },
  methods: {
selectedFile(event) {
      this.file = this.$refs.file.files[0];
    },

    load() {
      API.getLembretes().then(lembretes => {
        this.lembretes = lembretes;
        console.log(lembretes); 

      });
      },
      loadLivro() {
      API.getLivros().then(livros => {
        this.livros = livros;
        console.log(livros); 
        for(let i = 0 ; i < livros.length; i++){
          listaFinalx.push(livros[i].nome)
        }
        console.log(listaFinalx)
      });
  
    },
  

    submit() {
    if (this.lembrete._id == null) {
    if (this.$refs.form.validate()) {

      let lembrete = this.lembrete
      let refresh = this.load
      let limpar = this.clear
        axios.post(API_URL + "lembretes", lembrete)
        .then(res => {
          console.log(res);
          console.log("sucesso");

            limpar();
            refresh();
        })
        .catch(err => {
          console.log(err);
        });  
        }
      } else {
        if (this.$refs.form.validate()) {
          API.editarLembretes(this.lembrete).then(response => {
            if (response) {
              console.log("lembrete editado com Sucesso!", "success");
            } else {
              console.log("Erro ao editar lembrete!", "error");
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
    deletarLembrete(lembrete) {
      console.log(lembrete);
      this.exibirExcluir();
      API.deletarLembretes(lembrete).then(response => {
        if (response) {
          console.log("lembrete removido com Sucesso!", "success");
          this.load();
        } else {
          console.log("Erro ao remover lembrete!", "error");
        }
      });
    },
    editarLembrete(lembrete) {
      this.lembrete = lembrete;
      this.mostrarForm = true;
    },
    onFileSelected(event) {
      console.log(event);
    }
  },
  data() {
    return {
      diasSemana: ['Segunda-Feira', 'Terça-Feira','Quarta-Feira','Quinta-Feira','Sexta-Feira','Sabado','Domingo'],
      horasdoDia: ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],
      lembrete:{},
      lembretes: [],
      listaFinal: listaFinalx,
      valid: true,
      dialog: false,
      mostrarForm: false,
      excluirMesmo: false,
      headers: [
        {
          text: "Livro",
          value: "livroHeader"
        },
        {
          text: "Dia da Semana",
          value: "diaSemana"
        },
            {
          text: "Hora do Dia",
          value: "horaDia"
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