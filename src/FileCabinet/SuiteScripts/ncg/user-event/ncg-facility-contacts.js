/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/log', 'N/record', 'N/search', '../lib/ncg-sk-contact'],
    /**
     * @param{log} log
     * @param{record} record
     */
    (log, record, search, _contact) => {
        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */

        const Fields = {
            NAME: 'name',
            CATEGORY: 'category',
            PAYLOAD: 'custentity_sk_celigo_payload',

            ISINACTIVE: 'isinactive',
            REGION: 'custentity_sk_region'
        };

        const afterSubmit = (scriptContext) => {
            log.debug('aftersubmit','starting...');

            const CTX = [
                scriptContext.UserEventType.EDIT
            ];

            if(CTX.indexOf(scriptContext.type) == -1) return;
            log.debug('aftersubmit', scriptContext.type);

            try {
                let data = scriptContext.newRecord.getValue({
                    fieldId: 'custentity_sk_celigo_payload'
                })
               // log.debug('PAYLOAD', data);
                if(data) {
                    data = JSON.parse(data).contacts;

                    if(data) {
                        data = _contact.find({
                            entity: scriptContext.newRecord.id,
                            contacts: data
                        });

                        log.debug('ATTEMPT', data);

                        data.forEach(function(row){
                            try {
                                if (row.id) {
                                    log.debug('Updating', row);
                                    _contact.update(row)
                                } else {
                                    log.debug('Creating', row);
                                    _contact.create(row)
                                }
                            }catch(j){
                                log.debug('Facility Contact Update', j);
                            }
                        })
                    }
                }

            }catch(e){
                log.debug('Facility Category Update', e);
            }
        }


        return {afterSubmit}

    });
