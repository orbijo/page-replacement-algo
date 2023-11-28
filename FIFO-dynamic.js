function fillPages(p){
    const inputdata = document.getElementById('References').value;
    const Rstring = inputdata.split(' ');
    const Rints = Rstring.map(Number);
    p = Rints;
    console.log(p);
    return p;
}

function initializeMC(size,MC){
    let x;
    for(x = 0; x<size; x++){
        MC.push(0);
    }
    //console.log(MC);
}

function count(Mem,MC,frames){

    //console.log(`count before: ${MC[0]} ${MC[1]} ${MC[2]} ${MC[3]}`);
    let x;

    for(x=0; x<frames; x++){ //Mem.length
        if(Mem[x] != undefined){
            MC[x]++;
        }
    }

    //console.log(`count after: ${MC[0]} ${MC[1]} ${MC[2]} ${MC[3]}`);
}

function compare(MC){

    oldest = 0;
    let x;
    for(x=1; x < MC.length; x++){
        if(MC[x] > MC[oldest]){
            oldest = x;
        }
    }
    //console.log("oldest is "+ oldest);
    return oldest;
}


function isHit(Mem, page){
    let x;
    let isEqual = 0;
    for(x=0; x < Mem.length && isEqual === 0; x++){
        if (Mem[x] === page){
            isEqual = 1;
        }
    }

    return isEqual;
}

function FIFO(event){
    event.preventDefault();

    const fNum = parseInt(document.getElementById('Frames').value); //4
    console.log("fNum is " + fNum);
    let faults = 0;
    let hits = 0;

    let pages = []; //0, 2, 1, 6, 4, 0, 1, 0, 3, 1, 2, 1
    const memory = []; // [ 1 2 3 ]
    const FH = [];

    const memoryCount = []; 
    //initialize to 0 depending on number of memory frames

    let replace;
    let x,y,z;

    const resultTable = document.getElementById('resultTable');

    resultTable.innerHTML = '';

    const newRow = resultTable.insertRow(0);
    const pagesLabelCell = newRow.insertCell(0);
    pagesLabelCell.textContent = 'Pages';

    for(z=0; z < fNum; z++){
        const newRow = resultTable.insertRow(z+1);
        const pagesLabelCell = newRow.insertCell(0);
        pagesLabelCell.textContent = 'Frame'+ (z+1);
    }
    
    const FaultRow = resultTable.insertRow(z+1);
    const pagesLabelFaultRow = FaultRow.insertCell(0);
    pagesLabelFaultRow.textContent = 'F/H';
    
    pages = fillPages(pages);
    initializeMC(fNum, memoryCount);

    for(x = 0 ; x < pages.length; x++){
        
        for(y=0; y < fNum && memory[y] != undefined; y++){}
            
        if(y<fNum && memory[y] === undefined){
            //memory is not full
            memory[y] = pages[x];
            count(memory, memoryCount,fNum);
            faults++;
            FH.push('F');
        }else if(isHit(memory,pages[x])){
            hits++;
            FH.push('H');
            count(memory, memoryCount,fNum);
        }else{
            //memory is full, 
            //insert and put back memoryCount to 0
    
            //compare counts for each
            replace = compare(memoryCount);
            memory[replace] = pages[x];
            count(memory, memoryCount,fNum);
            memoryCount[replace] = 1;
            faults++;
            FH.push('F');
        }
    
        //insert page
        const newCell = newRow.insertCell(x+1);
        newCell.textContent  = pages[x];

        //insert frame
        for(z=1; z <= fNum; z++){
            const frameRow = resultTable.rows[z];
            const frameCell = frameRow.insertCell(x+1)
            frameCell.textContent = memory[z-1];
        }
        
        const FHRow = resultTable.rows[fNum+1];
        const FHCell = FHRow.insertCell(x+1);
        FHCell.textContent = FH[x];

            

        console.log(`${memory[0]} ${memory[1]} ${memory[2]} ${memory[3]}`);
    
    }
    
    document.getElementById("Phit").innerHTML = hits;
    document.getElementById("Pfau").innerHTML = faults;
    document.getElementById("Phprob").innerHTML = hits + "/" + pages.length;
    document.getElementById("Pfprob").innerHTML = faults + "/" + pages.length;
    document.getElementById("PhPerc").innerHTML = hits/pages.length*100 + "%";
    document.getElementById("PfPerc").innerHTML = faults/pages.length*100 + "%";
    console.log(FH);
}

//FIFO();        
        
    
    


