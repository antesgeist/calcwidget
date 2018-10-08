'use strict'

// Bind "s" as global querySelector
const s = document.querySelector.bind(document)

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
            unparsedExp: [],
            output: [],
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

})();

// UI CONTROLLER
const UIController = (function() {

    // create DOMstrings object
    const DOMStrings = {
        
        container: '.calc-wrap',
        fieldResults: '.field-results',
        fieldInput: '.field-input',
        fieldButtons: '.field-buttons',

        fieldResultsFloating: '.floatbot',

        // class substrings
        resultsRow: 'results',
        resultsExpres: 'expression is-half',
        resultsEquals: 'equals',
        resultsOutput: 'output',
        
        inputField: '#input-field',

        btnDivide: '#btn-div',
        btnMultiply: '#btn-multi',
        btnAdd: '#btn-add',
        btnSubtract: '#btn-subtract',
        btnDelete: '#btn-del',
        btnClear: '#btn-clear',
        btnEqual: '#btn-equal',

    };

    const newString = function(exp) {
        const string = exp.substring(0, exp.length - 1)
        return string
    }

    const inputFieLd = s(DOMStrings.inputField)

    return {

        getDOMStrings: function() {
            return DOMStrings
        },
        displayInput: function(val) {
            inputFieLd.value = val
        },
        deleteInput: function(input) {
            inputFieLd.value = newString(input)
        },
        deleteError: function(input) {
            inputFieLd.value = input.replace(/(.+)\n(.*error.*)/gi, '$1')
        },
        hasValue: function(el) {
            return el.hasAttribute('value')
        },
        newRow: function(exp, output) {

            // set row elements
            const resultsContainer = s(DOMStrings.fieldResults)
            const resultsFloat = s(DOMStrings.fieldResultsFloating)
            const rowContainer = document.createElement('div')
            rowContainer.className = `columns ${DOMStrings.resultsRow}`
            
            // inner div substrings array
            const innerDivClasses = [
                DOMStrings.resultsExpres,
                DOMStrings.resultsEquals,
                DOMStrings.resultsOutput,
            ]

            //  create inner div > insert text content > append to row container
            innerDivClasses.forEach(function(cur) {

                // create inner div element
                const innerDiv = document.createElement('div')
                innerDiv.className = `column ${cur}`

                // check innerdiv class subtrings for regex match then set text content
                if (innerDiv.className.match(/.*expression.*/g)) {
                    innerDiv.textContent = exp
                } else if (innerDiv.className.match(/.*equals.*/g)) {
                    innerDiv.textContent = '='
                } else if (innerDiv.className.match(/.*output.*/g)) {
                    innerDiv.textContent = output
                }

                // insert inner div to new row
                rowContainer.appendChild(innerDiv)
            })

            // append new row to results container
            resultsFloat.appendChild(rowContainer)

            // scroll to bottom
            resultsContainer.scrollTo({
                top: resultsContainer.scrollHeight,
                behavior: 'auto'
            })

            // calc space difference between row block(resultsFloat) and row container(resultsContainer)
            const offsetTop = resultsContainer.offsetHeight - resultsFloat.offsetHeight

            // offset relative top space ELSE enable scrolling and style.top = null
            if (resultsFloat.offsetHeight < resultsContainer.offsetHeight) {
                resultsFloat.style.top = `${offsetTop - 5}px`
            } else {
                resultsContainer.className += ' scrollable'
                resultsFloat.style = null
            }  
        },
        reset: function() {
            inputFieLd.value = ""
        }
    }

})();

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

        // comma
        [ /\,/g, '' ],

    ];

    // substring replacer
    const substringReplacer = function(expression) {
        let newExp = expression;

        // loop through each string and check for replaceable character
        for (let i = 0; i < newExp.length; i++) {
            for (let j = 0; j < charToReplace.length; j++) {
                newExp = newExp.replace(charToReplace[j][0], charToReplace[j][1]);
            }
        }
        return newExp;
    };

    return {
        validator: function(input) {
            let inputExp, parsedExp;

            // replace predefined substrings
            inputExp = substringReplacer(input);

            // Math.js parser and evaluation
            parsedExp = math.parse(inputExp);

            // return as a string ELSE will be return as an Object
            return parsedExp + '';
        },
    }

})();

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
        s(DOM.fieldResults).addEventListener('click', getPrevExp);

    };

    // return UI input value
    const input = function() {
        return s(DOM.inputField).value
    };

    // has error
    const hasError = function() {
        if (input().match(/.*error.*/gi)) return true
    };

    // display value to input field
    const displayValue = function(e) {
        let val, newVal, hasExp, hasResult;

        // save target value
        val = e.target.value;

        // get current expression value
        hasExp = dataCtrl.getData('curExp');
        hasResult = dataCtrl.getData('result')

        // check if expression value is set
        if (hasResult) {
            newVal = input() + val
        } else if (hasExp) {
            newVal = hasExp + val
        } else {
            newVal = val
        }

        // check if inputField has value
        if (UICtrl.hasValue(e.target)) {
            // 3 - update expression value
            dataCtrl.updateData('curExp',newVal);
            
            // 4 - display input value
            UICtrl.displayInput(newVal);
        }
    };

    const clearValue = function() {
        // reset expression data
        dataCtrl.reset()
        // reset input field
        UICtrl.reset()
    
    };

    const deleteValue = function() {
        // check if expression isn't empty
        if (hasError()) {
            UICtrl.deleteError(input())
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
        let isValidated, result;

        try {
            isValidated = parseCtrl.validator(input())

            // evaluate expression
            result = math.eval(isValidated)

            if (result.toString().length > 7) {
                result = result.toExponential(2)
            } else {
                result = result.toLocaleString()
            }

            // update data newExp
            dataCtrl.updateData('parsedExp', isValidated)

            // update data result
            dataCtrl.updateData('result', result)

            // add new row
            UICtrl.newRow(input(), result)

            // diplay result to input field
            UICtrl.displayInput(result)

        } catch (error) {

            // if state has NO error, update error state with NEW error
            if (!hasError()) {
                // push error message to state
                dataCtrl.updateData('error', error + '')
                // display error below current expression
                UICtrl.displayInput(input() + '\nSyntaxError: ' + error.message)
            }
        }
    }

    // get previous expression from history
    const getPrevExp = function(e) {
        if (!e.target.className.match(/.*field-results.*/g)) {
            const prev = e.target.parentNode.firstChild.textContent
            UICtrl.displayInput(prev)
        }
    }

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