/*
  Generalised Fractal creator.
  Can be used either by placing points onto canvas, or selecting preset values..
  Modification to settings enables through UI located to right of canvas.
*/

let points;
let ui;
let clearBackground;

function setup() {
  // create canvas the width and height of the window being drawn to
  createCanvas(window.innerWidth - 250, window.innerHeight);

  points = [];
  ui = {};

  // to ensure that the fractal doesn't need to be recalculated every frame,
  // clearBackground is a global variable that tracks if the background
  // currently should be cleared or not each frame
  clearBackground = false;

  background(51);
  createUI(ui);
}

function draw() {
  // only clear background if flag is set
  if (clearBackground) {
    background(51);
  }

  // update ui every 5 frames
  if (frameCount % 5 == 0) {
    updateUI();
  }

  // if points array has at least 1 value, draw circle at that location
  // if points array has at least 2 values, also draw line between subsequent points
  if (points.length > 0) {
    // set colour to selected colour
    stroke(ui.colourPicker.value());

    // for all but last value in array, draw circle at location and line to next point
    for (let i = 0; i < points.length - 1; i++) {
      circle(points[i].x, points[i].y, 0.5);
      line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
    }
    // for last item in array, draw circle at location and line to first point
    circle(points[points.length - 1].x, points[points.length - 1].y, 1);
    line(points[points.length - 1].x, points[points.length - 1].y, points[0].x, points[0].y);
  }
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  Callback functions
*/

function clearCanvas() {
  // callback function for button press

  background(51);
  points.length = 0;
}

function presetOne() {
  // callback function for button press

  clearCanvas();
  clearBackground = true;

  // set variables for fractal generation
  ui.type.selection.selected('Internal');
  ui.generations.slider.value(9);
  ui.scale.slider.value(0.5);

  // reset points array to empty
  points.length = 0;

  // fill points array with specified values
  const offset = Math.min(width - 100, height - 100) / 2;
  points.push(createVector(width / 2, height / 2 - offset));
  points.push(createVector(width / 2 + offset, height / 2 + offset));
  points.push(createVector(width / 2 - offset, height / 2 + offset));
}

function presetTwo() {
  // callback function for button press

  clearCanvas();
  clearBackground = true;

  // set variables for fractal generation
  ui.type.selection.selected('External 1');
  ui.generations.slider.value(7);
  ui.scale.slider.value(0.5);

  // reset points array to empty
  points.length = 0;

  // fill points array with specified values
  const offset = Math.min(width - 100, height - 100) / 8;
  points.push(createVector(width / 2, height / 2));
  points.push(createVector(width / 2 + offset, height / 2 + 2 * offset));
  points.push(createVector(width / 2 - offset, height / 2 + 2 * offset));
}

function presetThree() {
  // callback function for button press

  clearCanvas();
  clearBackground = true;

  // set variables for fractal generation
  ui.type.selection.selected('Centered');
  ui.generations.slider.value(8);
  ui.scale.slider.value(0.5);

  // reset points array to empty
  points.length = 0;

  // fill points array with specified values
  const offset = Math.min(width - 50, height - 50) / 4;
  points.push(createVector(width / 2 - offset, height / 2 - offset));
  points.push(createVector(width / 2 + offset, height / 2 - offset));
  points.push(createVector(width / 2 + offset, height / 2 + offset));
  points.push(createVector(width / 2 - offset, height / 2 + offset));
}

function presetFour() {
  // callback function for button press

  clearCanvas();
  clearBackground = true;

  // set variables for fractal generation
  ui.type.selection.selected('External 2');
  ui.generations.slider.value(5);
  ui.scale.slider.value(0.5);

  // reset points array to empty
  points.length = 0;

  // fill points array with specified values
  const offset = Math.min(width - 50, height - 50) / 6;
  points.push(createVector(width / 2 - offset, height / 2 - offset));
  points.push(createVector(width / 2 + offset, height / 2 - offset));
  points.push(createVector(width / 2 + offset, height / 2 + offset));
  points.push(createVector(width / 2 - offset, height / 2 + offset));
}

function generateFractal() {
  // callback function for button press

  // ensure at least two points exist
  if (points.length > 1) {

    // stop clearing background
    clearBackground = false;

    // create first shape based on given points
    let shape = new Shape(calcCenter(points), points);

    // draw first shape
    shape.draw();
  
    // call recursive function to create and draw each subsequent generation
    drawNextGeneration(shape, ui.scale.slider.value(), ui.type.selection.value(), ui.generations.slider.value() - 1);
    
    // clear points array after fractal is drawn
    points.length = 0;
  }
}

function mousePressed() {
  // on mouse click, if mouse located within canvas, create new point
  if (mouseInCanvas()) {
    clearBackground = true;
    points.push(createVector(mouseX, mouseY));

    // limit points array to length of 5 by removing first point if length greater than 5
    if (points.length > 5) {
      points.shift();
    }
  }
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  Utility functions
*/

function mouseInCanvas() {
  // check if mouse located within canvas bounds
  return mouseX >= 0 && mouseX <= width &&
    mouseY >= 0 && mouseY <= height;
}

function calcNumShapesToDraw(numPoints, numGenerations) {
  // calculate the total number of shapes to be drawn using:
  // numPoints ^ 0 + numPoints ^ 1 + ... + numPoints ^ numGenerations

  // start with numPoints ^ 0 = 1
  let count = 1;

  // calculate remaining shapes count
  for (let i = 1; i <= numGenerations; i++) {
    count += numPoints ** i;
  }

  return count;
}

function calcCenter (points) {
  // calculates the center point for a given set of vectors
  let center = createVector(0, 0);
  let count = 0;

  // add each vector together and increment the count
  points.forEach(point => {
    center.add(point);
    count++;
  })

  // divide by count to find average vector/center point
  if (count > 0) {
    center.div(count);
  }
  
  return center;
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  Recursive function
*/

function drawNextGeneration(shape, scale, type, remaining) {
  // get all points for prior generation shape
  const points = shape.getPoints();

  // create next generation shape for every point of prior generation shape
  for (let i = 0; i < points.length; i++) {
    let newCenter;

    // calculate the new center point for next generation shapes
    if (type === 'Internal') {
      newCenter = p5.Vector.add(points[i], p5.Vector.sub(shape.center, points[i]).mult(scale));
    } else if (type === 'External 1') {
      newCenter = p5.Vector.add(points[i], p5.Vector.sub(points[i], shape.center));
    } else if (type === 'External 2') {
      newCenter = p5.Vector.add(points[i], p5.Vector.sub(points[i], shape.center).mult(scale));
    } else if (type === 'Centered') {
      newCenter = points[i].copy();
    }
    const newPoints = [];

    // calculate the new points, based on new center, for each new shape
    points.forEach(point => {
      const offset = p5.Vector.sub(point, shape.center);
      newPoints.push(p5.Vector.add(newCenter, offset.mult(scale)));
    })

    // create new shape and draw
    let newShape = new Shape(newCenter, newPoints);
    newShape.draw();

    // if new generations still remain, recursively call this function with newly
    // generated shape as input for next generation
    if (remaining > 0) {
      drawNextGeneration(newShape, scale, type, remaining - 1);
    }
  }
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  Shape function
*/

function Shape(center, points) {
  this._constructor = function(center, points) {
    this.points = points;
    this.center = center;
  }

  this.getPoints = function() {
    return this.points;
  }

  this.draw = function() {
    stroke(ui.colourPicker.value());
    strokeWeight(1);
    const points = this.getPoints();

    // for every point except last, draw line from point to next point
    for (let i = 0; i < this.points.length - 1; i++) {
      line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
    }

    // draw line from last point to first point
    line(points[points.length - 1].x, points[points.length - 1].y, points[0].x, points[0].y);
  }

  this._constructor(center, points);
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  UI
*/

function createUI(ui) {
  // track heighOffset changes through UI creation to ensure 
  // elements are placed at correct height
  let heightOffset = 10;

  heightOffset = createResetUI(ui, heightOffset);

  heightOffset = createTypeUI(ui, heightOffset);

  heightOffset = createPointsUI(ui, heightOffset);

  heightOffset = createGenerationsUI(ui, heightOffset);

  heightOffset = createScaleUI(ui, heightOffset);

  heightOffset = createTotalUI(ui, heightOffset);

  heightOffset = createColourPickerUI(ui, heightOffset);
  
  heightOffset = createPresetsUI(ui, heightOffset);
  
  heightOffset = createStartUI(ui, heightOffset);

  heightOffset = createInstructionstUI(ui, heightOffset);
}

function updateUI() {
  // each call, update ui elements with up to date information

  ui.points.spanValue.html(points.length);
  ui.generations.spanValue.html(ui.generations.slider.value());
  ui.scale.spanValue.html(ui.scale.slider.value());

  // calculate and display total number of shapes to be drawn with current settings
  ui.total.spanValue.html(calcNumShapesToDraw(points.length, ui.generations.slider.value()));

  // display warning if total number of shapes exceeds 100,000
  if (ui.total.spanValue.html() > 100000) {
    ui.total.spanValue.style('color', 'red');
    ui.total.warningSpan.show();
  } else {
    ui.total.spanValue.style('color', 'black');
    ui.total.warningSpan.hide();
  }
}

function createResetUI(ui, heightOffset) {
  ui.reset = {};

  // create and place description span
  ui.reset.span = createSpan('Clear Canvas');
  ui.reset.span.position(width + 4, heightOffset);

  heightOffset += 20;

  // create and place clear canvas button
  ui.reset.button = createButton('Clear');
  ui.reset.button.position(width + 4, heightOffset);

  // register callback function to execute on button press
  ui.reset.button.mousePressed(clearCanvas);

  return heightOffset + 50;

}

function createTypeUI(ui, heightOffset) {
  ui.type = {};

  // create and place description span
  ui.type.span = createSpan('Fractal type:');
  ui.type.span.position(width + 4, heightOffset);

  heightOffset += 20;

  // create and place drop down selection menu with different types
  ui.type.selection = createSelect();
  ui.type.selection.option('Centered');
  
  ui.type.selection.option('Internal');
  ui.type.selection.option('External 1');
  ui.type.selection.option('External 2');

  // start with Centered selected
  ui.type.selection.selected('Centered');

  ui.type.selection.position(width + 4, heightOffset);

  return heightOffset + 50;
}

function createPointsUI(ui, heightOffset) {
  ui.points = {};

  // create and place description span
  ui.points.span = createSpan('Number of points:');
  ui.points.span.position(width + 4, heightOffset);

  // create and place slider with span to display value
  ui.points.spanValue = createSpan(points.length);
  ui.points.spanValue.position(width + 125, heightOffset);

  return heightOffset + 50;
}

function createGenerationsUI(ui, heightOffset) {
  ui.generations = {};

  // create and place description span
  ui.generations.span = createSpan('Number of generations:');
  ui.generations.span.position(width + 4, heightOffset);

  heightOffset += 20;

  // create and place slider with span to display value
  ui.generations.slider = createSlider(1, 10, 3, 1);
  ui.generations.slider.position(width, heightOffset);
  ui.generations.slider.size(200, AUTO);
  ui.generations.spanValue = createSpan(ui.generations.slider.value());
  ui.generations.spanValue.position(width + 210, heightOffset + 5);
  
  return heightOffset + 50;
}

function createScaleUI(ui, heightOffset) {
  ui.scale = {};

  // create and place description span
  ui.scale.span = createSpan('Scale between generations:');
  ui.scale.span.position(width + 4, heightOffset);

  heightOffset += 20;

  // create and place slider with span to display value
  ui.scale.slider = createSlider(0.1, 2, 0.5, 0.01);
  ui.scale.slider.position(width, heightOffset);
  ui.scale.slider.size(200, AUTO);
  ui.scale.spanValue = createSpan(ui.scale.slider.value());
  ui.scale.spanValue.position(width + 210, heightOffset + 5);
  
  return heightOffset + 50;
}

function createTotalUI(ui, heightOffset) {
  ui.total = {}

  // create and place description span
  ui.total.span = createSpan('Total number of shapes to draw:');
  ui.total.span.position(width + 4, heightOffset);

  heightOffset += 20;

  // create and place span that displays calculated number of shapes 
  // that will be drawn if selected values are used
  ui.total.spanValue = createSpan(calcNumShapesToDraw(points.length, ui.generations.slider.value()));
  ui.total.spanValue.position(width + 4, heightOffset);

  heightOffset += 20;

  ui.total.warningSpan = createSpan('WARNING: This may lag your computer');
  ui.total.warningSpan.style('color', 'red');
  ui.total.warningSpan.position(width + 4, heightOffset);
  ui.total.warningSpan.hide();

  return heightOffset + 50;
}

function createColourPickerUI(ui, heightOffset) {
  ui.colourPicker = {};

  // create and place description span
  ui.colourPicker.span = createSpan('Colour:');
  ui.colourPicker.span.position(width + 4, heightOffset);

  heightOffset += 20;

  // create and place colour picker
  ui.colourPicker = createColorPicker('#0084FF');
  ui.colourPicker.position(width + 4, heightOffset);

  return heightOffset + 50;
}

function createPresetsUI(ui, heightOffset) {
  ui.presets = {};

  // create and place description span
  ui.presets.span = createSpan('Examples:');
  ui.presets.span.position(width + 4, heightOffset);

  heightOffset += 30;

  // create and place Triangle preset button
  ui.presets.one = createButton('Triangle');
  ui.presets.one.position(width + 4, heightOffset);

  // register callback function to execute on button press
  ui.presets.one.mousePressed(presetOne);

  heightOffset += 30;

  // create and place Triangle 2 preset button
  ui.presets.two = createButton('Triangle 2');
  ui.presets.two.position(width + 4, heightOffset);

  // register callback function to execute on button press
  ui.presets.two.mousePressed(presetTwo);

  heightOffset += 30;

  // create and place Square preset button
  ui.presets.three = createButton('Square');
  ui.presets.three.position(width + 4, heightOffset);

  // register callback function to execute on button press
  ui.presets.three.mousePressed(presetThree);

  heightOffset += 30;

  // create and place Square 2 preset button
  ui.presets.four = createButton('Square 2');
  ui.presets.four.position(width + 4, heightOffset);

  // register callback function to execute on button press
  ui.presets.four.mousePressed(presetFour);

  return heightOffset + 70;
}

function createStartUI(ui, heightOffset) {
  ui.start = {};

  // create and place create image button
  ui.start.btn = createButton('Create image');
  ui.start.btn.position(width + 4, heightOffset);

  // register callback function to execute on button press
  ui.start.btn.mousePressed(generateFractal);

  return heightOffset + 100;
}

function createInstructionstUI(ui, heightOffset) {
  ui.instructions = {};

   // create and place description span
   ui.instructions.span = createSpan('Usage:');
   ui.instructions.span.position(width + 4, heightOffset);

   heightOffset += 20;

   let instructions = 
    'Click the canvas to create up to 5 points.\
    Adjust above settings to generate different recusive shapes.\
    Available presets can be selected.\
    Click "Create image" to finalise selection.'

  // create and place instruction span
   ui.instructions.spanValue = createSpan(instructions);
   ui.instructions.spanValue.position(width + 4, heightOffset);

   return heightOffset + 50;
}