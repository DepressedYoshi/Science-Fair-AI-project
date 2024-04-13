const len = 784;
const totalData = 5000;

const CAT = 0;
const RAINBOW = 1;
const TRAIN = 2;

const accuracy_div = document.querySelector(".ac > p");
const mood_div = document.querySelector(".instrucstions > p");
const round_div = document.querySelector(".epoch > p");

let catsData;
let trainsData;
let rainbowsData;
let cats = {};
let trains = {};
let rainbows = {};
let nn;

function preload() {
  catsData = loadBytes('data/cats5000.bin');
  trainsData = loadBytes('data/train5000.bin');
  rainbowsData = loadBytes('data/rainbow5000.bin');
}


function setup() {
  createCanvas(280, 280);
  background(255);

  // Preparing the data
  prepareData(cats, catsData, CAT);
  prepareData(rainbows, rainbowsData, RAINBOW);
  prepareData(trains, trainsData, TRAIN);

  // Making the neural network
  nn = new NeuralNetwork(784, 64, 3);

  // Randomizing the data
  let training = [];
  training = training.concat(cats.training);
  training = training.concat(rainbows.training);
  training = training.concat(trains.training);

  let testing = [];
  testing = testing.concat(cats.testing);
  testing = testing.concat(rainbows.testing);
  testing = testing.concat(trains.testing);

  let trainButton = select('#train');
  let epochCounter = 0;
  trainButton.mousePressed(function() {
    mood_div.innerHTML = "training... this could take a while";
    setTimeout(function () {
      for (let i = 0; i < 5 ; i++) {
        trainEpoch(training);
        epochCounter++;
        let percent = testAll(testing);
        console.log(nf(percent, 2, 10));
        round_div.innerHTML = epochCounter + " Rounds of trainings";
        accuracy_div.innerHTML = "Accuracy:" + nf(percent, 2, 2) + "%";
      }
      mood_div.innerHTML = "draw here, and then press'guesss'";
    }, 100);
  });

  let testButton = select('#test');
  testButton.mousePressed(function() {
    let percent = testAll(testing);
    accuracy_div.innerHTML = "Accuracy:" + nf(percent, 2, 2) + "%";
  });
  let guessButton = select('#guess');
  guessButton.mousePressed(function() {
    let inputs = [];
    let img = get();
    img.resize(28, 28);
    img.loadPixels();
    for (let i = 0; i < len; i++) {
      let bright = img.pixels[i * 4];
      inputs[i] = (255 - bright) / 255.0;
    }
    let guess = nn.predict(inputs);
    let m = max(guess);
    let classification = guess.indexOf(m);
    if (classification === CAT) {
      document.getElementById("answer").innerHTML="'This is a CAT'";
    } else if (classification === RAINBOW) {
      document.getElementById("answer").innerHTML="'This is a RAINBOW'";
    } else if (classification === TRAIN) {
      document.getElementById("answer").innerHTML="'This is a TRAIN'";
    }
  });
  let clearButton = select('#clear');
  clearButton.mousePressed(function() {
    background(255);
  });
}
function draw() {
  strokeWeight(8);
  stroke(0);
  if (mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}
