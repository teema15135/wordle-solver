<template>
  <div
    v-on:click="onClickBox()"
    :class="
      'w-12 h-12 text-xl cursor-default flex flex-row justify-center items-center ' +
        letter.state
    "
  >
    <span class="letter text-4xl cursor-default">{{ letter.value }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Letter from '~/constant/Letter'

export default Vue.extend({
  props: {
    letter: {
      type: Letter,
      default: new Letter('')
    }
  },
  methods: {
    onClickBox: function() {
      if (this.letter.isEmpty()) return
      if (this.letter.state == 'none') this.letter.state = 'have'
      else if (this.letter.state == 'have') this.letter.state = 'correct'
      else if (this.letter.state == 'correct') this.letter.state = 'none'
      this.$emit('stateChange', this.letter.state)
    }
  }
})
</script>

<style>
.none {
  @apply bg-gray-800;
}

.have {
  @apply bg-yellow-800;
}

.correct {
  @apply bg-green-600;
}

div,
span {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: #ffffff;
}
</style>
