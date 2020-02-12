/* Data */
let data = []
let element = null // Reference element
const elements = {} // Created Elements
let switchBool = true
const backgroundClass = '__background'
const firstBackground = '__first_background'
const secondBackground = '__second_background'

/* Config */
let colorStayTime = 10
const transitionTime = colorStayTime / 10

export default async function (elementId, colorList, stateTime) {
  data = colorList
  colorStayTime = stateTime
  await searchElement(elementId)
  await createBackgroundElements()
  await getElementsInScreen()
  await createCSSClasses(elementId, colorList)
  startAnimations()
}

// Search container element
function searchElement (elementId) {
  return new Promise((resolve, reject) => {
    try {
      element = document.getElementById(elementId)
      resolve()
    } catch {
      reject(new Error('Cannot find Element: ' + elementId))
    }
  })
}

// Create background to render colors
function createBackgroundElements () {
  return new Promise((resolve, reject) => {
    try {
      if (!element) reject(new Error('Cannot find Element'))

      const div1 = document.createElement('div')
      const div2 = document.createElement('div')

      div1.setAttribute('class', backgroundClass)
      div1.setAttribute('id', firstBackground)
      div2.setAttribute('class', backgroundClass)
      div2.setAttribute('id', secondBackground)
      element.appendChild(div1)
      element.appendChild(div2)

      resolve()
    } catch {
      reject(new Error('Error trying to create background elements'))
    }
  })
}

// Get backgrounds elements in screen
function getElementsInScreen () {
  return new Promise((resolve, reject) => {
    elements.firstBackground = document.getElementById(firstBackground)
    elements.secondBackground = document.getElementById(secondBackground)
    if (elements.firstBackground && elements.secondBackground) resolve()
    if (!elements.firstBackground || !elements.secondBackground) reject(new Error('Error finding elements'))
  })
}

// Creates CSS Classes from JSON Data
function createCSSClasses (elementId, colorList) {
  return new Promise((resolve, reject) => {
    try {
      const style = document.createElement('style')
      style.type = 'text/css'
      colorList.forEach((styles, index, array) => {
        style.innerHTML += `.${backgroundClass}_${index} { background: ${styles.color} !important; }`
      })
      style.innerHTML += `
                #${elementId} {
                    position: relative;
                }
                .${backgroundClass} {
                    transition: opacity ${transitionTime}s linear;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    position: absolute;
                    opacity: 0;
                }
                .${backgroundClass}.show {
                    opacity: 1 !important;
                }
            `
      document.getElementsByTagName('head')[0].appendChild(style)
      resolve()
    } catch {
      reject(new Error('Cannot create CSS Classes'))
    }
  })
}

function startAnimations () {
  const { firstBackground } = elements

  firstBackground.className += ` ${backgroundClass}_${getRandomBG()} show` // Set first color befre loop start
  backgroundsLoop()
}

function backgroundsLoop () {
  const { firstBackground, secondBackground } = elements

  // Initalize varibles
  let first = firstBackground
  let second = secondBackground

  // Invert values to reverse loop
  if (!switchBool) {
    first = secondBackground
    second = firstBackground
  }

  // Set a new color in the hidden background
  second.className += ` ${backgroundClass}_${getRandomBG()}`

  // Wait stay color time to switch between colors
  setTimeout(() => {
    first.className = first.className.replace('show', '')
    second.className += ' show'

    // Remove color from the hidden one, change boolean & call loop again
    setTimeout(() => {
      first.className = backgroundClass
      switchBool = !switchBool
      backgroundsLoop()
    }, transitionTime * 1000)
  }, (colorStayTime) * 1000)
}

function getRandomBG () {
  return parseInt(Math.random() * data.length)
}
