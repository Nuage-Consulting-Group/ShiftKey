/**
 * @NApiVersion 2.1
 */
define(['N/log', 'N/record', 'N/search'],
    /**
 * @param{log} log
 * @param{record} record
 * @param{search} search
 */
    (log, record, search) => {

        const Fields = {
            COMPANY: 'company',
            EMAIL: 'email',
            ENTITYID: 'entityid',
            PHONE: 'phone',
            TITLE: 'title',
            SUBSIDIARY: 'subsidiary',

        }

        const create = (params) => {
            let contact = record.create({
                type: record.Type.CONTACT,
                isDynamic: true
            });
            contact.setValue({
                fieldId: Fields.SUBSIDIARY,
                value: params.subsidiary
            })
            contact.setValue({
                fieldId: Fields.COMPANY,
                value: params.parent
            })
            contact.setValue({
                fieldId: Fields.ENTITYID,
                value: params.name
            })
            if(params.phone)
            contact.setValue({
                fieldId: Fields.PHONE,
                value: params.phone
            })
            if(params.title)
            contact.setValue({
                fieldId: Fields.TITLE,
                value: params.title
            })
            contact.setValue({
                fieldId: Fields.EMAIL,
                value: params.email
            });

            contact.save({
                ignoreMandatoryFields: true
            })
        }

        const update = (params) => {
            let fields = {};

            if(params.name)
                fields[Fields.ENTITYID] = params.name;
            if(params.phone)
            fields[Fields.PHONE] = params.phone;

            if(params.title)
            fields[Fields.TITLE] = params.title;

            if(params.email)
            fields[Fields.EMAIL] = params.email;

            log.debug('For Update', fields);

            record.submitFields({
                type: record.Type.CONTACT,
                id: params.id,
                values: fields
            });
        }

        const find = (params) => {
            log.debug('PARAMS', params)
            let updates = [];
            let con = params.contacts.map(a => a.email)
                .filter(n => n);

            let list = getContact(params.contacts);
            let filters = [
                [Fields.COMPANY, search.Operator.ANYOF, params.entity], 'AND'
            ]

            let conlist = [];
            con.forEach(function(row){
                conlist.push([
                    Fields.EMAIL, search.Operator.IS, row
                ])
                conlist.push('OR')
            });
            conlist.pop();
            filters.push(conlist);

            log.debug('FILTERS', filters)

            let res = {};
            search.create({
                type: search.Type.CONTACT,
                filters: filters,
                columns: [
                    Fields.ENTITYID,
                    Fields.EMAIL,
                    Fields.PHONE,
                    Fields.TITLE
                ]
            }).run()
            .getRange({start: 0, end:1000})
            .forEach(function(result){
                let email = result.getValue({name: Fields.EMAIL});

                res[email] = {
                   id: result.id,
                   name: result.getValue({name: Fields.ENTITYID}),
                   email: result.getValue({name: Fields.EMAIL}),
                   phone: result.getValue({name: Fields.PHONE}),
                   title: result.getValue({name: Fields.TITLE}),
               }
            })

            log.debug('RESILTS', res)
            log.debug('LIST', list)

            for(var email in list){
                let yes = true;
                let data = list[email];
                list[email].parent = params.entity;

                delete list[email].id;

                if(res[email]){

                    log.debug('RESULT EMAIL', res[email]);

                    yes = false;
                    data = {};
                    data = {parent: params.entity, id: res[email].id};

                    if(list[email].name && list[email].name != res[email].name){
                        data[email].name = list[email].name;
                        yes = true;
                    }

                    if(list[email].phone && list[email].phone != res[email].phone){
                        data.phone = list[email].phone;
                        yes = true;
                    }

                    if(list[email].client_role && list[email].client_role != res[email].title){
                        data.title = list[email].client_role;
                        yes = true;
                    }
                }

                if(yes)
                    updates.push(data);
            }

            log.debug('UPDATES', updates);
            return updates;
        }

        const getContact = (params) =>{
            let list = {};

            params.forEach(function(row){
                list[row.email] = row;
            });

            return list;
        }

        return {create, update, find}

    });
