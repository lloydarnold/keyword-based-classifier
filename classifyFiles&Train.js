const fs = require('fs');

let rawWeights = fs.readFileSync("weights.json");
var weights = JSON.parse(rawWeights);

const keyWordList = initialise_keywords("keywords.txt");

sampleFile = fs.readFileSync("test.txt", "utf8")
fileLines = file_line_by_line(sampleFile)

keyWordVector = initialise_keyword_vector()
keyWordVector = count_stem_matches(sampleFile, keyWordVector)

scores = genScore(keyWordVector)
weights = updateWeights(scores, keyWordVector, keyWordList)
save_weights()
outputResults(scores)

function updateWeights(scores, keyWordVector, keyWordList) {
      weights = changeWeights(correctDecision(getActualDecision(), scores), indexOfMax(scores), keyWordVector, keyWordList)
return weights
};

function calcConfidence(scores) {
    // calculates confidence of prediction - score of best match / score of all three categories
    return scores[indexOfMax(scores)] / sumOfElements(scores)
};

function changeWeights(positive, indexToUpdate, keyWordVector, keyWordList) {
    for (keyWord in keyWordVector) {
        // if the computer was confident of an answer and gets it right we only want to adjust the prediction mechanism by a small amount
        // if it was correct but less confident we should adjust weightings by a larger amount
        // when updating weights, we should also consider the number of hits on a given keyword
        // if a word doesn't occur in a message, we shouldn't alter the weightings of this word
        if (positive) { 
            weights[keyWordList[keyWord]][indexToUpdate] += (1 - calcConfidence(scores)) * keyWordVector[keyWord]
        } else {
            weights[keyWordList[keyWord]][indexToUpdate] -= (calcConfidence(scores)) * keyWordVector[keyWord]
        };
    };
    return weights
};

function getActualDecision() {
    // get actual decision (as string) and return
    
    // for testing...
    return "Blood"
};

function correctDecision(actualDecision, scores) {
    if (makeDecision(scores).toLowerCase() == actualDecision.toLowerCase()) { return true } else { return false };
};

function makeDecision(scores) {
    // decides which category the message falls into, based on the score
    switch (indexOfMax(scores)) {
        case (0) :
            return "Marketing"
        case (1) : 
            return "Project"
        case (2) : 
            return "Blood"
    }
};

function outputResults( scores ){
    // outputs the scores to the console log - for testing purposes 
    console.log(`Marketing got a score of: ${scores[0]}`)
    console.log(`Project got a score of: ${scores[1]}`)
    console.log(`Blood got a score of: ${scores[2]}`)
};

function genScore(keyWordVector) {
    // return array of 3 numbers, with score for marketing, project and blood
    scores = [0, 0, 0]

    for(i = 0; i < keyWordList.length; i ++){
        try{
            scores = sumArray(scores, arrayProductConstant(weights[keyWordList[i]], keyWordVector[i]))
            //console.log(scores)
        } catch {
            weights[keyWordList[i]] = [0,0,0]
        };
    };
    return scores
};

function save_weights() {
    // saves weightings back to json file
    var json = JSON.stringify(weights, null, 2)
    fs.writeFileSync("weights.json", json)
};

function arrayProductConstant(arr, c){
    // takes array and constant, returns array with all indexes multiplied by constant
    var arrB = [];
    for(var i = 0; i < arr.length; i++){
        arrB.push(arr[i] * c)
    };
    return arrB
};

function sumOfElements(arr) {
    // returns the sum of elements in an array
    var sum = 0
    for (element in arr) {sum += arr[element]}
    return sum
};

function sumArray(a, b) {
    // returns sum of the corresponding indexes in two arrays
    var c = [];
    for (var i = 0; i < Math.max(a.length, b.length); i++) {
      c.push((a[i] || 0) + (b[i] || 0));
    }
    return c;
};

function count_stem_matches(string, keyWordVector) {
    // counts the number of matches for each keyword contained in the text file
    for (keyword in keyWordList) {
        var reg = new RegExp(keyWordList[keyword], 'gi')
        keyWordVector[keyword] += (string.match(reg) || []).length;
    };
    return keyWordVector
};

function initialise_keyword_vector() {
    // initialises keyword vector as matric of zeros same length as list of keywords
    var keyWordVector = []
    for(keyWord in keyWordList){
        keyWordVector.push(0)
    };
    return keyWordVector
};

function initialise_keywords(keywordsFilePath) {
    // reads in keywords from keywords.txt
    let file = fs.readFileSync("keywords.txt", "utf8")
    keywords = file_line_by_line(file)
    return keywords
};

function file_line_by_line(file){
    // reads file one line at time and returns array of each line
    lines = [];
    tempLine = "";
    for (char in file) {
        if(file[char] != "\n" && file[char] != "\r"){
            tempLine += file[char]
        }
        else{
            if (tempLine != "") { lines.push(tempLine) };
            tempLine = ""
        };
    };
    return lines
};

function indexOfMax(arr) {
    // returns the index of the largest value in an array
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
};