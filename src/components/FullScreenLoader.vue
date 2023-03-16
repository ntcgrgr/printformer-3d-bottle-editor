<template>
  <div class="column is-two-thirds columns pb-0" v-show="fullScreenLoaderVisible"
       style="position: absolute; height: 100%">
    <div class="column mb-0 is-flex is-justify-content-center is-align-items-center loader-box"
         :class="{'horizontal-translate': editorLoaded}">
      <div class="dots"></div>
    </div>
  </div>
</template>

<style>

.loader-box {
  position: absolute;
  inset: -8px -464px 8px -8px;
  border-radius: 6px;
  background: white;
  z-index: 1;
}

.loader-box.horizontal-translate {
  -webkit-transition: 1s;
  -moz-transition: 1s;
  -ms-transition: 1s;
  -o-transition: 1s;
  transition: 1s;
  inset: -8px 35px 8px -8px !important;
  border-radius: 6px 0 0 6px !important;
}

.dots {
  width: 35.8px;
  height: 35.8px;
  --c: radial-gradient(circle closest-side, #747175 90%, #0000);
  background: var(--c) 0 0,
  var(--c) 0 100%,
  var(--c) 100% 100%;
  background-size: 13.4px 13.4px;
  background-repeat: no-repeat;
  animation: dots-q2rla8 1s infinite linear;
}

@keyframes dots-q2rla8 {
  25% {
    background-position: 100% 0, 0 100%, 100% 100%;
  }

  50% {
    background-position: 100% 0, 0 0, 100% 100%;
  }

  75% {
    background-position: 100% 0, 0 0, 0 100%;
  }

  100% {
    background-position: 100% 100%, 0 0, 0 100%;
  }
}
</style>
<script>
import {mapState} from "vuex";

export default {
  name: "FullScreenLoader",
  computed: {
    ...mapState(['fullScreenLoaderVisible', 'editorLoaded']),
  }
}
</script>
