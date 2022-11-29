/**
 * @NApiVersion 2.1
 */
define(['N/log', 'N/record','N/search'],
    /**
 * @param{log} log
 * @param{record} record
 */
    (log, record, search) => {
        const Fields = {
            NAME: 'name',
            ISINACTIVE: 'isinactive'
        };

        const addUpdate = (params) => {
            let data = _search(params);

            if(data){
                if(data.inactive){
                    _update({id: data.id})
                }
                return data.id;
            }else{
                return _create(params);
            }
        }

        const _search = (params) => {
            let data;
            search.create({
                type: params.type,
                filters: [
                    [Fields.NAME, search.Operator.IS, params.name]
                ],
                columns: [
                    Fields.ISINACTIVE
                ]
            })
                .run()
                .getRange({start: 0, end: 1})
                .forEach(function (result) {
                    data = {
                        id: result.id,
                        inactive: result.getValue({name: Fields.ISINACTIVE})
                    };
                });

            return data
        }

        const _update = (params) => {
            record.submitFields({
                type: params.type,
                id: params.id,
                values: {
                    isinactive: false
                }
            })
        }

        const _create = (params) =>{
            return record.create({
                type: params.type,
                isDynamic: true
            })
            .setValue({
                fieldId: Fields.NAME,
                value: params.name
            })
            .save();
        }

        return {
            addUpdate
        }

    });
