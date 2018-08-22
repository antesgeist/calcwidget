'use strict';


/* CALCULATOR WIDGET */

/*

CALCULATION CONTROLLER      - calculate parsed input
DATA CONTROLLER             - control result data
UI CONTROLLER               - control UI
APP CONTROLLER              - control flow

*/


const s = document.querySelector.bind(document);



// CALCULATION CONTROLLER
const calcController = (function() {

    // data calculation

})();





// DATA CONTROLLER
const dataController = (function() {

    // 1 - data constructor
    const Expression = function() {

    };
    
    // 2 - data structure
    const data = {

        currentExp: undefined,

        result: 0,

        splitResults: {
            expression: [],
            operator: [],
            output: []
        }

    };
    
    // parse data

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
            console.log(JSON.stringify(data, 0, 4));
        },

    }

})();




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

    const inputField = s(DOMStrings.inputField);

    const newString = function(exp) {
        const string = exp.substring(0, exp.length - 1);
        return string;
    }

    // add new HTML

    // change content

    return {

        getDOMStrings: function() {
            return DOMStrings;
        },
        
        displayInput: function(val) {
            inputField.value = val;
        },

        deleteInput: function() {
            inputField.value = newString(inputField.value);
        },

        validateInput: function(val) {
            // check operator precedence
            // 
        },

        hasValue: function(el) {
            return el.hasAttribute('value');
        },

        reset: function(obj) {
            inputField.value = "";
        }

    }

})();





// APP CONTROLLER
const appController = (function(UICtrl, dataCtrl, calcCtrl) {

    // import UI DOMStrings
    const DOM = UICtrl.getDOMStrings();

    // setup event listeners
    const setEventListeners = function() {

        // if ()
        s(DOM.fieldButtons).addEventListener('click', displayValue);
        s(DOM.btnClear).addEventListener('click', clearValue);
        s(DOM.btnDelete).addEventListener('click', deleteValue);
        s(DOM.btnEqual).addEventListener('click', getResult);

    };

    // display value to input field
    const displayValue = function(e) {
        let val, newVal, currentData;

        // 1 - save target value
        val = e.target.value;

        // 2 - get current expression value
        currentData = dataCtrl.getExpression();

        // check if expression value is set
        if (currentData) {
            newVal = currentData + val;
        } else {
            newVal = val;
        }

        if (UICtrl.hasValue(e.target)) {

            // 3 - update expression value
            dataCtrl.updateExp(newVal);
            
            // 4 - display input value
            UICtrl.displayInput(newVal);

            // log current expression
            console.log('Current Expression: ' + dataCtrl.getExpression());
        }

        return newVal;
    };

    const clearValue = function() {

        // 1 - reset expression data
        dataCtrl.resetExp();

        // 2 - reset input field
        UICtrl.reset();
    
    };

    const deleteValue = function() {

        // 1 - delete last input field value
        UICtrl.deleteInput();

        // 2 - update data structure expression
        dataCtrl.updateExp(s(DOM.inputField).value);

        // 3 - log new expression
        console.log('Current Expression: ' + dataCtrl.getExpression());

    };

    const getResult = function() {

        // 1 - validate input field
        // 2 - throw error if invalid
        // 3 - update 

    };

    return {
        
        init: function() {
            console.log('widget started_:');
            setEventListeners();
            UICtrl.reset();
        },

    }

})(UIController, dataController, calcController);



// INITIALIZE APP
appController.init();