class PageReplacementSimulator {
    constructor(numFrames) {
        this.numFrames = numFrames;
        this.references = null;
        this.memory = [];
        this.pageHits = 0;
        this.pageFaults = 0;
        this.memoryLog = [];
        this.pageReplacementLog = [];
        this.pageFaultLog = [];
    }

    getTotalReferences() {
        return this.pageHits + this.pageFaults;
    }

    getStatistics() {
        const hitPercentage = (this.pageHits / this.references.length) * 100;
        const faultPercentage = (this.pageFaults / this.references.length) * 100;

        return {
            hitPercentage: hitPercentage.toFixed(2),
            faultPercentage: faultPercentage.toFixed(2)
        }
    }

    simulateLRU(pageReferences) {
        var pageOrder = []; // pages in memory in order of least recently used (replace pageOrder[0])
        this.references = pageReferences;
        for (const page of pageReferences) {
            let replacedPage = null;
            const pageNumber = parseInt(page);

            if (this.memory.includes(pageNumber)) {
                // Page hit
                this.pageFaultLog.push("H");
                this.pageHits++;
                // Update page order
                if (pageOrder.includes(pageNumber)) {
                    pageOrder = pageOrder.filter(p => p !== pageNumber);
                }
                pageOrder.push(pageNumber);
            } else {
                // Page fault
                this.pageFaultLog.push("F");
                this.pageFaults++;
                if (this.memory.length < this.numFrames) {
                    // Memory not full: add the page
                    this.memory.push(pageNumber);
                } else {
                    // Memory full: LRU replacement
                    replacedPage = pageOrder[0];
                    let index = this.memory.findIndex((elem) => elem == replacedPage);
                    this.memory[index] = pageNumber;
                    this.pageReplacementLog.push([replacedPage, pageNumber]);
                }

                // Update page order
                if (replacedPage !== null && pageOrder.includes(replacedPage)) {
                    pageOrder = pageOrder.filter(p => p !== replacedPage);
                }
                pageOrder.push(pageNumber);
            }

            this.memoryLog.push(this.memory.slice());
        }
    }

    simulateOptimal(pageReferences) {
        this.references = pageReferences;
        var pageOrder = []; // order of pages according to oldest in memory
        for (let i = 0; i < this.references.length; i++) {
            const page = this.references[i];

            if (this.memory.includes(page)) {
                // Page hit
                this.pageFaultLog.push("H");
                this.pageHits++;
            } else {
                // Page fault
                this.pageFaultLog.push("F");
                this.pageFaults++;
                if (this.memory.length < this.numFrames) {
                    // Memory not full: add the page
                    this.memory.push(page);
                    pageOrder.push(page);
                } else {
                    // Memory full: Optimal replacement
                    const futurePages = this.references.slice(i + 1);
                    const indexToReplace = this.findOptimalReplacementIndex(this.memory, futurePages, pageOrder);
                    const replacedPage = this.memory[indexToReplace];

                    this.memory[indexToReplace] = page;
                    this.pageReplacementLog.push([parseInt(replacedPage), parseInt(page)])

                    // Update page order
                    if (replacedPage !== null && pageOrder.includes(replacedPage)) {
                        pageOrder = pageOrder.filter(p => p !== replacedPage);
                    }
                    pageOrder.push(page);
                }
            }
            // console.log(pageOrder)
            this.memoryLog.push(this.memory.slice());
        }
    }

    findOptimalReplacementIndex(frames, futurePages, pageOrder) {

        // Premature terminate and return the oldest item in pageOrder not found in future pages
        console.log(pageOrder)
        for(var i in pageOrder){
            var item = pageOrder[i];
            if(!futurePages.includes(item)){
                return frames.indexOf(item)
            }
        }
        // If not then do regular find

        let farthestPage = -1;
        let indexToReplace = frames.indexOf(pageOrder[0]); // Set default index to replace as the oldest in memory
        let farthestOccurrence = futurePages.indexOf(frames[indexToReplace]);

        for (let i = 0; i < frames.length; i++) {
            const frame = frames[i];
            const nextOccurrence = futurePages.indexOf(frame);

            if (nextOccurrence === -1) {
                return i; // Return the first-in page if not found in future pages
            }

            if (nextOccurrence > farthestOccurrence) {
                farthestPage = nextOccurrence;
                indexToReplace = i;
            }
        }

        return indexToReplace;
    }

}

