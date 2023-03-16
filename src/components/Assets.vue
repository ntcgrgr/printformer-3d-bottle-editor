<template>
  <div>
    <hr>
    <div class="content is-small">
      <h1>Bilder</h1>
    </div>
    <div class="columns is-justify-content-space-evenly is-flex-wrap-wrap px-2">
      <div class="column is-6 has-text-centered">
        <button class="file-button box brand" :disabled="!!latestLogoIdentifier"
                @click="uploadLogo">
          Logo
          <span></span>
        </button>
      </div>
      <div class="column is-6 has-text-centered">
        <button class="file-button box user-image" :disabled="!!latestUserMediaIdentifier"
                @click="uploadUserMedia">
          Bild
          <span></span>
        </button>
      </div>

      <input type="file" id="logo" @change="event => handleLogoUpload(event)" hidden
             :accept="'.'+editorConfig.configuration.upload.acceptedFileExtensions.join(',.')"/>
      <input type="file" id="user-media" @change="event =>handleUserMediaUpload(event)" hidden
             :accept="'.'+editorConfig.configuration.upload.acceptedFileExtensions.join(',.')"/>
    </div>
  </div>
</template>
<style>
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
  cursor: pointer;
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

button.file-button.brand span {
  background-image: url(images/brand-image.svg);
}

button.file-button.user-image span {
  background-image: url(images/add-image.svg);
}

button.file-button:hover {
  background-color: #595859;
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
import BlockTypes from "@rissc/printformer-ts-common/dist/BlockTypes";
import Events from "@rissc/printformer-editor-client/dist/Events";
import {mapMutations, mapState} from "vuex";

export default {
  name: "assets",
  mounted() {
    window.events.on(Events.MEDIA_UPLOAD_FILE_PROCESSED, ([uniqueIdentifier, media]) => {
      console.debug(Events.MEDIA_UPLOAD_FILE_PROCESSED, {uniqueIdentifier, media});
      this.handleProcessedMedia(uniqueIdentifier, media)
    });
    window.events.on(Events.MEDIA_UPLOAD_FILE_ERROR, (uniqueIdentifier) => {
      alert('Upload failed');
      this.hideFullScreenLoader();

    });
  },
  computed: {
    ...mapState(['editorConfig'])
  },
  methods: {
    uploadLogo() {
      document.getElementById('logo').click();
    },
    uploadUserMedia() {
      document.getElementById('user-media').click();
    },
    handleLogoUpload(ev) {
      this.showFullScreenLoader();
      const img = ev.target.files[0];
      this.$editor.getMediaProvider().upload(img)
          .then((identifier) => this.latestLogoIdentifier = identifier)
          .catch(exception => {
            this.hideFullScreenLoader();
          })

    },
    handleUserMediaUpload(ev) {
      this.showFullScreenLoader();
      const img = ev.target.files[0];
      this.$editor.getMediaProvider().upload(img)
          .then((identifier) => this.latestUserMediaIdentifier = identifier)
          .catch(exception => {
            this.hideFullScreenLoader();
          })
    },
    async handleProcessedMedia(identifier, media) {
      if (this.latestLogoIdentifier === identifier) {
        await this.replaceLogo(identifier, media);
      } else if (this.latestUserMediaIdentifier === identifier) {
        await this.replaceUserMedia(identifier, media);
      } else {
        console.error('unknown media identifier', identifier);
        this.hideFullScreenLoader()
      }
    },
    async replaceLogo(identifier, media) {
      const pages = [1, 2];
      await pages.reduce(async (previous, page) => {
        await previous;
        await this.$editor.getPager().showPage(page);
        const logo = await this.$editor.findEditorObject({
          type: BlockTypes.ASSET,
          name: 'logo'
        });
        await logo.setActive();
        const loadedPromise = new Promise((resolve) => {
          const listener = (block) => {
            console.debug('block', block)
            if (block.id === logo.id && !block.isLoading) {

              console.debug('block resolve', block)
              resolve();
              window.events.off(Events.EDITOR_OBJECT_UPDATED, listener);
            }
          };
          window.events.on(Events.EDITOR_OBJECT_UPDATED, listener);
        });
        return await Promise.all([logo.replaceWithMedia('userMedia', media.id), loadedPromise]);
      }, Promise.resolve());

      await this.$editor.getPager().showPage(2);
      await this.$editor.save();
      this.latestLogoIdentifier = null;
      this.hideFullScreenLoader();
    },
    async replaceUserMedia(identifier, media) {
      const editorObject = await this.$editor.findEditorObject({
        type: BlockTypes.ASSET,
        name: 'custom-image'
      });
      await editorObject.setActive();
      const loadedPromise = new Promise((resolve) => {
        const listener = (block) => {
          console.debug('block', block)
          if (block.id === editorObject.id && !block.isLoading) {

            console.debug('block resolve', block)
            resolve();
            window.events.off(Events.EDITOR_OBJECT_UPDATED, listener);
          }
        };
        window.events.on(Events.EDITOR_OBJECT_UPDATED, listener);
      });
      await Promise.all([editorObject.replaceWithMedia('userMedia', media.id), loadedPromise]);
      await this.$editor.save();
      this.latestUserMediaIdentifier = null;
      await editorObject.discard();
      setTimeout(this.hideFullScreenLoader, 1000);
    },
    ...mapMutations(['showFullScreenLoader', 'hideFullScreenLoader'])

  },
  data() {
    return {
      latestLogoIdentifier: null,
      latestUserMediaIdentifier: null
    }
  }
}
</script>
