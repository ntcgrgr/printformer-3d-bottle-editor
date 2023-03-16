<template>
  <div>
    <hr>
    <div class="content is-small">
      <h1>Abschluss</h1>
    </div>
    <div class="columns is-justify-content-space-evenly is-flex-wrap-wra px-2">
      <div class="column is-full has-text-centered">
        <button class="file-button next box" @click="nextStep()" :disabled="isLoading">
          Checkout
          <span ref="nextStepObservable"></span>
        </button>
      </div>
    </div>

  </div>
</template>
<style scoped>
button.file-button {
  background-color: #747175;
  color: #ffffff;
  font-family: Trebuchet MS;
  font-size: 16px;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  padding: 10px 38px;
  border: 3px solid #ffffff;
  border-radius: 6px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

button.file-button span {
  margin-left: 12px;
  display: block;
  width: 29px;
  height: 29px;
  background-repeat: no-repeat;
  background-size: contain;
  transform: rotate(0deg);
}

button.file-button.next span {
  background-image: url(images/nest-step.svg);
}

button.file-button:hover {
  background-color: #949494;
}

button.file-button:active {
  transform: scale(0.95);
}

button.file-button:disabled {
  transform: scale(1) !important;
  background-color: #949494;
  cursor: wait;
}
</style>
<script>
import {goToStep, urlQueryObject} from "../helper";
import {mapMutations, mapState} from "vuex";

export default {
  name: "next-step",
  computed: {
    ...mapState(['editorConfig'])
  },
  mounted() {
    const observer = new IntersectionObserver(this.callback);
    observer.observe(this.$refs.nextStepObservable);
  },
  methods: {
    callback(entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelector('#scrollToBottom').classList.add('hide-button');
        } else {
          document.querySelector('#scrollToBottom').classList.remove('hide-button');
        }
      });
    },
    nextStep() {
      this.isLoading = true;
      this.showFullScreenLoader()
      this.$editor.goToNextStep()
          .then(() => {
            goToStep(this.editorConfig.editorSteps.next, urlQueryObject().query.draft)
          }, () => {
            this.isLoading = false;
            this.hideFullScreenLoader();
            alert('Checkout aktuell nicht möglich!')
          });
    },
    ...mapMutations(['showFullScreenLoader', 'hideFullScreenLoader'])
  },
  data() {
    return {
      isLoading: false
    }
  }

}
</script>
