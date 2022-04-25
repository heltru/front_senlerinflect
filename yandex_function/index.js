module.exports.handler = async function (event, context) {
    //console.log("event", event);
    //event.body
    console.log(event.body);
    let responce = {};
    try {
        let res_name = '';
        let body = JSON.parse(event.body);

        let names_epic = {'Олег1': '!!! Oleg'};
        let names_dim = {'Олег1': '^__^ Oleg'};
        let integration_public = JSON.parse(body.integration_public);
        switch (integration_public.type) {
            case '1'://dim
                if (body.name in names_dim){
                    res_name = names_dim[body.name];
                } else {
                    res_name = body.name + '😻';
                }
                break;
            case '2'://epic
                if (body.name in names_epic){
                    res_name = names_epic[body.name];
                } else {
                    res_name = body.name + '🔥';
                }
                break;
        }
        if (res_name){
            responce = {vars:[{n:'inflect_name',v:res_name}]};
        }
    } catch (e) {
        console.log(e);
        responce = {err:JSON.stringify(e)}
    }
    return {
        statusCode: 200,
        body: JSON.stringify(responce)
    };
};