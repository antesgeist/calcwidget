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
        [ /[²]/g, 'squared' ]

    ];

    // 1.2 - define regex object/array
    const regex = {

        /*

            REGEX RULES

                VALIDATION SEQUENCE
                    1 - replace predefined substrings
                    2 - regex validate expression for sqrt and squared
                            grouped and non-grouped
                    3 - calculate squared digits
                    4 - calculate squreroots
                    5 - validate with regex
                    6 - get result

                FUNCTIONS
                    - simplify squareroots
                    - is not empty
                    - cannot divide by ZERO
                    - "(" MUST be equal to ")" and vice versa | str.match() 
                    - "(" MUST exist at the left side before right ")" | caveat: precedence?

                REGEX
                    - if char exist before radic string
                    - if char next to radic isn't a decimal number
                    - 2 or more succeeding operator(s) ( + - / x   x² . % )
                    - number/expression inside inner parenthesis
                        
                        not allowed:
                            - non-digit inside parenthesi e.g, (abc) | (+-/*.%)
                            - non-operator in between digits e.g, (9%9) | (9radic9) | (9(9)
                            - 

        */



        substrings: [

            // regex sqrt OR squared WITH PARENTHESIS
            /[\(]{1}(\d+(sqrt|squared)\d+)[\)]{1}/g,

            // regex sqrt OR squared WITHOUT PARENTHESIS
            /\d+(sqrt|squared)\d+/g,

            // squared or ) THEN anything NON digit 
            /(squared|\))\D*/g,

            // if char exist before sqrt string
            /.(?=sqrt)/g, 

        ],

        operators: [

            // 2 or more succeeding operator(s)
            /[+-/*.%]{2,}/g,           
            
            // number/expression inside inner parenthesis | GROUPED
            /[\(]{1}(\D+|\d+([^+-/*]|sqrt|[**2])\d+|\d+[+-/*.%()]|[()%]\d+)[\)]{1}/g,

        ]

    };

    // create sequence methods

    // replace substrings: "x" with "*" | "√" with "radic"
    const substringReplacer = function(expression) {
        
        let cleanedExp = expression;

        for (let i = 0; i < charToReplace.length; i++) {
            cleanedExp = cleanedExp.replace(charToReplace[i][0], charToReplace[i][1]);            
        }

        return cleanedExp;

    };

    // regex validate expression for sqrt and squared
    const initValidation = function(fnReplacer) {

        // var paragraph = 'The quick brown fox jumped over the lazy dog. It barked.';
        // var regex = /[A-Z]/g;
        // var found = paragraph.match(regex);

        let currentExp, initRegex;

        currentExp = fnReplacer;
        substrRegex = regex.substrings;

        // check if expression is valid
        for (let i = 0; i < initRegex.length; i++) {

            if (currentExp.match(initRegex[i])) {
                console.log(`===================\nInvalid Expression for regex: ${initRegex[i]}`);
            }

        }

        console.log(`===================\nExpression = ${currentExp}`);

    };

    return {

        validator: function(inputVal) {

            // VALIDATION SEQUENCE

            // 1 - replace predefined substrings
                // DONE IN initValidation(expression)

            // 2 - regex validate expression for sqrt and squared
            initValidation(substringReplacer(inputVal));

            // 3 - calculate squared digits
            // 4 - calculate squreroots
            // 5 - validate with regex
            // 6 - get result


            // validation sequence

            
        }

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

            // log current expression
            console.log('Current Expression: ' + dataCtrl.getExpression());
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
        // 2 - throw error if invalid
        // 3 - update 
        parseCtrl.validator(s(DOM.inputField).value);

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