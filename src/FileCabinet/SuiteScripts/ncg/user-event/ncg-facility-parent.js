/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/log', 'N/record','N/search'],
    /**
 * @param{log} log
 * @param{record} record
 */
    (log, record, search) => {
        const Fields = {
            ID: 'entityid',
            TEAM: 'custentity_sk_team_name',
            PARENT: 'parent',
            PERSON: 'isperson',
            NAME: 'companyname',
            SUBSIDIARY: 'subsidiary'
        }

        const SHIFTKEY = '3';

        const afterSubmit = (scriptContext) => {
            try{
                let fcl = scriptContext.newRecord;
                let team = fcl.getValue({
                    fieldId: Fields.TEAM
                })
                if(!fcl.getValue({fieldId: Fields.PARENT}) && team){

                    let pid = getParent(team);

                    if(!pid) {
                        log.debug('afterSubmit - attempt to create', team);
                        let parent = record.create({
                            type: record.Type.CUSTOMER,
                            isDynamic: true
                        });
                        parent.setValue({
                            fieldId: Fields.PERSON,
                            value: 'F'
                        });
                        parent.setValue({
                            fieldId: Fields.SUBSIDIARY,
                            value: SHIFTKEY
                        })
                        parent.setValue({
                            fieldId: Fields.NAME,
                            value: team
                        });
                        pid = parent.save({
                            ignoreMandatoryFields: true
                        });
                    }

                    record.submitFields({
                        type: fcl.type,
                        id: fcl.id,
                        values: {
                            'parent': pid
                        }
                    })
                }
            }catch(e){
                log.debug('afterSubmit', e);
            }
        }

        const getParent = (name) => {
            let id = search.create({
                type: search.Type.CUSTOMER,
                filters: [
                    Fields.ID, search.Operator.IS, name
                ]
            })
            .run()
            .getRange({start:0,end:1});

            return id.length ? id[0].id : null;
        }

        return {afterSubmit}

    });
