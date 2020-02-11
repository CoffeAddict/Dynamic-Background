/* Data */
let data = []
let elements = {}
let switchBool = true

/* Config */
let colorStayTime = 30
let transitionTime = colorStayTime / 10

window.onload = async () => {

    await getData()
    await getElementsInScreen()
    await createCSSClasses()
    startAnimations()
}

// GEt data frm JSON File
function getData () {
    return new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest()
        xhttp.open("GET", "data.json", true)
        xhttp.send()
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    data = JSON.parse(this.response).data.backgroundsList
                    resolve()
                }
                if (this.status != 200) {
                    reject('Error loading file data.json')
                }
            }
        }
    })
}

// Get backgrounds elements in screen
function getElementsInScreen () {
    return new Promise((resolve, reject) => {
        elements.firstBackground = document.getElementById('first-background')
        elements.secondBackground = document.getElementById('second-background')
        if (elements.firstBackground && elements.secondBackground) resolve()
        if (!elements.firstBackground || !elements.secondBackground) reject('Error finding elements')
    })
}

// Creates CSS Classes from JSON Data
async function createCSSClasses () {
    return new Promise((resolve, reject) => {
        try {
            let style = document.createElement('style')
            style.type = 'text/css'

            data.forEach((styles, index, array) => {
                style.innerHTML += `.__background_${index} { ${styles.color} !important }`
                style.innerHTML += `.__background_${index} { ${styles.color} !important }`
                // console.log(checkBestTextColor('#ffffff'))
            })
            style.innerHTML += `.background { transition: opacity ${transitionTime}s linear; }`
            document.getElementsByTagName('head')[0].appendChild(style);
            resolve()
        } catch {
            reject('Cannot create CSS Classes')
        }
    })
}


function startAnimations () {
    let {firstBackground} = elements

    firstBackground.className += ` __background_${getRandomBG()} show` // Set first color befre loop start
    backgroundsLoop()
}

function backgroundsLoop () {
    let {firstBackground, secondBackground} = elements

    // Initalize varibles
    let first = firstBackground
    let second = secondBackground

    // Invert values to reverse loop
    if (!switchBool) {
        first = secondBackground
        second = firstBackground
    }

    // Set a new color in the hidden background
    second.className += ` __background_${getRandomBG()}`
    console.log('set color on hidden')

    // Wait stay color time to switch between colors
    setTimeout(() => {
        first.className = first.className.replace('show', '')
        second.className += ` show`
        console.log('hide/show')

        // Remove color from the hidden one, change boolean & call loop again
        setTimeout(() => {
            first.className = 'background'
            switchBool = !switchBool
            backgroundsLoop()
            console.log('start loop again')
        }, transitionTime * 1000)

    }, (colorStayTime) * 1000)


}

function getRandomBG () {
    return parseInt(Math.random() * data.length)
}
