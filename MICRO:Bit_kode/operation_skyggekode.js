function playDot () {
    music.playTone(440, 150)
    basic.showIcon(IconNames.SmallDiamond)
    basic.pause(150)
    basic.clearScreen()
}
function switchToNewTask (change: number) {
    currentTaskId += change
    if (currentTaskId > 5) {
        currentTaskId = 1
    } else if (currentTaskId < 1) {
        currentTaskId = 5
    }
    music.playTone(262, 100)
    music.playTone(330, 100)
    basic.showNumber(currentTaskId)
    basic.pause(1500)
    basic.clearScreen()
}
function pauseBetweenLetters () {
    basic.pause(1500)
}
function confirmPrimeGuess (correct: boolean) {
    realPrime = isPrime(currentPrimeCandidate)
    if (correct == realPrime) {
        correctPrimeStreak += 1
        basic.showIcon(IconNames.Yes)
        music.playTone(659, 300)
        if (correctPrimeStreak >= 5 && !(collectedHex.includes("80"))) { // SET PRIME NUMBER COUNT
            // ASCII for P
            basic.showNumber(80)
            collectedHex = "" + collectedHex + "80,"
        }
    } else {
        correctPrimeStreak = 0
        basic.showString("X")
    }
    currentPrimeCandidate = 0
    basic.pause(800)
    basic.clearScreen()
}
function playDash () {
    music.playTone(440, 450)
    basic.showIcon(IconNames.Diamond)
    basic.pause(150)
    basic.clearScreen()
}
function runMovementTask () {
    currentMotion = input.acceleration(Dimension.Strength)
    motionSamples.push(currentMotion)
    if (motionSamples.length > motionSampleCount) {
        motionSamples.shift()
    }
    let sum = motionSamples.reduce((a, b) => a + b, 0)
averageMotion = sum / motionSamples.length
    if (averageMotion > 2000 && !(collectedHex.includes("83"))) {
        // ASCII for S
        basic.showNumber(83)
        collectedHex = "" + collectedHex + "83,"
        music.playTone(988, 100)
        basic.pause(100)
    } else {
        basic.clearScreen()
    }
}
input.onButtonPressed(Button.A, function () {
    if (currentTaskId == 5) {
        confirmPrimeGuess(true)
    } else {
        enteredSequence = "" + enteredSequence + "A"
        validateSequenceInput()
    }
})
function runTemperatureTask () {
    if (!(collectedHex.includes("67")) && input.temperature() > 31) {
        // ASCII for C
        basic.showNumber(67)
        collectedHex = "" + collectedHex + "67,"
    }
}
function pauseBriefly () {
    basic.pause(150)
}
function isPrime (n: number) {
    if (n < 2) {
        return false
    }
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i == 0) return false
    }
return true
}
function validateSequenceInput () {
    if (enteredSequence == "ABAA") {
        music.playMelody("C E G - C5 - - - ", 120)
        enteredSequence = ""
    } else if (enteredSequence.length >= 4) {
        basic.showString("X")
        enteredSequence = ""
    }
}
input.onButtonPressed(Button.AB, function () {
    if (collectedHex.includes("66") && collectedHex.includes("67") && collectedHex.includes("72") && collectedHex.includes("80") && collectedHex.includes("83")) {
        basic.showString("✓✓✓✓✓")
        music.startMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once)
    } else {
        basic.showString("???")
    }
})
function handleTaskInput () {
    if (input.buttonIsPressed(Button.A)) {
        taskSwitchCounter += 1
        if (taskSwitchCounter > 25) {
            switchToNewTask(-1)
            taskSwitchCounter = 0
        }
    } else if (input.buttonIsPressed(Button.B)) {
        taskSwitchCounter += 1
        if (taskSwitchCounter > 25) {
            switchToNewTask(1)
            taskSwitchCounter = 0
        }
    } else {
        taskSwitchCounter = 0
    }
}
input.onButtonPressed(Button.B, function () {
    if (currentTaskId == 5) {
        confirmPrimeGuess(false)
    } else {
        enteredSequence = "" + enteredSequence + "B"
        validateSequenceInput()
    }
})
function runPrimeTask () {
    if (currentPrimeCandidate == 0) {
        currentPrimeCandidate = Math.randomRange(10, 97)
        basic.showNumber(currentPrimeCandidate)
    }
}
function handleLogging () {
    serial.writeLine("=== DEBUG ===")
    serial.writeLine("Task ID: " + currentTaskId)
    serial.writeLine("Light: " + input.lightLevel())
    serial.writeLine("Temp: " + input.temperature())
    serial.writeLine("Accel: " + input.acceleration(Dimension.Strength))
    serial.writeLine("Entered: " + enteredSequence)
    serial.writeLine("Collected HEX: " + collectedHex)
    serial.writeLine("")
}
function setupSensors () {
    lightLevel = 0
    taskSwitchCounter = 0
    enteredSequence = ""
    stillnessCounter = 0
    collectedHex = ""
    hasMorseHintBeenShown = false
    currentTaskId = 1
    motionSamples = []
    averageMotion = 0
    correctPrimeStreak = 0
    music.startMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once)
    basic.showString("SKYGGE")
}
function runMorseTask () {
    if (hasMorseHintBeenShown) {
        return
    }
    hasMorseHintBeenShown = true
    basic.showString("Hint")
    playDot()
    pauseBriefly()
    playDash()
    pauseBetweenLetters()
    playDash()
    pauseBriefly()
    playDot()
    pauseBriefly()
    playDot()
    pauseBriefly()
    playDot()
    pauseBetweenLetters()
    playDot()
    pauseBriefly()
    playDash()
    pauseBetweenLetters()
    playDot()
    pauseBriefly()
    playDash()
    pauseBetweenLetters()
    // ASCII for H
    basic.showNumber(72)
    if (!(collectedHex.includes("72"))) {
        collectedHex = "" + collectedHex + "72,"
    }
}
function runLightDetectionTask () {
    lightLevel = input.lightLevel()
    if (!(collectedHex.includes("66")) && lightLevel > 180) {
        // ASCII for B
        basic.showNumber(66)
        collectedHex = "" + collectedHex + "66,"
    }
}
let hasMorseHintBeenShown = false
let stillnessCounter = 0
let lightLevel = 0
let taskSwitchCounter = 0
let enteredSequence = ""
let averageMotion = 0
let currentMotion = 0
let collectedHex = ""
let correctPrimeStreak = 0
let currentPrimeCandidate = 0
let realPrime = false
let currentTaskId = 0
let motionSampleCount = 0
let motionSamples: number[] = []
motionSampleCount = 7
// Init
setupSensors()
basic.forever(function () {
    handleLogging()
    handleTaskInput()
    if (currentTaskId == 1) {
        runLightDetectionTask()
    }
    if (currentTaskId == 2) {
        runTemperatureTask()
    }
    if (currentTaskId == 3) {
        runMorseTask()
    }
    if (currentTaskId == 4) {
        runMovementTask()
    }
    if (currentTaskId == 5) {
        runPrimeTask()
    }
    basic.pause(200)
})
