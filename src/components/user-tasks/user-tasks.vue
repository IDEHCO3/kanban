<template>
  <v-layout row wrap >
    <v-flex xs12>
      <v-expansion-panel popout>
        <v-expansion-panel-content v-for="(user,i) in users" :key="i">
          <div slot="header">{{ user.name.toUpperCase() }}</div>
            <v-tabs centered color="cyan" slider-color="yellow" v-model="model">
              <v-tab v-for="month in months" :key="month.name" :href="`#tab-${month.name}`" >
                {{ month.name }}
              </v-tab>
            </v-tabs>
          <v-tabs-items v-model="model">
            <v-tab-item  v-for="month in months" :key="month.name" :id="`tab-${month.name}`">
              <v-card flat>
                <v-layout row wrap xs12 v-if="tasks">

                  <month-tasks tabColor="yellow darken-2" name="A fazer" :tasks="filterTasks(user.id, month.monthNumber, '1')"/>

                  <month-tasks tabColor="blue" name="Fazendo" :tasks="filterTasks(user.id, month.monthNumber, '2')"/>

                  <month-tasks tabColor="green" name="Feito" :tasks="filterTasks(user.id, month.monthNumber, '4')"/>

                  <month-tasks tabColor="red" name="Pendente" :tasks="filterTasks(user.id, month.monthNumber, '3')"/>

                </v-layout>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { idFromUrl } from '@/utils/utils'
import MonthTasks from './month-tasks'
export default {
  name: 'usuarios',
  components: { MonthTasks },
  data () {
    return {
      model: 'tab-JAN',
      months: [
        { name: 'JAN', monthNumber: '01' },
        { name: 'FEV', monthNumber: '02' },
        { name: 'MAR', monthNumber: '03' },
        { name: 'ABR', monthNumber: '04' },
        { name: 'MAI', monthNumber: '05' },
        { name: 'JUN', monthNumber: '06' },
        { name: 'JUL', monthNumber: '07' },
        { name: 'AGO', monthNumber: '08' },
        { name: 'SET', monthNumber: '09' },
        { name: 'OUT', monthNumber: '10' },
        { name: 'NOV', monthNumber: '11' },
        { name: 'DEZ', monthNumber: '12' }
      ]
    }
  },
  methods: {
    filterTasks (user, month, status) {
      const tasks = this.tasks.filter(task =>
        user === idFromUrl(task.responsible) &&
        status === task.status &&
        month === this.findMonthNumber(task.started)
      )
      return tasks
    },
    findMonthNumber (date) {
      if (date) {
        return date.split('-')[1]
      }
      return false
    }
  },
  computed: {
    ...mapGetters({
      users: 'getUsers',
      tasks: 'getTasks'
    })
  },
  created () {
    if (this.$store.state.tasks === null) {
      this.$store.dispatch('GETTASKS')
    }
  }
}
</script>

<style scoped>
@media only screen and (min-width: 600px) {
  .tabs__container--centered .tabs__div,
  .tabs__container--fixed-tabs .tabs__div,
  .tabs__container--icons-and-text .tabs__div {
    min-width: 120px;
  }
}
</style>
