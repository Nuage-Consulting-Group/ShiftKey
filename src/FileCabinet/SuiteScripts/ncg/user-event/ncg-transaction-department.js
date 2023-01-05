/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/log', 'N/runtime', 'N/record', 'N/search', 'N/ui/serverWidget', '../lib/ncg-sk-department'],

    (log, runtime, record, search, ui, _dep) => {

        const beforeLoad = (scriptContext) => {
                const context = [
                    scriptContext.UserEventType.CREATE,
                        scriptContext.UserEventType.EDIT
                ];

                if(runtime.executionContext != runtime.ContextType.USER_INTERFACE){
                        return;
                }

                if(context.indexOf(scriptContext.type) == -1){
                        return;
                }

                let fld = scriptContext.form.addField({
                        id: 'custpage_sk_department',
                        label: 'Department',
                        type: ui.FieldType.LONGTEXT
                })
                fld.defaultValue = JSON.stringify(_dep.getValidations());
                fld.updateDisplayType({
                        displayType: ui.FieldDisplayType.HIDDEN
                });
        }

        const beforeSubmit = (scriptContext) => {
                if(runtime.executionContext != runtime.ContextType.CSV_IMPORT){
                        return;
                }

                let data = _dep.getValidations();
                log.debug('Departments', data);
                let newrc = scriptContext.newRecord;
                let lines = [];
                SUBLIST.forEach(function(row){
                        let count = newrc.getLineCount({
                                sublistId: row
                        });

                        if(count <= 0) return;



                        for(var i = 0; i < count; i++) {
                                log.debug(row, [count, i]);
                                var sub = newrc.getSublistValue({
                                        sublistId:row,
                                        fieldId: Fields.SUBSIDIARY,
                                        line: i
                                });
                                sub = sub || newrc.getValue({
                                        fieldId: Fields.SUBSIDIARY
                                });

                                var department = newrc.getSublistValue({
                                        sublistId: row,
                                        fieldId: Fields.DEPARTMENT,
                                        line: i
                                });
                                var acct = newrc.getSublistValue({
                                        sublistId: row,
                                        fieldId: Fields.ACCOUNT,
                                        line: i
                                });
                                acct = acct || newrc.getSublistValue({
                                        sublistId: row,
                                        fieldId: Fields.ACCOUNT_ITEM,
                                        line: i
                                });

                                if (data[acct] && data[acct].subsidiary.indexOf(sub) > -1 && !department && data[acct].mandatory) {
                                        lines.push(i+1);
                                }

                                log.debug('Data', [sub, department, acct, data[acct].mandatory]);
                        }
                })
                if(lines.length > 0){
                        throw 'Please enter department for line/s: ' + lines.join(',');
                }
        }

        const SUBLIST = [
            'line',
            'items',
            'expense'
        ]

            const Fields = {
                    SUBSIDIARY: 'subsidiary',
                    DEPARTMENT: 'department',
                    ACCOUNT: 'account',
                    ACCOUNT_ITEM: 'custcol_sk_acct',

                    ITEM: 'item',
                    EXPENSE: 'expense',
                    LINE: 'line'
            }


        return {beforeLoad, beforeSubmit}

    });
