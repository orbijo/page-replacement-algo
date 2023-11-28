function fillPages(p){
    const inputdata = document.getElementById('References').value;
    const Rstring = inputdata.split(' ');
    const Rints = Rstring.map(Number);
    p = Rints;
    console.log(p);
    return p;
}

function initialize(size,MC){
    let x;
    for(x = 0; x<size; x++){
        MC.push(0);
    }
}

function fcount(pos, freq){
    //  if(pos === freq.length){ //edit, wrong when hit
    //      pos--;
    //  }

    freq[pos]++;
}

function fcounthit(mem, y, freq){
    let x;
    for(x=0; x<mem.length && mem[x] !== y; x++){}
    freq[x]++;
    //console.log("freq: " + freq);
}

function count(Mem,MC,frame){

    let x;

    for(x=0; x<frame; x++){ //Mem.length
        if(Mem[x] != undefined){
            MC[x]++;
        }
    }
}

function compare(FC,MC){
    //console.log("freq in compare: " + FC);
    let least = FC[0]; //index of
    let remove = []; //number of
    let oldest = -1;
    let oldestPlace;

    let x,y,z;
    for(x=1; x<FC.length; x++){
        if(FC[x] < least){
            least = FC[x]; //most holds the lowest freq count
        }
    }

    //console.log("least is:" + least);
    for(y=0; y<FC.length; y++){
        if(FC[y] === least){
            remove.push(y); //the index of the leasts
        }
    }

    //console.log("remove:" + remove);

    if(remove.length === 1){
        return remove[0];
    }else{
        //compare remaining indexes through age

        for(z=0; z < remove.length;z++){
            
            if(MC[remove[z]] > oldest){
                oldest = MC[remove[z]];
                oldestPlace = remove[z];
                //console.log("hi"); 
            }
        }

        return oldestPlace; //position to replace
    }
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


function LFU(event){
    event.preventDefault();

    const fNum = parseInt(document.getElementById('Frames').value);//3;
    console.log("fNum is " + fNum);
    
    let faults = 0;
    let hits = 0;

    let pages = []; //2,3,4,2,1,3,7,5,4,3
    const memory = []; // [ 1 2 3 ]
    const FH = [];

    const memoryCount = []; 
    const freqCount = [];
        //initialize to 0 depending on number of memory frames

    let replace;
    let x,y;

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
    initialize(fNum, memoryCount);
    initialize(fNum, freqCount);

    for(x = 0 ; x < pages.length; x++){
        
        for(y=0; y < fNum && memory[y] != undefined; y++){}
            
        if(y<fNum && memory[y] === undefined){
            //memory is not full
            memory[y] = pages[x];
            count(memory, memoryCount,fNum);
            fcount(y,freqCount); //this works
            faults++;
            FH.push('F');
        }else if(isHit(memory,pages[x])){

            hits++;
            FH.push('H');
            count(memory,memoryCount, fNum);
            fcounthit(memory,pages[x],freqCount); // working
        }else{
            //memory is full, 
            //insert and put back memoryCount, fequentCount to 1
            

            replace = compare(freqCount, memoryCount); //not working, i think its replacing most frequent rigerog
            memory[replace] = pages[x];

            //adjust counts
            //frequency just change to one
            freqCount[replace] = 1;

            //age replace with one and add to others
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

        console.log(memory);
    
    }
    

    document.getElementById("Phit").innerHTML = hits;
    document.getElementById("Pfau").innerHTML = faults;
    document.getElementById("Phprob").innerHTML = hits + "/" + pages.length;
    document.getElementById("Pfprob").innerHTML = faults + "/" + pages.length;
    document.getElementById("PhPerc").innerHTML = hits/pages.length*100 + "%";
    document.getElementById("PfPerc").innerHTML = faults/pages.length*100 + "%";
    console.log(FH);

}


//LFU();        
        
    
    


