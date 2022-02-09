let dSeqs= [[],[],[],[]];
let dRates= [0,0,0,0];

let SFs= [4,4,4,4];
let OVSFs= [[],[],[],[]];
let TX_signals=[[],[],[],[]];
let MuxSignal=[];
let reformat_MuxSignal=[];

let OVSF_4 = [[1,1,1,1],[1,1,-1,-1],[1,-1,1,-1],[1,-1,-1,1]];
let scaler = [1,-1];
let sf_values=[1,2,4,8,16,32,64,128,256];

let xArray = [0];
let yArray = [];
let maxsf;
let maxseq=0;
let sfmaxindex;

let calc_SF = (datarate)=>{
    return sf=3.84*1000/datarate;
};


let generate_ovsf= (sf,user)=>{
    let  ovsf = OVSF_4[user-1];
    if(sf<4) return "the data rate is more than cacpacity of system";
    else if(sf>256) return "the data rate is very small";
    else {
        for(let i=2;i<9;i++){
            if(sf>sf_values[i-1]&&sf<sf_values[i])sf=sf_values[i];
            if(sf==sf_values[i]){
                for(let j=3;j<=i;j++){
                    let n = Math.round(Math.random());
                    ovsf = ovsf.concat(ovsf.map(x => x * scaler[n])) ;
                }
                OVSFs[user-1]=ovsf;
            }
        }
    }
};


let generate_TX_Signal= ()=>{
    maxsf = Math.max(...SFs);
    sfmaxindex = SFs.indexOf(Math.max(...SFs));

    for(let j=0;j<4;j++){
        let dataSeqLen = dSeqs[j].length;
        let codeLen = OVSFs[j].length;

        let TX_signal = [];
        for(let i=0;i<dataSeqLen;i++){
            for(let k=0;k<codeLen;k++)TX_signal.push(dSeqs[j][i]*OVSFs[j][k])
        }
        TX_signals[j]=TX_signal;
    }
    };
    

let downlink_Mux_signal2= ()=>{
    MuxSignal = MuxSignal.concat(TX_signals[0]);
    let length = MuxSignal.length;

    for(let i=1;i<4;i++){
        for(let j=0;j<length;j++)
            MuxSignal[j] += TX_signals[i][j];
    }
    console.log("MuxSignal",MuxSignal);
};

let reformat_Mux = ()=>{
    let ln = MuxSignal.length;

    for(let i = 0 ;i<ln;i++){
        for(let j = 0 ;j<2;j++)yArray.push(MuxSignal[i]);
    }
    
    console.log("yArray",yArray);
    for(let i = 1 ;i<=ln;i++){
        for(let j = 0 ;j<2;j++)xArray.push(i);
    }
    console.log("xArray",xArray);

};

let plot_mux = ()=>{
    var data = [{
    x: xArray,
    y: yArray,
    mode:"lines"
  }];
  
  // Define Layout
  var layout = {
    xaxis: {range: [0, maxseq*maxsf], title: "xaxis"},
    yaxis: {range: [-5, 5], title: "yaxis"},  
    title: "Transmitted signal (Downlink case)"
  };
  
  // Display using Plotly
  Plotly.newPlot("myPlot", data, layout);

};


const getValueInput = () =>{
     xArray = [0];
     yArray = [];
    for(let i=0;i<4;i++){
        let temp = document.getElementById(`dsi${i+1}`).value; 
        dSeqs[i] = temp.split` `.map(x=>+x);
        if(dSeqs[i].length>maxseq)maxseq=dSeqs[i].length;
        dRates[i] = document.getElementById(`dri${i+1}`).value; 
        SFs[i] = 3.84*1000/dRates[i];
    };
    for(let i=0;i<4;i++){
        document.getElementById(`dro${i+1}`).innerHTML += dRates[i]; 
        document.getElementById(`dso${i+1}`).innerHTML += dSeqs[i]; 
        document.getElementById(`SF${i+1}`).innerHTML += SFs[i];
        generate_ovsf(SFs[i],i+1);
        generate_TX_Signal();
        document.getElementById(`OVSF${i+1}`).innerHTML += OVSFs[i];  
        
    };
  }

  const out = () =>{
    downlink_Mux_signal2();
    reformat_Mux();
    plot_mux();
    console.log("data sequences",dSeqs);
    console.log("data rates",dRates);
    console.log("sf:",SFs);
    console.log("OVSFs:",OVSFs);
    console.log("Tx signals:",TX_signals);
    console.log("Mux signal:",MuxSignal);
    console.log("reformating Mux signal:",reformat_MuxSignal);


  }

