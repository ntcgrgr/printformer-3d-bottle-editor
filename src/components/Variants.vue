<template>
  <div>
    <div class="content is-small">
      <h1>Stanniol</h1>
    </div>
    <div class="columns is-justify-content-space-evenly px-2 is-mobile">
      <div v-for="variant in variants" @click="applyVariant(variant, variant.id)"
           class="column is-2 is-one-third-mobile has-text-centered" style="font-size: 0.8rem; cursor: pointer">
        <div v-if="variant.thumbnail.type === 'color'" class="box variant"
             :class="{'variant-active': currentId === variant.id}"
             :style="{'background-color': variant.thumbnail.value}">
          <figure class="image is-square">
            <span style="border-style: none; outline-color: transparent"></span>
          </figure>
        </div>
        <div v-else class="box variant p-0"
             :class="{'variant-active': currentId === variant.id}">
          <figure class="image is-square">
            <img :src="variant.thumbnail.value" height="70px" width="auto">
          </figure>
        </div>
        {{ variant.name }}
      </div>
    </div>
  </div>
</template>

<style>
.variant-active {
  border: 3px solid #747175 !important;
}

.variant {
  border: 3px solid transparent;
}
</style>

<script>
import {mapMutations, mapState} from "vuex";

export default {
  name: "variants",
  computed: {
    ...mapState(['editorConfig'])
  },
  mounted() {
    this.$editor.getVariants().getActive().then((variant) => {
      if (variant) this.currentId = variant.id;
    });

    this.$editor.getVariants().getAll().then((variants) => {
      this.variants = variants;
    });
  },
  methods: {
    async applyVariant(variant, index) {
      if (this.currentId === index) return;

      await this.showFullScreenLoader();
      await this.$editor.getVariants().apply(variant.id).then(() => this.$editor.getPager().showPage(2))
      await this.$editor.save();
      await this.hideFullScreenLoader();
      this.currentId = index;

    },
    ...mapMutations(['showFullScreenLoader', 'hideFullScreenLoader'])

  },
  data() {
    return {
      variants: [],
      currentId: 0
    }
  }
}
</script>
