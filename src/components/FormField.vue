<template>
  <div class="column is-full">
    <div class="field">
      <a @click="setColor(white)" href="#" class="text-color-button white"
         :class="{'color-active': currentColor === 'white'}"> </a>
      <a @click="setColor(pink)" href="#" class="text-color-button pink"
         :class="{'color-active': currentColor === 'pink'}"> </a>
      <a @click="setColor(green)" href="#" class="text-color-button green"
         :class="{'color-active': currentColor === 'green'}"> </a>
      <a @click="setColor(blue)" href="#" class="text-color-button blue"
         :class="{'color-active': currentColor === 'blue'}"> </a>
      <a @click="setColor(black)" href="#" class="text-color-button black"
         :class="{'color-active': currentColor.toLowerCase().includes('black')}"> </a>
      <div class="control" v-if="type === 'multi-line-text'">
          <textarea v-model="formValue" class="textarea" style="resize: none;"
                    type="text" :id="name" rows="2"/>
      </div>
      <div class="control" v-else-if="type === 'select'">
        <div class="select">
          <select v-model="formValue">
            <option v-for="option in options" :value="option.value ? option.value : option">
              {{ option.label ? option.label : option }}
            </option>
          </select>
        </div>
      </div>
      <div class="control" v-else>
        <input v-model="formValue" class="input"
               type="text" :id="name"/>
      </div>
    </div>
  </div>
</template>

<style>

.text-color-button {
  border-radius: 6px;
  border: 3px solid #ffffff;
  display: inline-block;
  cursor: pointer;
  color: transparent;
  font-size: 15px;
  padding: 12px 12px;
  text-decoration: none;
  text-shadow: 0 1px 0 #ffffff;
}

.text-color-button.white {
  box-shadow: inset 0 1px 0 0 #DEDCDC;
  background-color: #DEDCDC;
}

.text-color-button.blue {
  box-shadow: inset 0 1px 0 0 #1153a1;
  background-color: #1153a1;
}

.text-color-button.pink {
  box-shadow: inset 0 1px 0 0 #F39200;
  background-color: #F39200;
}

.text-color-button.green {
  box-shadow: inset 0 1px 0 0 #8AC160;
  background-color: #8AC160;
}

.text-color-button.black {
  box-shadow: inset 0 1px 0 0 #111111;
  background-color: #111111;
}

.text-color-button.white:hover {
  background-color: #595859;
}

.text-color-button.black:hover {
  background-color: #1c1a1c;
}

.text-color-button:active {
  transform: scale(0.95);
}

.text-color-button.color-active {
  border: 3px solid #747175 !important;
}

</style>

<script>
import {mapState} from "vuex";
import debounce from "lodash.debounce";

export default {
  name: "form-field",
  props: {
    name: String,
    type: String,
    identifier: String,
    options: Array,
    isHidden: Boolean,
    isRequired: Boolean,
    regexPattern: Array,
    value: String,
    dataKey: String
  },
  data() {
    return {
      changedColor: null,
      white: {
        displayColor: '#DEDCDC',
        colorSpace: 'CMYK',
        values: [16, 12, 13, 0],
        name: 'white'
      },
      black: {
        displayColor: '#111111',
        colorSpace: 'CMYK',
        values: [0, 0, 0, 90],
        name: 'Color/Black Tint 90.0'
      },
      green: {
        displayColor: '#8AC160',
        colorSpace: 'CMYK',
        values: [53, 0, 76, 0],
        name: 'green'
      },
      pink: {
        displayColor: '#F39200',
        colorSpace: 'CMYK',
        values: [0, 50, 100, 0],
        name: 'pink'
      },
      blue: {
        displayColor: '#1153a1',
        colorSpace: 'CMYK',
        values: [95, 68, 0, 0],
        name: 'blue'
      },
      formValue: this.value ? this.value : '',
    }
  },
  created() {
    this.debouncedUpdate = debounce(async () => {
      await this.$editor.getFormEditor().update(this.identifier, this.formValue, null);
    }, 500);
  },
  computed: {
    currentColor: {
      get() {
        return this.blocksByDataKey[this.dataKey]
            ? this.changedColor ? this.changedColor : this.blocksByDataKey[this.dataKey].color.name
            : 'black'
      },
      set(value) {
        this.changedColor = value;
      }
    },
    ...mapState(['blocksByDataKey'])
  },
  methods: {
    async setColor(color) {
      this.currentColor = color.name;
      const editorObject = this.blocksByDataKey[this.dataKey];
      await editorObject.setFontColor(color, this.dataKey)
      await this.$editor.save();

    },
    async updateField() {
      this.debouncedUpdate();
    },
  },
  watch: {
    formValue() {
      this.updateField()
    }
  }
}
</script>
