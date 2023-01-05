/**
 /**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/log', 'N/record'],
    /**
 * @param{log} log
 * @param{record} record
 */
    (log, record) => {

        const each = (params) => {
            try{
                var rec = record.load({
                    type: params.type,
                    id: params.id,
                    isDynamic: true
                });

                var line = rec.getLineCount({sublistId: 'item'})-1;
                for(var i = line; i >= 0; i--){

                    var amt = Number(
                        rec.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'amount',
                            line: i
                        })
                    );
                    if(amt < 0){
                        log.debug('Remove line: '+ line, i );

                        rec.removeLine({
                            sublistId: 'item',
                            line: i
                        });
                    }
                }

                rec.save({
                    ignoreMandatoryFields: true
                })

            }catch(e){
                log.debug('Error', e);
            }
        }

        return {each}

    });
