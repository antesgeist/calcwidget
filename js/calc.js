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
        result: 0,
        error: undefined,
        curExp: undefined,
        parsedExp: undefined,
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
            data.curExp = 0;
            console.log('Cleared.');
        },

        getData: function(prop) {
            return data[prop];
        },

        getAll: function() {
            return JSON.stringify(data, 0, 4);
        },

        reset: function() {
            for (let prop in data) {
                if (typeof data[prop] !== 'object') {
                    data[prop] = undefined
                }
            }
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

        deleteInput: function(input) {
            inputFieLd.value = newString(input);
        },

        deleteError: function(input) {
            inputFieLd.value = input.replace(/(.+)\n(.*error.*)/gi, '$1')
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

    // define substrings to replace [ substring, replaceWith ]
    const charToReplace = [

        // multiply
        [ 'x', '*' ],

        // squareroot
        [ /(\√)(\d+)/g, 'sqrt($2)' ],

        //  percentage
        [ /(\d+)(\%)/g, '$1/100' ],

        // squared / exponent of 2
        [ /[²]/g, '^2' ],

    ];

    // substring replacer
    const substringReplacer = function(expression) {
        // debugger;
        let newExp = expression;

        // loop through expression string length
        for (let i = 0; i < newExp.length; i++) {
            // loop through charToReplace length = 3
            for (let j = 0; j < charToReplace.length; j++) {
                newExp = newExp.replace(charToReplace[j][0], charToReplace[j][1]);
            }
        }

        return newExp;

    };

    return {

        validator: function(input) {
            // debugger;
            let inputExp, parsedExp;

            // 1 - replace predefined substrings
            inputExp = substringReplacer(input);

            // Math.js parser and evaluation
            parsedExp = math.parse(inputExp);

            // return as a string ELSE will be return as an Object
            return parsedExp + '';
            
        },

    }

})(); // END PARSE CONTROLLER





// APP CONTROLLER
const appController = (function(UICtrl, dataCtrl, parseCtrl) {

    // import UI DOMStrings
    const DOM = UICtrl.getDOMStrings();

    // setup event listeners
    const setupEventListeners = function() {

        s(DOM.fieldButtons).addEventListener('click', displayValue);
        s(DOM.btnClear).addEventListener('click', clearValue);
        s(DOM.btnDelete).addEventListener('click', deleteValue);
        s(DOM.btnEqual).addEventListener('click', getResult);

    };

    // return input value
    const input = function() {
        return s(DOM.inputField).value
    };

    // has error
    const hasError = function() {
        if (input().match(/.*error.*/gi)) return true
    };

    // display value to input field
    const displayValue = function(e) {
        // debugger;
        let val, newVal, hasExp, hasResult;


        // if current result has value, newVal = curResult + val


        // 1 - save target value
        val = e.target.value;

        // 2 - get current expression value
        hasExp = dataCtrl.getData('curExp');
        hasResult = dataCtrl.getData('result')

        // check if expression value is set
        if (hasResult) {
            newVal = input() + val
            console.log('hasResult triggered!')
        } else if (hasExp) {
            newVal = hasExp + val
            console.log('hasExp triggered!')
        } else {
            newVal = val
            console.log('else triggered!')
        }

        // currentExp ? newVal = currentExp + val : newVal = val;

        // check if inputField has value
        if (UICtrl.hasValue(e.target)) {
            // 3 - update expression value
            dataCtrl.updateData('curExp',newVal);
            
            // 4 - display input value
            UICtrl.displayInput(newVal);
        }

    };

    const clearValue = function() {

        // 1 - reset expression data
        dataCtrl.reset()

        // 2 - reset input field
        UICtrl.reset()
    
    };

    const deleteValue = function() {

        // check if expression isn't empty
        if (hasError()) {
            UICtrl.deleteError(input())
            // dataCtrl.reset()
            dataCtrl.updateData('curExp', input())
        } else if (dataCtrl.getData('curExp')) {
            // 1 - delete last input field value
            UICtrl.deleteInput(input())
            dataCtrl.reset()

            // 2 - update data structure expression
            dataCtrl.updateData('curExp', input())
        }

    };

    const getResult = function() {
        // debugger;
        let isValidated, result;
        
        try {

            // math.parse(input)
            isValidated = parseCtrl.validator(input())

            // evaluate expression
            result = math.eval(isValidated)

            // update data newExp
            dataCtrl.updateData('parsedExp', isValidated)

            // update data result
            dataCtrl.updateData('result', result)

            // diplay result to input field
            UICtrl.displayInput(result)

            // log result
            console.log(dataCtrl.getAll())

            // dataCtrl.updateData('curExp', undefined)
        
        } catch (error) {

            // if not error, do this
            if (!hasError()) {
                dataCtrl.updateData('error', error + '')
                UICtrl.displayInput(input() + '\nSyntaxError: ' + error.message)
                console.log(error + '')
            } // else, do nothing

        }

    };

    return {

        init: function() {
            console.log('widget started_:')
            setupEventListeners()
            UICtrl.reset()
        },

    }

})(UIController, dataController, parseController); // END APP CONTROLLER



// INITIALIZE APP 
appController.init();

function all() {
    console.log(dataController.getAll())
}