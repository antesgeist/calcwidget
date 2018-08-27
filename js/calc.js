'use strict';
const s = document.querySelector.bind(document);

/* CALCULATOR WIDGET
 * 
 * - PARSE CONTROLLER           - calculate parsed input
 * - DATA CONTROLLER            - control result data
 * - UI CONTROLLER              - control UI
 * - APP CONTROLLER             - control flow
 * 
 */



// DATA CONTROLLER
const dataController = (function() {
    
    // 1 - data structure
    const data = {
        currentExp: undefined,
        result: 0,
        splitResults: {
            expression: [],
            operator: [],
            output: []
        }
    };
    
    return {

        updateExp: function(current) {
            data.currentExp = current;
        },

        resetExp: function() {
            data.currentExp = 0;
            console.log('Cleared.');
        },

        getExpression: function() {
            return data.currentExp;
        },

        getData: function() {
            // JSON.stringify( objectLiteral, undefined/0, whitespaces )
            console.log(JSON.stringify(data, 0, 4));
        },

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

    // 1.1 - define substrings to replace
    const charToReplace = [

        /* [ substring, replaceWith ] */

        // multiply
        [ 'x', '*' ],

        // squareroot
        [ /[√]/g, 'sqrt' ],

        // squared / exponent of 2
        [ /[²]/g, 'squared' ],

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

        // ( 0-9 (sqrt OR squared OR %) 0-9 )
        {
            regex: /\d+(sqrt|squared|%)\d+/g,
            error: 'Cannot parse sqrt, squared or % inside expression'
        },
        
        // squared or ) THEN anything NON digit
        {
            regex: /^squared/g,
            error: 'Expressions cannot start with the squareroot operand'
        },

        // char exist before sqrt OR %
        {
            regex: /.+sqrt/g,
            error: 'Root exponent must be after a digit'
        },

        // 2 or more succeeding special characters OR operators
        {
            regex: /[+-/*.%]{2,}/g,
            error: 'No succeeding operands allowed'
        },

        // starts with * / )
        {
            regex: /^[*/)]/g,
            error: 'Expressions cannot start with x, / or )'
        },

        // 0-9 NON-operator 0-9
        {
            regex: /\d+[^+-/*]\d+/g,
            error: 'Non operator better two digits'
        },

        // 0-9 operator NON-digit
        {
            regex: /\d+[+-/*]\D+/g,
            error: 'Non-digit succeeding an operator'
        },

        // 0-9 operator
        {
            regex: /[\(]{1}(\d+[+-/*.%()])[\)]{1}/g,
            error: 'Incomplete Expression'
        },

        // dividing by ZERO
        {
            regex: /.+\/0.*/g,
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

    const isValidParenthesis = function(expression) {

        let lparCount, rparCount;

        const parRegex = {
            par: /[()]/g,
            lpar: /\(/g,
            rpar: /\)/g,
        };

        if (expression.match(parRegex.par)) {

            lparCount = expression.match(parRegex.lpar).length;
            rparCount = expression.match(parRegex.rpar).length;
            
            if (lparCount < rparCount) {
            console.log('SYNTAX_ERROR: Missing ( in the expression');
            } else if (rparCount < lparCount) {
                console.log('SYNTAX_ERROR: Missing ) in the expression');
            } else if (rparCount === lparCount) {
                return true;
            }

        }

    };

    return {

        validator: function(input) {
            // debugger;
            // VALIDATION SEQUENCE

            let currentExp, checkedParExp;

            // 1 - replace predefined substrings
            currentExp = substringReplacer(input);
            
            // 2 - regex validate expression for sqrt and squared
            console.log(`===================`);
            for (let i = 0; i < regexp.length; i++) {
                // check if expression will pass the regexp array
                if (currentExp.match(regexp[i].regex)) {
                    console.log(`SYNTAX_ERROR: ${regexp[i].error}`);
                } 
            }

            // 3 - check if parenthesis is equal
            isValidParenthesis(currentExp);
            
            console.log(`===================\nExpression = ${currentExp}`);
        },

    }

})(); // END PARSE CONTROLLER



// APP CONTROLLER
const appController = (function(UICtrl, dataCtrl, parseCtrl) {

    // import UI DOMStrings
    const DOM = UICtrl.getDOMStrings();

    // setup event listeners
    const setEventListeners = function() {

        s(DOM.fieldButtons).addEventListener('click', displayValue);
        s(DOM.btnClear).addEventListener('click', clearValue);
        s(DOM.btnDelete).addEventListener('click', deleteValue);
        s(DOM.btnEqual).addEventListener('click', getResult);
        
    };

    // display value to input field
    const displayValue = function(e) {

        let val, newVal, currentExp;

        // 1 - save target value
        val = e.target.value;

        // 2 - get current expression value
        currentExp = dataCtrl.getExpression();

        // check if expression value is set
        if (currentExp) {
            newVal = currentExp + val;
        } else {
            newVal = val;
        }

        // check if inputField has value
        if (UICtrl.hasValue(e.target)) {
            // 3 - update expression value
            dataCtrl.updateExp(newVal);
            
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
        if (dataCtrl.getExpression()) {
            // 1 - delete last input field value
            UICtrl.deleteInput();

            // 2 - update data structure expression
            dataCtrl.updateExp(s(DOM.inputField).value);

            // 3 - log new expression
            console.log('Current Expression: ' + dataCtrl.getExpression());
        }

    };

    const getResult = function() {

        // 1 - validate input field
        parseCtrl.validator(s(DOM.inputField).value);
        
        // 2 - update

    };

    return {
        
        init: function() {
            console.log('widget started_:');
            setEventListeners();
            UICtrl.reset();
        },

    }

})(UIController, dataController, parseController); // END APP CONTROLLER



// INITIALIZE APP
appController.init();