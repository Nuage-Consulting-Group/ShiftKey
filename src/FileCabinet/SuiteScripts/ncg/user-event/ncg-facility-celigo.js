/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/log', 'N/record', 'N/search', '../lib/ncg-sk-record'],
    /**
 * @param{log} log
 * @param{record} record
 */
    (log, record, search, _record) => {
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
                scriptContext.UserEventType.CREATE,
                scriptContext.UserEventType.EDIT
            ];

            if(CTX.indexOf(scriptContext.type) == -1) return;
            log.debug('aftersubmit', scriptContext.type);

            try {

                _updateCategory(scriptContext.newRecord);
                _updateRegion(scriptContext.newRecord);

            }catch(e){
                log.debug('Facility Category Update', e);
            }
        }

        const _updateCategory = (ns) => {
            let facility = ns.getValue({
                fieldId: Fields.CATEGORY
            });
            let facilitytemp = ns.getValue({
                fieldId: Fields.PAYLOAD
            });

            log.debug('aftersubmit', [facility, facilitytemp]);

            if (facility || !facilitytemp) {
                return;
            }

            facilitytemp = JSON.parse(facilitytemp).type;

            let id = _record.addUpdate({
                type: record.Type.CUSTOMER_CATEGORY,
                id: ns.id,
                name: facilitytemp
            });

            record.submitFields({
                type: record.Type.CUSTOMER,
                id: ns.id,
                values: {
                    category: id
                }
            })
        }

        const _updateRegion = (ns) => {
            let region = ns.getValue({
                fieldId: Fields.REGION
            });
            let payload = ns.getValue({
                fieldId: Fields.PAYLOAD
            });

            log.debug('aftersubmit', [region, payload]);

            if (region || !payload) {
                return;
            }

            region = JSON.parse(payload).region;

            let id = _record.addUpdate({
                type: 'customlist_sk_region',
                id: ns.id,
                name: region
            });

            record.submitFields({
                type: record.Type.CUSTOMER,
                id: ns.id,
                values: {
                    custentity_sk_region: id
                }
            })
        }

        return {afterSubmit}

    });
