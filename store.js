import Vuex from 'vuex';
import Vue from "vue";

export default function makeStore() {
    return new Vuex.Store({
        state: {
            editorConfig: {},
            fullScreenLoaderVisible: true,
            editorLoaded: false,
            blocksByDataKey: {},
        },
        mutations: {
            setEditorConfig(state, editorConfig) {
                state.editorConfig = editorConfig;
                state.editorLoaded = true;
            },
            showFullScreenLoader(state) {
                state.fullScreenLoaderVisible = true;
            },
            hideFullScreenLoader(state) {
                state.fullScreenLoaderVisible = false;
            },
            setBlocksByDataKey(state, obj) {
                Vue.set(state.blocksByDataKey, obj.key, obj.value);
            }
        }
    });
}
