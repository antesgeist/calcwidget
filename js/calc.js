'use strict';

/* CALCULATOR WIDGET
 * 
 * - PARSE CONTROLLER           - calculate parsed input
 * - DATA CONTROLLER            - control result data
 * - UI CONTROLLER              - control UI
 * - APP CONTROLLER             - control flow
 * 
 */





// Bind "s" as querySelector
const s = document.querySelector.bind(document);





// DATA CONTROLLER
const dataController = (function() {
    
    // 1 - data structure
    const data = {
        currentExp: undefined,
        result: 0,
        error: undefined,
        splitResults: {
            expression: [],
            operator: [],
            output: []
        }
    };
    
    return {

        getProps: function() {
            return Object.keys(data);
        },
        
        updateData: function(prop, val) {
            data[prop] = val;
        },

        resetExp: function() {
            data.currentExp = 0;
            console.log('Cleared.');
        },

        getData: function(prop) {
            // console.log(JSON.stringify(data, 0, 4));
            return data[prop];
        },

        getAll: function() {
            // return JSON.stringify(data, undefined, 4);
            return data;
        }

    }

})(); // END DATA CONTROLLER





// UI CONTROLLER
const UIController = (function() {

    // create domstrings object
    const DOMStrings = {
        
        container: '.calc-wrap',
        fieldResults: '.field-result',
        fieldInput: '.field-input',
        fieldButtons: '.field-buttons',
        resultsRow: '.results',
        resultsExpres: '.expression',
        resultsOperator: '.operator',
        resultsOutput: '.output',
        inputField: '#input-field',
        btnDivide: '#btn-div',
        btnMultiply: '#btn-multi',
        btnAdd: '#btn-add',
        btnSubtract: '#btn-subtract',
        btnDelete: '#btn-del',
        btnClear: '#btn-clear',
        btnEqual: '#btn-equal',

    };

    const inputFieLd = s(DOMStrings.inputField);

    const newString = function(exp) {
        const string = exp.substring(0, exp.length - 1);
        return string;
    };

    return {

        getDOMStrings: function() {
            return DOMStrings;
        },
        
        displayInput: function(val) {
            inputFieLd.value = val;
        },

        deleteInput: function() {
            inputFieLd.value = newString(inputFieLd.value);
        },

        hasValue: function(el) {
            return el.hasAttribute('value');
        },

        reset: function(obj) {
            inputFieLd.value = "";
        }

    }

})(); // END UI CONTROLLER





