const width = 125;
const height = 125;

setDocDimensions(width, height);

const finalLines = [];


function decision(x,y,width){
  let shape = [
  [0, 10],
  [10, 20],
  [20, 10],
  [10, 0],
  [0, 10]]

  shape = bt.scale([shape], width/20)
  shape = bt.translate(bt.originate(shape),[x,y])
  return shape
}

function process(x,y,width){
  let shape = [
  [0, 0],
  [0, 10],
  [10, 10],
  [10, 0],
  [0, 0]]

  shape = bt.scale([shape], [width/10,width/25]);
  shape = bt.translate(bt.originate(shape),[x,y]);

  return shape
}

function startStop(x,y,width){
  const t = new bt.Turtle()
  let height = width/3
  t.left(180);
  t.arc(180,height/2);
  t.forward(width-height);
  t.arc(180,height/2);
  t.forward(width-height);

  let shape = t.lines()
  shape = bt.translate(bt.originate(shape),[x,y])

  return shape
}

function inputOutput(x,y,width){
  let shape = [
  [0, 0],
  [5, 10],
  [width+5, 10],
  [width, 0],
  [0, 0]]

  // shape = bt.scale([shape], [width/10,width/25]);
  shape = bt.translate(bt.originate([shape]),[x,y]);

  return shape
}

function arrow(start,end){

  let mid = [((start[0]+end[0])/2)+10,end[1]-start[1]]
  let points = bt.catmullRom([start,mid,end])
  let normal = bt.getNormal([points],1);
  console.log(normal)
  return [points]
}

finalLines.push(...decision(width/2,height/2,20));
finalLines.push(...process(width/2,30,25));
finalLines.push(...startStop(width/2,95,25));
finalLines.push(...inputOutput(width/2,80,25));

finalLines.push(...arrow([30,30],[30,90]));




// draw it
drawLines(finalLines);