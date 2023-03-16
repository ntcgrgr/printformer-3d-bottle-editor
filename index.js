import Vue from 'vue';
import Vuex from 'vuex';
import EventEmitter from 'eventemitter3';
import makeStore from "./store";

import EditorSection from './src/EditorSection';
import Connector from "@rissc/printformer-editor-client/dist/Connector";
import FormFields from "./src/components/FormFields";
import FormField from "./src/components/FormField";
import Variants from "./src/components/Variants";
import Assets from "./src/components/Assets";
import NextStep from "./src/components/NextStep.vue";
import SystemMedia from "./src/components/SystemMedia.vue";
import {urlQueryObject} from "./src/helper";
import FullScreenLoader from "./src/components/FullScreenLoader.vue";

Vue.use(Vuex);
Vue.component('form-fields', FormFields);
Vue.component('form-field', FormField);
Vue.component('variants', Variants);
Vue.component('assets', Assets);
Vue.component('system-media', SystemMedia);
Vue.component('next-step', NextStep);

window.onload = () => {
    const connector = new Connector();
    const editorIframe = document.getElementById('editor-iframe');

    let query = urlQueryObject().query
    let url = urlQueryObject().url

    if (process.env.NODE_ENV === 'development') {
        if (query.api_token) {
            editorIframe.src = `${url.origin}/editor/${query.draft}/embed?api_token=${query.api_token}`;
        } else {
            editorIframe.src = `${url.origin}/editor/${query.draft}/embed`;
        }
    } else {
        if (query.api_token) {
            editorIframe.src = `/editor/${query.draft}/embed?api_token=${query.api_token}`;
        } else {
            editorIframe.src = `/editor/${query.draft}/embed`;
        }
    }

    window.events = new EventEmitter();

    // mobile chrome ios fix
    if (navigator.userAgent.match('CriOS')) {
        document.body.style.height = innerHeight + 'px';
        document.body.style.position = 'relative';
    }

    const store = makeStore()
    new Vue({
        store, render: createElement => createElement(FullScreenLoader)
    }).$mount("#full-screen-loader");

    connector.editor(editorIframe, window.events).then(editor => {
        Vue.prototype.$editor = editor;

        new Vue({
            store,
            render: createElement => createElement(EditorSection)
        }).$mount("#main");
    });
}
