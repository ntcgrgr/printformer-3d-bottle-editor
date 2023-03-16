<template>
  <div>
    <div v-for="tdi in tdis">
      <hr>
      <div class="content is-small">
        <h1>{{ tdi.label }}</h1>
      </div>
      <div class="columns is-multiline px-2">
        <form-field
            :key="tdi.identifier"
            :name="tdi.label"
            :type="tdi.type"
            :identifier="tdi.identifier"
            :options="tdi.options"
            :regexPattern="tdi.regex"
            :value="tdi.value || tdi.defaultValue"
            :dataKey="tdi.data_key"
            :isRequired="tdi.is_required"
            :isHidden="tdi.is_hidden">
        </form-field>
      </div>
    </div>
  </div>
</template>

<script>
import Events from "@rissc/printformer-editor-client/dist/Events";
import FormField from "./FormField";

export default {
  name: "form-fields",
  components: {FormField},
  mounted() {
    window.events.on(Events.EDITOR_SCOPE_CHANGED, (tdis) => {
      this.tdis = tdis.tdis.filter(tdi => !tdi.is_hidden);
    });
  },
  data() {
    return {
      tdis: [],
    }
  }
}
</script>
