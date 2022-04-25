class IntegrationConnect {


    constructor() {

        this.requests = {};
        this.subscribers = [];


        let onmessage = (e) => {
            // if (!this.isValidSource(e.origin, this.currIntegration.url_callback)){
            //     alert('Запрос с интеграции не корректен');
            //     return false;
            // }
            console.log('integration .onmessage ', 'e.origin=', e.origin, e.data);
            let message = e.data;

            if (message.hasOwnProperty('request') && message.hasOwnProperty('responce')) {//full
                this.handleResponce(message);
            } else {
                if (message.hasOwnProperty('request')) {
                    this.handleRequest(message);
                }
            }
        };

        if (window.addEventListener) {
            window.addEventListener('message', onmessage, false);
        } else if (window.attachEvent) {
            window.attachEvent('onmessage', onmessage);
        }
    }

    subscribe(type,callback){
        this.subscribers.push({type:type,callback:callback});
    }

    handleRequest(message) {

        console.log('integration .handleRequest', message);
        let responce = {success: true, payload: {}};
        let request = message.request;
        try {

            for (let subscriber of this.subscribers){
                if (subscriber.type === request.type){
                    subscriber.callback(responce,request);
                }
            }
        } catch (e) {
            responce.success = false;
            responce.error = e.message;
        }
        message.responce = responce;

        window.parent.postMessage(JSON.parse(JSON.stringify(message)), '*');
    }

    handleResponce(message) {
        console.log('integration .handleResponce message=',message);
        if (message.id && this.requests.hasOwnProperty(message.id)) {

            let request = this.requests[message.id];
            request.callback(message.responce);
            delete this.requests[message.id];
        } else {
            console.log('.handleResponce');
        }
    }

    sendRequest(_message, callback = () => {
    }) {

        try {
            let id = (new Date()).getTime();

            let message = {};
            message.id = id;
            message.callback = callback;
            message.request = _message;

            this.requests[id] = message;

            console.log('integration sendRequest ',message);
            window.parent.postMessage(JSON.parse(JSON.stringify(message)), '*');

        } catch (e) {
            console.log('.sendRequest', e);
        }

    }

    isValidSource(url_source, url_integration) {
        return this.getHost(url_source) === this.getHost(url_integration);
    }


    getHost(url) {
        let a = document.createElement('a');
        a.href = url;
        return a.hostname
    }


}