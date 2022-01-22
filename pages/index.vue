<template>
  <div class="container">
    <div>
      <h1 class="title">
        Wordle Solver
      </h1>
      <div class="flex flex-row justify-center my-4">
        <table>
          <tr v-for="(row, rowIdx) in letterMatrix" :key="rowIdx">
            <td v-for="(letter, letterIdx) in row" :key="letterIdx">
              <LetterBox
                v-bind:letter="letter"
                v-on:stateChange="onStateChange($event, rowIdx, letterIdx)"
              />
            </td>
          </tr>
        </table>
      </div>
      <div>
        <input class="text-input mb-4 bg-transparent text-center" placeholder="Use keyboard click here" type="text" v-model="keyboardTextInput" />
      </div>
      <div>
        <button
          v-on:click="reset()"
          class="reset-button rounded-full bg-orange-300 drop-shadow-md px-10 py-2"
        >
          Reset
        </button>
      </div>
      <h2 class="subtitle">
        Possible words:
      </h2>
      <div class="possible-words h-48">{{ possibleWords }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import LetterBox from '~/components/LetterBox.vue'
import KeyAllow from '~/constant/KeysAllow'
import Letter from '~/constant/Letter'
import Words from '~/constant/Words'

export default Vue.extend({
  components: {
    LetterBox
  },
  data() {
    return {
      letterMatrix: [
        [
          new Letter(''),
          new Letter(''),
          new Letter(''),
          new Letter(''),
          new Letter('')
        ],
        [
          new Letter(''),
          new Letter(''),
          new Letter(''),
          new Letter(''),
          new Letter('')
        ],
        [
          new Letter(''),
          new Letter(''),
          new Letter(''),
          new Letter(''),
          new Letter('')
        ],
        [
          new Letter(''),
          new Letter(''),
          new Letter(''),
          new Letter(''),
          new Letter('')
        ],
        [
          new Letter(''),
          new Letter(''),
          new Letter(''),
          new Letter(''),
          new Letter('')
        ],
        [
          new Letter(''),
          new Letter(''),
          new Letter(''),
          new Letter(''),
          new Letter('')
        ]
      ],
      possibleWords: 'Please complete atleast 1 line',
      keyboardTextInput: ''
    }
  },
  mounted() {
    window.addEventListener('keydown', this.onPressKey)
  },
  watch: {
    letterMatrix: function(val: Letter[][]) {
      if (!this.isAtleastOneRowComplete(val)) {
        this.possibleWords = 'Please complete atleast 1 line'
        return
      }

      const possibles = this.getPossibleWords(val)
      if (possibles.length < 100) this.possibleWords = possibles.join(', ')
      else {
        const showing = possibles.slice(0, 100)
        const diff = possibles.length - showing.length
        this.possibleWords = `${showing.join(', ')}, and other ${diff} words!!`
      }
    },
    keyboardTextInput: function(val: string) {
      this.keyboardTextInput = ''
    }
  },
  methods: {
    onPressKey: function(event: KeyboardEvent) {
      if (KeyAllow.includes(event.key) && !event.repeat) {
        this.putLetter(event.key.toUpperCase())
      } else if (event.key == 'Backspace') {
        this.removeLetter()
      }
    },
    onStateChange: function(state: string, row: number, letter: number) {
      this.applyNewState(state, row, letter)
    },
    putLetter: function(letter: string) {
      let isBreak = false
      for (let row = 0; row < this.letterMatrix.length; row++) {
        let letterRow = this.letterMatrix[row]
        for (let letterIdx = 0; letterIdx < letterRow.length; letterIdx++) {
          if (this.letterMatrix[row][letterIdx].isEmpty()) {
            this.applyNewValue(letter, row, letterIdx)
            isBreak = true
            break
          }
        }
        if (isBreak) break
      }
    },
    removeLetter: function() {
      let isBreak = false
      for (let row = this.letterMatrix.length - 1; row >= 0; row--) {
        let letterRow = this.letterMatrix[row]
        for (
          let letterIdx = letterRow.length - 1;
          letterIdx >= 0;
          letterIdx--
        ) {
          if (!this.letterMatrix[row][letterIdx].isEmpty()) {
            this.applyNewValue('', row, letterIdx)
            this.applyNewState('none', row, letterIdx)
            isBreak = true
            break
          }
        }
        if (isBreak) break
      }
    },
    applyNewState: function(state: string, row: number, letter: number) {
      this.$set(
        this.letterMatrix[row],
        letter,
        new Letter(this.letterMatrix[row][letter].value, state)
      )
    },
    applyNewValue: function(value: string, row: number, letter: number) {
      let state: string = this.letterMatrix[row][letter].state
      if (value != '' && row > 0) {
        for (let irow = row - 1; irow >= 0; irow--) {
          if (this.letterMatrix[irow][letter].value == value) {
            state = this.letterMatrix[irow][letter].state
            break
          }
          for (
            let iletter = 0;
            iletter < this.letterMatrix[irow].length;
            iletter++
          ) {
            if (
              this.letterMatrix[irow][iletter].value == value &&
              this.letterMatrix[irow][iletter].state == 'have'
            ) {
              state = 'have'
              break
            }
          }
        }
      }
      this.$set(this.letterMatrix[row], letter, new Letter(value, state))
    },
    getPossibleWords: function(matrix: Letter[][]): string[] {
      let excludes = []
      let includes = []
      let incorrects: string[] = []
      let correct = ['?', '?', '?', '?', '?']
      for (let rowIdx = 0; rowIdx < matrix.length; rowIdx++) {
        let row = matrix[rowIdx]
        if (row.findIndex((val) => val.isEmpty()) != -1) continue
        let rowIncorrect = ['?', '?', '?', '?', '?']
        for (let letterIdx = 0; letterIdx < row.length; letterIdx++) {
          let letter = row[letterIdx]
          if (letter.isEmpty()) continue
          switch (letter.state) {
            case 'none':
              excludes.push(letter.value)
              break
            case 'have':
              includes.push(letter.value)
              rowIncorrect[letterIdx] = letter.value
              break
            case 'correct':
              correct[letterIdx] = letter.value
          }
        }
        incorrects.push(rowIncorrect.join(''))
      }
      let excludeString = [...new Set(excludes)].join('')
      let includeString = [...new Set(includes)].join('')
      let correctString = correct.join('')
      incorrects = incorrects.filter((val) => val != '?????')
      return Words.split(' ').filter((word) =>
        this.isMatch(
          word.toUpperCase(),
          includeString,
          excludeString,
          correctString,
          incorrects
        )
      )
    },
    isRowComplete(row: Letter[]): Boolean {
      return row.map((val) => val.value).join('').length == 5
    },
    isAtleastOneRowComplete(matrix: Letter[][]): Boolean {
      return matrix.filter((row) => this.isRowComplete(row)).length > 0
    },
    isMatch(
      word: string,
      include: string,
      exclude: string,
      correct: string,
      incorrect: string[]
    ): Boolean {
      for (let i = 0; i < word.length; i++) {
        if (correct[i] == '?') continue
        if (correct[i] != word[i]) return false
      }

      for (let incorrectString of incorrect) {
        for (let i = 0; i < word.length; i++) {
          if (incorrectString[i] == '?') continue
          if (incorrectString[i] == word[i]) return false
        }
      }

      for (const includeLetter of include) {
        if (!word.includes(includeLetter)) return false
      }

      for (const excludeLetter of exclude) {
        if (word.includes(excludeLetter)) return false
      }

      return true
    },
    reset() {
      this.letterMatrix = [
        [
          new Letter(''),
          new Letter(''),
          new Letter(''),
          new Letter(''),
          new Letter('')
        ],
        [
          new Letter(''),
          new Letter(''),
          new Letter(''),
          new Letter(''),
          new Letter('')
        ],
        [
          new Letter(''),
          new Letter(''),
          new Letter(''),
          new Letter(''),
          new Letter('')
        ],
        [
          new Letter(''),
          new Letter(''),
          new Letter(''),
          new Letter(''),
          new Letter('')
        ],
        [
          new Letter(''),
          new Letter(''),
          new Letter(''),
          new Letter(''),
          new Letter('')
        ],
        [
          new Letter(''),
          new Letter(''),
          new Letter(''),
          new Letter(''),
          new Letter('')
        ]
      ]
    }
  }
})
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 64px;
  color: #d7dadc;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #b1b1b1;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.possible-words {
  font-size: 16pt;
  color: #ebebeb;
}

.reset-button {
  background-color: rgb(225 29 72);
  font-size: 16pt;
}

.reset-button:focus {
  outline: 0;
}

.text-input {

}

.text-input:focus {
  outline: 0;
}
</style>
