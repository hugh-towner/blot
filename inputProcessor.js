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
                    B --> C{Let me think}`;


input = sampleInput.split('\n').map((line) => line.trim());
console.log(input);


function getArrowLabel(line) {
    let start = line.indexOf('|');
    let end = line.indexOf('|', start + 1);
    let newLine = line.slice(0, start) + line.slice(end + 1);
    let arrowLabel = line.slice(start + 1, end);
    console.log(arrowLabel);

    return newLine;
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

function extractIDandLabel(element) {
    let start = element.indexOf('(') || element.indexOf('[') || element.indexOf('{');
    let end = element.indexOf(')') || element.indexOf(']') || element.indexOf('}');
    let label = element.slice(start + 1, end);

    return {id: element.slice(0, start), label: label};
    
}

let output = input.map((line) => {
    if (line.includes('|')) {
        line = getArrowLabel(line);
    }

    linkedElements = line.split('-->').map((element) => element.trim());
    console.log(linkedElements);
    for (let i = 0; i < linkedElements.length; i++) {
        let elementType = getElementType(linkedElements[i]);
        console.log(elementType);
        console.log(extractIDandLabel(linkedElements[i]));
    }
    console.log(line);
})