// PARSE CONTROLLER
const parseController = (function() {

    // ARTIHMETIC RULE: MDAS

    let error = [];

    // 1.1 - define substrings to replace [ substring, replaceWith ]
    const charToReplace = [

        // multiply
        [ 'x', '*' ],

        // squareroot
        [ /[√]/g, 'sqrt' ],

        // squared / exponent of 2
        [ /[²]/g, '^2' ],

        // substrings for math.eval sqrt and percentage

    ];

    // 1.2 - define regex object/array
    const regexp = [

        /*

        CALCULATION CONTROLLER

            1 - calculate squared digits
            2 - calculate squreroots
            3 - calculate expression
            4 - get result
            
        UI CONTROLLER

            1 - is not empty >> TO UI controller

        REGEX RULES

            VALIDATION SEQUENCE
                1 - replace predefined substrings
                2 - regex validate expressions
                3 - validate parehenthesis count

            NON-OPERATORS:

                sqrt , squared , % , ( , )

        */



        // REGEXES

        {
            regex: /\d+(sqrt|squared|%)\d+/g,
            error: 'Cannot parse sqrt, squared or % inside expression'
        },
        
        {
            regex: /^squared/g,
            error: 'Expressions cannot start with the squareroot operand'
        },

        {
            regex: /.+sqrt/g,
            error: 'Root exponent must be after a digit'
        },

        {
            regex: /[+-/*.%]{2,}/g,
            error: 'No succeeding operands allowed'
        },

        {
            regex: /^[*/)]/g,
            error: 'Expressions cannot start with x, / or )'
        },

        {
            regex: /\d{100,}[^+-/*]\d{100,}/g,
            error: 'Non operator between two digits'
        },

        {
            regex: /\d+[+-/*]\D+/g,
            error: 'Non-digit succeeding an operator'
        },

        {
            regex: /[\(]{1}(\d+[+-/*.%()])[\)]{1}/g,
            error: 'Incomplete Expression'
        },

        {
            regex: /.+\/0\D*/g,
            error: 'Cannot divide by zero'
        },

    ];

    const substringReplacer = function(expression) {
        // debugger;
        let newExpression = expression;

        // loop through expression string length
        for (let i = 0; i < newExpression.length; i++) {
            // loop through charToReplace length = 3
            for (let j = 0; j < charToReplace.length; j++) {
                newExpression = newExpression.replace(charToReplace[j][0], charToReplace[j][1]);
            }
        }

        return newExpression;

    };

    const isEqualPar = function(expression) {

        let lparCount, rparCount;

        const parRegex = {
            par: /[()]/g,
            lpar: /\(/g,
            rpar: /\)/g,
        };

        // evaluate only if parenthesis exist
        if (expression.match(parRegex.par)) {

            // returns array of open or close parenthesis
            lparCount = expression.match(parRegex.lpar).length;
            rparCount = expression.match(parRegex.rpar).length;
            
            if (lparCount < rparCount) {
                error.push('SYNTAX_ERROR: Missing ( in the expression');
            } else if (rparCount < lparCount) {
                error.push('SYNTAX_ERROR: Missing ) in the expression');
            } else if (rparCount === lparCount) {
                return true;
            } 

        }

    };

    return {

        validator: function(input) {
            // debugger;

            // 1 - replace predefined substrings
            let inputExp = substringReplacer(input);

            // Math.js parser and evaluation
            let parsedExp = math.parse(inputExp);

            // return as a string ELSE will be return as an Object
            return parsedExp + '';
            
        },

    }

})(); // END PARSE CONTROLLER





// APP CONTROLLER
const appController = (function(UICtrl, dataCtrl, parseCtrl) {

    // import UI DOMStrings
    const DOM = UICtrl.getDOMStrings();
    const props = dataCtrl.getProps();

    // setup event listeners
    const setupEventListeners = function() {

        s(DOM.fieldButtons).addEventListener('click', displayValue);
        s(DOM.btnClear).addEventListener('click', clearValue);
        s(DOM.btnDelete).addEventListener('click', deleteValue);
        s(DOM.btnEqual).addEventListener('click', getResult);

    };

    // display value to input field
    const displayValue = function(e) {
        // debugger;
        let val, newVal, currentExp;

        // 1 - save target value
        val = e.target.value;

        // 2 - get current expression value
        currentExp = dataCtrl.getData(props[0]);

        // check if expression value is set
        currentExp ? newVal = currentExp + val : newVal = val;
        // if (currentExp) {
        //     newVal = currentExp + val;
        // } else {
        //     newVal = val;
        // }

        // check if inputField has value
        if (UICtrl.hasValue(e.target)) {
            // 3 - update expression value
            dataCtrl.updateData(props[0],newVal);
            
            // 4 - display input value
            UICtrl.displayInput(newVal);
        }

    };

    const clearValue = function() {

        // 1 - reset expression data
        dataCtrl.resetExp();

        // 2 - reset input field
        UICtrl.reset();
    
    };

    const deleteValue = function() {

        // check if expression isn't empty
        if (dataCtrl.getData(props[0])) {
            // 1 - delete last input field value
            UICtrl.deleteInput();

            // 2 - update data structure expression
            dataCtrl.updateData(props[0],s(DOM.inputField).value);
        }

    };

    const getResult = function() {
        // debugger;
        
        const input = s(DOM.inputField).value;
        
        // if valid input
        const isValidated = parseCtrl.validator(input);
        const result = math.eval(isValidated);

        // update result
        dataCtrl.updateData(props[2], result);

        console.log('Parsed: ' + isValidated + ' = ' + dataCtrl.getData(props[2]));

    };

    return {

        init: function() {
            console.log('widget started_:');
            setupEventListeners();
            UICtrl.reset();
        },

    }

})(UIController, dataController, parseController); // END APP CONTROLLER



// INITIALIZE APP 
appController.init();