function LRU(event) {
    event.preventDefault();

    console.log("Performing Least Recently Used Page Replacement Algorithm")

    const references = document.getElementById('References').value.split(' ');
    const numFrames = parseInt(document.getElementById('Frames').value)

    const lruSimulator = new PageReplacementSimulator(numFrames); // initialize Simulator
    lruSimulator.simulateLRU(references); // simulates LRU according to pageReferences

    // Set HTML DOM
    updateResultTable(lruSimulator);
    updateStatistics(lruSimulator);
    // console.log(lruSimulator.pageReplacementLog);
}

function Optimal(event) {
    event.preventDefault();

    console.log("Performing Optimal Page Replacement Algorithm")

    const references = document.getElementById('References').value.split(' ');
    const numFrames = parseInt(document.getElementById('Frames').value)

    const optSimulator = new PageReplacementSimulator(numFrames); // initialize Simulator
    optSimulator.simulateOptimal(references); // simulates LRU according to pageReferences

    // Set HTML DOM
    updateResultTable(optSimulator);
    updateStatistics(optSimulator);
    console.log(optSimulator.memoryLog);
}

function updateResultTable(lruSimulator) {
    if (!(lruSimulator instanceof PageReplacementSimulator)) {
        throw new Error('Parameter must be an instance of PageReplacementSimulator class');
    }

    var resultTable = document.getElementById('resultTable');

    // Clear existing table content
    resultTable.innerHTML = '';

    // Create a header row
    var headerRow = resultTable.insertRow();
    headerRow.insertCell().textContent = 'Pages';

    // Add columns for each reference
    for (let i = 0; i < lruSimulator.references.length; i++) {
        headerRow.insertCell().textContent = `${lruSimulator.references[i]}`;
    }

    // Add rows for each frame
    for (let j = 0; j < lruSimulator.numFrames; j++) {
        var row = resultTable.insertRow();
        var frameCell = row.insertCell();
        frameCell.textContent = `Frame ${j + 1}`;

        // Add memory log for each reference
        for (let i = 0; i < lruSimulator.references.length; i++) {
            var memoryCell = row.insertCell();
            memoryCell.textContent = lruSimulator.memoryLog[i][j] !== undefined ? lruSimulator.memoryLog[i][j] : '';
        }
    }

    // Add a row for page faults/hits
    var resultRow = resultTable.insertRow();
    var resultCell = resultRow.insertCell();
    resultCell.textContent = 'F/H';

    // Add page fault log for each reference
    for (let i = 0; i < lruSimulator.pageFaultLog.length; i++) {
        var pageFaultCell = resultRow.insertCell();
        pageFaultCell.textContent = lruSimulator.pageFaultLog[i];
    }
}

function updateStatistics(lruSimulator) {
    if (!(lruSimulator instanceof PageReplacementSimulator)) {
        throw new Error('Parameter must be an instance of PageReplacementSimulator class');
    }

    const Phit = document.getElementById('Phit');
    const Phprob = document.getElementById('Phprob');
    const PhPerc = document.getElementById('PhPerc');

    const Pfau = document.getElementById('Pfau');
    const Pfprob = document.getElementById('Pfprob');
    const PfPerc = document.getElementById('PfPerc');

    var statistics = lruSimulator.getStatistics();

    // Reset
    Phit.textContent = '';
    Phprob.textContent = '';
    PhPerc.textContent = '';
    Pfau.textContent = '';
    Pfprob.textContent = '';
    PfPerc.textContent = '';

    // Set
    Phit.textContent = `${lruSimulator.pageHits}`;
    Phprob.textContent = `${lruSimulator.pageHits}/${lruSimulator.references.length}`;
    PhPerc.textContent = `${statistics.hitPercentage}%`;
    Pfau.textContent = `${lruSimulator.pageFaults}`;
    Pfprob.textContent = `${lruSimulator.pageFaults}/${lruSimulator.references.length}`;
    PfPerc.textContent = `${statistics.faultPercentage}%`;

}