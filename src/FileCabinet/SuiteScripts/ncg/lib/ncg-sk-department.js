/**
 * @NApiVersion 2.1
 */
define(['N/search'],
    /**
 * @param{search} search
 */
    (search) => {


        const RECORD_TYPE = 'customrecord_ncg_dept_mandatory';
        const Fields = {
            INACTIVE: 'isinactive',
            SUBSIDIARY: 'custrecord_ncg_dept_mandatory_sub',
            ACCOUNT: 'custrecord_ncg_dept_mandatory_acct',
            DEPARTMENT: 'custrecord_ncg_dept_mandatory_dep',
            MANDATORY: 'custrecord_ncg_dept_mandatory_man'
        }

        const getValidations = () => {
            let data = {};
            search.create({
                type: RECORD_TYPE,
                filters: [
                    [Fields.INACTIVE, search.Operator.IS, false]
                ],
                columns: [
                    Fields.SUBSIDIARY,
                    Fields.ACCOUNT,
                    Fields.DEPARTMENT,
                    Fields.MANDATORY
                ]
            }).run().getRange({start: 0, end: 1000})
                .forEach(function(result){
                    let sub = result.getValue({name:Fields.SUBSIDIARY}).split(',');
                    let acct = result.getValue({name: Fields.ACCOUNT});
                    let dep = result.getValue({name: Fields.DEPARTMENT});
                    let man = result.getValue({name: Fields.MANDATORY});

                    data[acct] = data[acct] ||
                        {
                            subsidiary: sub,
                            mandatory: man
                        }
                })

            return data;
        }

        return {getValidations}

    });
