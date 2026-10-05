<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-select
          v-model="modelValue.data.diceSides"
          :items="diceOptions"
          item-title="title"
          item-value="value"
          label="Dice Type"
          hide-details
        />
      </v-col>

      <v-col cols="6">
        <v-select
          v-model="modelValue.data.diceCount"
          :items="countOptions"
          label="Number of Dice"
          hide-details
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      diceOptions: [
        { title: "D4", value: "4" },
        { title: "D6", value: "6" },
        { title: "D8", value: "8" },
        { title: "D10", value: "10" },
        { title: "D12", value: "12" },
        { title: "D20", value: "20" },
        { title: "D100", value: "100" }
      ],

      countOptions: [
        "1", "2", "3", "4", "5",
        "6", "7", "8", "9", "10"
      ]
    }
  }
}
</script>
