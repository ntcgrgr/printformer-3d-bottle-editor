<template>
  <div>
    <hr>
    <div class="content is-small">
      <h1>Hintergrund</h1>
    </div>
    <div class="columns is-justify-content-space-evenly is-flex-wrap-wrap px-2 is-mobile">
      <div v-for="media in systemMedia" @click="setBackground(media.name)"
           class="column is-4-desktop is-2-tablet has-text-centered" style="cursor: pointer"
           :class="{'is-loading': isLoading}">
        <img class="box media p-0"
             :src="media.src" :class="{'media-active': currentMedia === media.name}">
      </div>
    </div>
  </div>
</template>

<style>
.media-active {
  border: 3px solid #747175 !important;
}

.is-loading {
  opacity: 0.8;
  pointer-events: none;
}

.media {
  height: auto;
  width: 100%;
  border: 3px solid transparent;
}
</style>

<script>
import {mapMutations, mapState} from "vuex";
import BlockTypes from "@rissc/printformer-ts-common/dist/BlockTypes";

export default {
  name: "systemMedia",
  computed: {
    ...mapState(['editorConfig'])
  },
  async mounted() {
    this.systemMedia = await this.$editor.getMediaProvider().getMedia({
      mediaProvider: 'systemMedia',
      page: 1,
      limit: 999
    });
    const tdi = await this.$editor.getFormEditor().getTDIForDataKey('background-label');
    if (!tdi.value) {
      await this.setBackground(this.systemMedia[5].name, this.systemMedia[5].id)
      await this.saveBlocksInStore();
    } else {
      this.currentMedia = tdi.value;
      await this.$editor.getPager().showPage(1);
      await new Promise((resolve) => setTimeout(resolve, 200));
      await this.$editor.getPager().showPage(2);
      await new Promise((resolve) => setTimeout(resolve, 200));
      await this.$editor.getPager().showPage(3);
      await new Promise((resolve) => setTimeout(resolve, 200));
      await this.$editor.getPager().showPage(2);
      await this.saveBlocksInStore();
      await this.hideFullScreenLoader();
    }
  },
  methods: {
    async saveBlocksInStore() {
      const [upperText, lowerText] = await Promise.all([
        this.$editor.findEditorObject({
          type: BlockTypes.TEXT,
          usedDataKeys: ['pf-ca-text-oben']
        }),
        this.$editor.findEditorObject({
          type: BlockTypes.TEXT,
          usedDataKeys: ['pf-ca-text-unten']
        })
      ]);
      this.setBlocksByDataKey({key: 'pf-ca-text-oben', value: upperText});
      this.setBlocksByDataKey({key: 'pf-ca-text-unten', value: lowerText});
    },
    async setBackground(string) {
      if (this.currentMedia === string) return;

      this.isLoading = true;
      this.showFullScreenLoader();
      await this.$editor.getLoader().show("Loading...");
      const tdi = await this.$editor.getFormEditor().getTDIForDataKey('background-label');

      await this.$editor.getFormEditor().update(tdi.identifier, string, null)
      await this.$editor.getPager().showPage(1);
      await new Promise((resolve) => setTimeout(resolve, 200));
      await this.$editor.getPager().showPage(2);
      await new Promise((resolve) => setTimeout(resolve, 200));
      await this.$editor.getPager().showPage(3);
      await new Promise((resolve) => setTimeout(resolve, 200));
      await this.$editor.getPager().showPage(2);
      this.isLoading = false;
      await this.hideFullScreenLoader();
      this.currentMedia = string;

    },
    ...mapMutations(['showFullScreenLoader', 'hideFullScreenLoader', 'setBlocksByDataKey'])

  },
  data() {
    return {
      systemMedia: [],
      currentMedia: '',
      isLoading: null
    }
  }
}
</script>
