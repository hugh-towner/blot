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
                    C -->|two| E[/output two/]`;


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
    
    let start = element.indexOf('[');
    let end = element.indexOf(']');

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
            start = element.indexOf('{');
            end = element.indexOf('}');
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