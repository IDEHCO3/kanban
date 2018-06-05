<template>
  <v-card v-if="impediments">
    <v-card-title class="red lighten-2 white--text">
      <div>
        <div class="headline">{{ task.name }}</div>
        <span class="white--text subheading">Inicio: {{ task.started }} / Fim: {{ task.due || 'Não informado'}}</span>
      </div>
      <v-spacer></v-spacer>
      <v-btn icon @click="close" class="red lighten-1">
        <v-icon>close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-expansion-panel expand>
            <v-expansion-panel-content v-for="(impediment, index) in impediments" :key="index" :value="true" :class="impediment.resolution_date <= currentDate ? 'green darken-1 mb-1' : 'red darken-4 mb-1'">
              <div slot="header">{{ impediment.name }}</div>
              <v-card class="blue-grey darken-3">
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>

                      <v-flex xs12>
                        <v-text-field label="Nome" required v-model="impediment.name"></v-text-field>
                      </v-flex>

                      <v-flex xs12>
                        <v-text-field label="Descrição" required v-model="impediment.description"></v-text-field>
                      </v-flex>

                      <v-flex xs12 sm5 offset-sm1>
                          <v-text-field label="Data do impedimento" v-model="impediment.created_date" prepend-icon="event" readonly></v-text-field>
                          <v-date-picker  v-model="impediment.created_date" locale="pt-br" no-title style="transform: translateX(25%); border: 2px solid aliceblue; border-radius: 10px;"></v-date-picker>
                      </v-flex>

                      <v-flex xs12 sm5>
                        <v-text-field label="Data de Solução" v-model="impediment.resolution_date" prepend-icon="event" readonly></v-text-field>
                        <v-date-picker v-model="impediment.resolution_date" locale="pt-br" no-title style="transform: translateX(25%); border: 2px solid aliceblue; border-radius: 10px;"></v-date-picker>
                      </v-flex>

                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn round class="blue" @click="editImpediment(impediment)">
                    Salvar Alteração
                  </v-btn>
                  <v-btn round class="red lighten-2" @click="deleteImpediment(impediment)">
                    Deletar Impedimento
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios'

export default {
  name: 'impediments-modal',
  props: ['currentDate'],
  data () {
    return {
      task: {
        impediments: [],
        id: null,
        name: '',
        description: null,
        status: '',
        order: null,
        started: null,
        due: null,
        completed: null,
        sprint: null,
        responsible: null,
        typeContinuousActivity: null,
        project: null
      },
      impediments: [],
      menu_created: false,
      menu_resolution: false
    }
  },
  methods: {
    editImpediment (impediment) {
      axios.put(`impediment-list/${impediment.id}/`, impediment)
    },
    async deleteImpediment (impediment) {
      const impedimentIndex = this.impediments.indexOf(impediment)
      this.impediments.splice(impedimentIndex, 1)
      if (this.impediments.length === 0) {
        await axios.put(`task-list/${this.task.id}/`, {status: '2', responsible: this.task.responsible, project: this.task.project, sprint: this.task.sprint})
        this.$store.dispatch('GETTASKS')
        this.$emit('close')
      }
      await axios.delete(`impediment-list/${impediment.id}/`)
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
<style scoped>
</style>
