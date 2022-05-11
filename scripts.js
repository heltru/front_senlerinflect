class Inflector {

    getData() {
        let select_type = $('input[name="radio_type"]:checked').val();
        let command_title = $(`[for="typeChoice${select_type}"]`).text();
        return {private: {}, public: {type: select_type, command_title:command_title}};
    }

    setData(payload) {
        if (!('public' in payload)) {
            return false;
        }
        if (!('type' in payload.public)) {
            return false;
        }
        let select_type = payload.public.type;
        $("input[name=radio_type][value='" + select_type + "']").prop('checked', true);
    }

    validSettings() {
        let select_type = $('input[name="radio_type"]:checked').val();
        return Boolean(select_type);
    }
}

class App {

    constructor() {

        this.integrationConnect = new IntegrationConnect();
        this.inflector = new Inflector();

        // При открытие интегрцаии в senler бота
        this.integrationConnect.subscribe('setData', (responce, request) => {
            console.log('.setData-payload', request.payload);
            this.inflector.setData(request.payload);
        });

        //кнопка "Сохранить" в окне интеграции senler бота
        this.integrationConnect.subscribe('getData', (responce, request) => {

            let payload = this.inflector.getData(responce);
            if (!this.inflector.validSettings()) {
                responce.success = false;
                responce.message = 'Данные с формы не верны';
            } else {
                responce.payload = payload;
            }
        });
    }
}

let app = new App();
