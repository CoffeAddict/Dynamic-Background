(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}((function () { 'use strict';

    /* Data */
    let data = [];
    let element = null; // Reference element
    let elements = {}; // Created Elements
    let switchBool = true;

    /* Config */
    let colorStayTime = 10;
    let transitionTime = colorStayTime / 10;

    module.exports = async function (elementId, colorList, stateTime) {
        data = colorList;
        colorStayTime = stateTime;
        await searchElement(elementId);
        await createBackgroundElements();
        await getElementsInScreen();
        await createCSSClasses(elementId, colorList);
        startAnimations();
    };

    // Search container element
    function searchElement (elementId) {
        return new Promise((resolve, reject) => {
            try {
                element = document.getElementById(elementId);
                resolve();
            } catch {
                reject('Cannot find Element: ' + elementId);
            }
        })
    }

    // Create background to render colors
    function createBackgroundElements () {
        return new Promise((resolve, reject) => {
            try {
                if (!element) reject('Cannot find Element');

                let div1 = document.createElement('div');
                let div2 = document.createElement('div');

                div1.setAttribute('class', '__background');
                div1.setAttribute('id', '__first-background');
                div2.setAttribute('class', '__background');
                div2.setAttribute('id', '__second-background');
                element.appendChild(div1);
                element.appendChild(div2);

                resolve();
            } catch {
                reject('Error trying to create background elements');
            }
        })
    }

    // Get backgrounds elements in screen
    function getElementsInScreen () {
        return new Promise((resolve, reject) => {
            elements.firstBackground = document.getElementById('__first-background');
            elements.secondBackground = document.getElementById('__second-background');
            if (elements.firstBackground && elements.secondBackground) resolve();
            if (!elements.firstBackground || !elements.secondBackground) reject('Error finding elements');
        })
    }

    // Creates CSS Classes from JSON Data
    function createCSSClasses (elementId, colorList) {
        return new Promise((resolve, reject) => {
            try {
                let style = document.createElement('style');
                style.type = 'text/css';
                colorList.forEach((styles, index, array) => {
                    style.innerHTML += `.__background_${index} { background: ${styles.color} !important; }`;
                });
                style.innerHTML += `
                #${elementId} {
                    position: relative;
                }
                .__background {
                    transition: opacity ${transitionTime}s linear;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    position: absolute;
                    opacity: 0;
                }
                .__background.show {
                    opacity: 1 !important;
                }
            `;
                document.getElementsByTagName('head')[0].appendChild(style);
                resolve();
            } catch {
                reject('Cannot create CSS Classes');
            }
        })
    }

    function startAnimations () {
        let {firstBackground} = elements;

        firstBackground.className += ` __background_${getRandomBG()} show`; // Set first color befre loop start
        backgroundsLoop();
    }

    function backgroundsLoop () {
        let {firstBackground, secondBackground} = elements;

        // Initalize varibles
        let first = firstBackground;
        let second = secondBackground;

        // Invert values to reverse loop
        if (!switchBool) {
            first = secondBackground;
            second = firstBackground;
        }

        // Set a new color in the hidden background
        second.className += ` __background_${getRandomBG()}`;

        // Wait stay color time to switch between colors
        setTimeout(() => {
            first.className = first.className.replace('show', '');
            second.className += ` show`;

            // Remove color from the hidden one, change boolean & call loop again
            setTimeout(() => {
                first.className = '__background';
                switchBool = !switchBool;
                backgroundsLoop();
            }, transitionTime * 1000);

        }, (colorStayTime) * 1000);


    }

    function getRandomBG () {
        return parseInt(Math.random() * data.length)
    }

})));
