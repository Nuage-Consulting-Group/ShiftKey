/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/log'],
/**
 * @param{log} log
 */
function(log) {

    function validateLine(scriptContext) {
        var newrc = scriptContext.currentRecord;

        var data = JSON.parse(newrc.getValue({fieldId:'custpage_sk_department'}));
        var sub =  newrc.getCurrentSublistValue({
            sublistId: scriptContext.sublistId,
            fieldId: Fields.SUBSIDIARY
        });
        sub = sub ||  newrc.getValue({fieldId:Fields.SUBSIDIARY});

        var department = newrc.getCurrentSublistValue({
            sublistId: scriptContext.sublistId,
            fieldId: Fields.DEPARTMENT
        });
        var acct = newrc.getCurrentSublistValue({
            sublistId: scriptContext.sublistId,
            fieldId: Fields.ACCOUNT
        });
        acct = acct || newrc.getCurrentSublistValue({
            sublistId: scriptContext.sublistId,
            fieldId: Fields.ACCOUNT_ITEM
        });

        if(data[acct] && data[acct].subsidiary.indexOf(sub) > -1 && !department && data[acct].mandatory){
            alert('Please enter the department.');
            return false;
        }

        return true;
    }

    const Fields = {
        SUBSIDIARY: 'subsidiary',
        DEPARTMENT: 'department',
        ACCOUNT: 'account',
        ACCOUNT_ITEM: 'custcol_sk_acct',

        ITEM: 'item',
        EXPENSE: 'expense',
        LINE: 'line'
    }


    return {
        validateLine: validateLine
    }
});
