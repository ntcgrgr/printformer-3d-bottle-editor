<template>
  <div class="" v-if="this.editorLoaded">
    <!--        <div class="title">{{ editorConfig.draftInfo.masterName }}</div>-->
    <variants></variants>
    <system-media></system-media>
    <assets></assets>
    <form-fields></form-fields>
    <next-step></next-step>
    <button id="scrollToBottom" class="scroll-button" @click="ev => scrollToBottom(ev.target)"></button>
  </div>

</template>
<style>

.scroll-button {
  background-color: transparent;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: 0;
  outline: 0;
  cursor: pointer;
  justify-content: center;
  text-align: center;
  white-space: nowrap;
  align-items: center;
  box-shadow: none;
  display: inline-flex;
  vertical-align: top;
  user-select: none;
  margin: 0;
  line-height: 1.5;
  position: absolute;
  bottom: -4px;
  background-image: url(components/images/arrow.svg);
  background-repeat: no-repeat;
  transform: rotate(270deg);
}

.scroll-button:hover,
.scroll-button:active {
  transform: rotate(270deg) scale(0.95);
}

@media screen and (max-width: 768px){
  .scroll-button {
    left: calc(50% - 18px);
  }
}
@media screen and (min-width: 769px) and (max-width: 1023px){
  .scroll-button {
    right: 24.8%;
  }
}
/*@media screen and (min-width: 1024px) and (max-width: 1407px){*/
@media screen and (min-width: 1024px) {
  .scroll-button {
    right: 16.6%;
  }
}
.hide-button {
  display: none;
}
</style>
<script>
import Events from "@rissc/printformer-editor-client/dist/Events";
import {mapState} from "vuex";

export default {
  name: "editor-section",
  computed: {
    ...mapState(['editorConfig', 'previewPages'])
  },
  mounted() {
    window.events.on(Events.EDITOR_LOADED, async (config) => {
      this.$store.commit('setEditorConfig', config);

      const editorIframe = document.getElementById('editor-iframe');
      const threeDee = document.getElementById('three-dee-iframe');
      threeDee.src = editorIframe.src.replace(new RegExp(/\/embed/), '/3d');
      this.$editor.setThreeDeeElement(threeDee);

      threeDee.style.display = 'block';
      editorIframe.style.display = 'none';


      this.editorLoaded = true;
    });

    window.events.on(Events.EDITOR_PAGES_PAGED, (pageInfo) => {
      if (pageInfo.pageNumber === 2) this.$editor.threeDee.setBackgroundColor('#ffffff');
    });
  },
  methods: {
    scrollToBottom(target) {
      const scrollArea = target.parentElement.parentElement;
      scrollArea.scrollTo({top: scrollArea.scrollHeight, left: 0, behavior: "smooth"});
    }
  },
  data() {
    return {
      editorLoaded: false
    }
  }
}
</script>
