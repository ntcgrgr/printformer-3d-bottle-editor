export function parseSearchPath(url) {
    if (url.search.length === 0) return {};

    return url.search.substring(1)
        .split('&')
        .map(pair => pair.split('='))
        .reduce((acc, pair) => {
            acc[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            return acc;
        }, {});
}

export function urlQueryObject() {
    let url = new URL(location.href);
    let query = parseSearchPath(url);

    if (process.env.NODE_ENV === 'development') {
        url = new URL(process.env.PF_URL);
        query = {draft: process.env.PF_DRAFT, api_token: process.env.PF_TOKEN};
    }

    return {url, query}
}

/**
 * @param step EditorStep
 * @param draftHash string
 * @returns {string}
 */
export function buildStepURL(step, draftHash) {
    const query = urlQueryObject().query;
    let action = `/editor/${draftHash}/${step.action}`;
    if (query.api_token) {
        action += '?' + encodeURIComponent('api_token') + '=' + query.api_token;
    }
    return action;
}

/**
 * @param step EditorStep
 * @param draftHash string
 * @returns {string}
 */
export function goToStep(step, draftHash) {
    const action = buildStepURL(step, draftHash);

    if (step.method === 'POST') {
        const form = document.createElement('form');
        form.method = step.method;
        form.action = action;
        form.target = "_" + step.target;

        document.body.appendChild(form);

        form.submit();
    } else {
        window.location.assign(action);
    }
}