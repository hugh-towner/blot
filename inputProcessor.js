// Possible input:
// A([start]) -->|Get money| B[Go shopping]
// B --> C{Let me think}
// C -->|One| D([end])
// C -->|two| E[/output/]


// decision - {}
// start - ([])
// process - []
// input/output - [//]


let sampleInput = `A([start]) -->|Get money| B[Go shopping]
                    B --> C{Let me think}
                    C -->|One| D[/output/]         
                    C -->|two| E[/output two/]
                    D --> B
                    E --> F([Finish])`;


input = sampleInput.split('\n').map((line) => line.trim());
console.log(input);


function getArrowLabel(line) {
    let start = line.indexOf('|');
    let end = line.indexOf('|', start + 1);
    let newLine = line.slice(0, start) + line.slice(end + 1);
    let arrowLabel = line.slice(start + 1, end);

    return [newLine, arrowLabel];
}

function getElementType(element) {
    if (element.includes('/')) {
        return 'io';
    } else if (element.includes('{')) {
        return 'decision';
    } else if (element.includes('(')) {
        return 'start';
    } else if (element.includes('[')) {
        return 'process';
    }
}


function extractIDandLabel(element,type) {
    
    let [start, end] = [element.indexOf('['), element.indexOf(']')];

    switch (type) {
        case 'io':
            return {
                id: element.slice(0, start),
                label: element.slice(start + 2, end - 1)
            };
        case 'start':
            return {
                id: element.slice(0, start - 1),
                label: element.slice(start + 1, end)
            };
        case 'decision':
            [start, end] = [element.indexOf('{'), element.indexOf('}')];
            return {
                id: element.slice(0, start),
                label: element.slice(start + 1, end)
            };
        case 'process':
            return {
                id: element.slice(0, start),
                label: element.slice(start + 1, end)
            };
        default:
            return null;
    }
}

function extractElement(element) {
    let elementType = getElementType(element);
        if (elementType) {
            let { id, label } = extractIDandLabel(element, elementType);
            return { id, label, type: elementType};
        } else {
            return { id: element, type: 'id'};
        }
}

let output = input.map((line) => {
    let arrowLabel = null;
    if (line.includes('|')) {
        [line, arrowLabel] = getArrowLabel(line);
    }

    console.log(line)
    linkedElements = line.split('-->').map((element) => element.trim());
    let arrow = {label: arrowLabel, start: null, end: null};

    arrow.start = extractElement(linkedElements[0]);
    arrow.end = extractElement(linkedElements[1]);

    return arrow;
})

console.log(output);


let graph = {};

output.forEach((arrow) => {
    let { start, end } = arrow;

    if (graph[start.id]) {
        graph[start.id].push(end);
    } else {
        graph[start.id] = [end];
    }
})

console.log(graph);

function getMaxDepth(graph, start, visited = new Set()) {
    let maxDepth = 0;
    visited.add(start);

    if (graph[start]) {
        graph[start].forEach((element) => {
            if (!visited.has(element.id)) {
                let depth = getMaxDepth(graph, element.id, visited);
                if (depth > maxDepth) {
                    maxDepth = depth;
                }
            }
        });
    }

    visited.delete(start);
    return maxDepth + 1;
}



function getNodesAtDepth(graph, start, depth, visited = new Set()) {
    let nodes = [];
    visited.add(start);

    if (depth === 0) {
        nodes.push(start);
    } else if (graph[start]) {
        graph[start].forEach((element) => {
            if (!visited.has(element.id)) {
                let childNodes = getNodesAtDepth(graph, element.id, depth - 1, visited);
                nodes.push(...childNodes);
            }
        });
    }

    visited.delete(start);
    return nodes;
}

let startNode = Object.keys(graph).find((node) => !Object.values(graph).flat().includes(node));

depths = Array.from({ length: getMaxDepth(graph, startNode) }, (_, i) => i);
let nodesAtDepths = depths.map((depth) => getNodesAtDepth(graph, startNode, depth));

console.log(nodesAtDepths);

let allNodes = output.map((arrow) => [arrow.start, arrow.end])
                     .flat()
                     .filter((node) => node.type !== 'id');


scale = .6;

allNodes.forEach((node) => {
    switch(node.type) {
        case 'start':
        case 'io':
            node.width = Math.round(node.label.length * scale * 3) + 6;
            node.height = Math.round(node.width/3);
            break;
        case 'decision':
            node.width = Math.round(node.label.length * scale * 3) + 5;
            node.height = Math.round(node.width/2);
            break;
        case 'process':
            node.width = Math.round(node.label.length * scale * 3) + 3;
            node.height = Math.round(node.width/2);
            break;
    }
})

console.log(allNodes);

nodesAtDepths = nodesAtDepths.map((nodesAtDepth) => {
    return nodesAtDepth.map((nodeID) => allNodes.find((node) => node.id === nodeID));
})

console.log(nodesAtDepths);



let ySpacing = 10;
let xSpacing = 10;


let maxDepthWidth = Math.max(...nodesAtDepths.map((nodesAtDepth) => {
    let totalWidth = nodesAtDepth.reduce((acc, node) => acc + node.width, 0);
    let spacingWidth = (nodesAtDepth.length - 1) * xSpacing;
    return totalWidth + spacingWidth;
}));


console.log("width",maxDepthWidth);

let totalHeight = nodesAtDepths.reduce((acc, nodesAtDepth) => {
    let maxHeight = Math.max(...nodesAtDepth.map((node) => node.height));
    return acc + maxHeight + ySpacing;
}, 0);

console.log("height",totalHeight);


