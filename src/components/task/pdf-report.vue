<template>
  <v-card>
    <v-card-title class="green white--text" style="font-size: 20px; padding: 10px;">
      Gerar Relatório de Tarefas
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md >
        <v-layout wrap >

          <v-flex xs12 sm10 offset-sm1>
            <v-select class="input-group--focused" label="Responsável" autocomplete v-model="currentUser" :items="users" item-text="name" item-value="id"></v-select>
          </v-flex>

          <v-flex xs12 sm10 offset-sm1 class="green lighten-5">
            <v-date-picker v-model="month" light type="month" color="blue darken-2" full-width landscape locale="pt-br"></v-date-picker>
          </v-flex>

          <v-flex xs12 sm10 offset-sm1>
            <p class="text-xs-center red" v-show="tasksByMonth.length === 0">Nenhuma tarefa neste período.</p>
            <p class="text-xs-center green" v-show="tasksByMonth.length > 0">
              {{tasksByMonth.length === 1 ? `${tasksByMonth.length} Tarefa neste período` : `${tasksByMonth.length} Tarefas neste período`}}
            </p>
          </v-flex>

        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn round  class="blue" @click="PDFReport">
        Gerar PDF
      </v-btn>
      <v-btn round  class="red lighten-2" @click="$emit('close')">
        Cancelar
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import PDFGenerator from '@/utils/PDFGenerator'

export default {
  props: ['user'],
  name: 'pdf-report',
  data () {
    return {
      currentUser: this.user,
      month: new Date().toLocaleDateString().split('/').slice(1).reverse().join('-'),
      error: false,
      tasks: [],
      tasksByMonth: []
    }
  },
  methods: {
    PDFReport () {
      const name = this.users.find(user => user.id === this.currentUser).name
      PDFGenerator(this.tasksByMonth, name, this.month)
    }
  },
  computed: {
    ...mapGetters({
      users: 'getUsers'
    })
  },
  watch: {
    user (value) {
      this.currentUser = value
    },
    async currentUser (value) {
      const tasks = await axios.get(`task-list/filter/responsible/eq/${value}/`)
      this.tasks = tasks.data
      this.tasksByMonth = tasks.data.filter(task => task.started && task.started.includes(this.month))
    },
    month (value) {
      this.tasksByMonth = this.tasks.filter(task => task.started && task.started.includes(value))
    }
  },
  async mounted () {
    const tasks = await axios.get(`task-list/filter/responsible/eq/${this.currentUser}/`)
    this.tasks = tasks.data
    this.tasksByMonth = tasks.data.filter(task => task.started && task.started.includes(this.month))
  }
}
</script>
<style scoped>
  .title {
    font-family: 'Architects Daughter';
    font-size: 3em !important;
    color: #00b2cc;
  }
</style>
