<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-select
          v-model="modelValue.data.diceCount"
          :items="countOptions"
          label="Number of Dice"
          hide-details
        />
      </v-col>

      <v-col cols="6">
        <v-select
          v-model="modelValue.data.displayMode"
          :items="displayOptions"
          item-title="title"
          item-value="value"
          label="Result Display"
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

  emits: ["update:modelValue"],

  data() {
    return {
      countOptions: [
        "1", "2", "3", "4", "5",
        "6", "7", "8", "9", "10"
      ],

      displayOptions: [
        {
          title: "Total",
          value: "total"
        },
        {
          title: "Separate",
          value: "separate"
        }
      ]
    };
  }
};
</script>
