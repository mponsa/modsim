let board = "";
let methods = [];

$(document).ready(function(){
    console.log("Ready!");
    $('#equation-input').keyup(renderMathText);
    $('.selectable').click(methodClick);
    drawCard();
})

function renderMathText(){
    let elem = $(this);
    let value = "`" + elem.val() + "`";
    console.log(value);
    elem.html(value);
}

function evaluateChange(){
    return true;
}

function cleanMethodBody(){
    $('.method-body').html("");
}

function methodClick(){
   method = $(this).attr('id');

   if(methods.indexOf(method) == -1){
      methods.push($(this).attr('id'))
      $(this).removeClass('selectable').addClass('selectable-pressed');
   }else{
      methods.splice(methods.indexOf(method));
      $(this).removeClass('selectable-pressed').addClass('selectable');
   }
}

function drawCard(){
    //Draws a card. It maintains values from previous cards if they exist.
    elem = $('.method-body');
    elem.append('<div class="card"></div>');

    elem = $('.card');

    elem.append(`<div class="title" id="card-title">Aproximación númerica de ecuaciones diferenciales</div>`);
    elem.append(`<div class="formula-box" id="formula-box"></div>`);
    elem.append(`<div class="graph-container" id="graph-container"></div>`);
    elem.append(`<div class="card-footer" id="card-footer"></div>`);
    appendInputs($(`#formula-box`));
    appendGraph($(`#graph-container`))
    appendFooter($(`#card-footer`))
}

function appendInputs(elem,args){
    elem.append(`<div class="container" id="equation"></div>`);
    appendEquation($('#equation'),args);

    elem.append(`<div class="container" id="step"></div>`);
    appendStep($('#step'),args);

    elem.append(`<div class="container" id="range-point"></div>`);
    appendRange($('#range-point'),args);

    elem.append('<div class="container" id="button"></div>');
    appendButton($('#button'),args);
}

function appendEquation(elem,args){
    elem.append('<label for="equation-input">`dx/dt`</label>');
    elem.append('<textarea class="equation-input" id="equation-input" name="equation-input" rows="1">2t</textarea>');
}

function appendStep(elem,args){
    elem.append('<label for="step-input">STEP:</label>');
    elem.append('<input type="text" class="text-input" id="step-input" name="step-input" value="0.1">');
}   

function appendRange(elem,args){
    elem.append('<label class="time-range-label" for="">Time Range: </label>');
    elem.append('<div class="range-container" id="range-container"></div>');
    appendRangeInputs($('#range-container'),args)
}

function appendRangeInputs(elem,args){
    elem.append('<div class="range-values" id="range-values"></div>');
    appendRangeValues($('#range-values'));
    elem.append('<input id="time-range" type="range" min="0" value="1" max="10">')
}

function appendRangeValues(elem,args){
    elem.append('<div class="zero-value"> 0 </div>');
    elem.append('<div class="max-value"> 10 </div>');
}

function appendButton(elem,args){
    elem.append('<div class="resolve" id="resolve">Calcular</div>')
    $('#resolve').click(function(){
        let ode = interpretFunction();
    })
}


function interpretFunction(){
    const expr = $('#equation-input').val();
    if(expr == ''){
        alert("No has insertado una ecuación diferencial!");
    }
    let step = parseFloat($('#step-input').val());
    if(step == ''){
        alert("No has definido un valor de step, se utilizara 0.25 por defecto.")
        step = 0.25
    }
    console.log(step);
    if(methods.length == 0){
        alert("No has seleccionado métodos para graficar!");
    }
    const limit = parseInt($('#time-range').val());
    console.log(limit);
    methods.forEach(method => {
        switch(method){
            case "euler": 
                odeEuler(expr,0,0,step,limit);
                break;
            case "enhanced-euler": 
                odeEulerImproved(expr,0,0,step,limit);
                break;
            case "runge-kutta": 
                odeRungeKutta(expr,0,0,step,limit);
                break;
        }
    })
}

function odeEuler(f,x0,t0,h,limit){
    console.log("computing ... Euler method ");
    tRange = generatePointArray(t0,limit,h);
    xRange = getZeroArray(tRange);

    for(let i = 0; i < xRange.length - 1; i++){
        //console.log(math.evaluate(f,{x:xRange[i],t:tRange[i]}));
        xRange[i + 1] = xRange[i] + math.evaluate(f,{x:xRange[i],t:tRange[i]})*h;
    }

    pointList = getPointList(tRange,xRange);

    console.log(pointList);

    var g = board.create('curve',[tRange,xRange],{dash:3,strokeColor:'#429615'});
}

function odeEulerImproved(f,x0,t0,h,limit){
    console.log("computing ... Euler method Improved ");
    tRange = generatePointArray(t0,limit,h);
    xRange = getZeroArray(generatePointArray(t0,limit,h));

    for(let i = 0; i < xRange.length - 1; i++){
        xPred = xRange[i] + math.evaluate(f,{x:xRange[i],t:tRange[i]})*h;
        xRange[i + 1] = xRange[i] + (math.evaluate(f,{x:xRange[i],t:tRange[i]})+math.evaluate(f,{xPred,t:tRange[i+1]}))*(h/2);
    }

    pointList = getPointList(tRange,xRange);

    console.log(pointList);

    var g = board.create('curve',[tRange,xRange],{dash:2,strokeColor:'#e63030'});
}

function odeRungeKutta(f,x0,t0,h,limit){
    console.log("computing ... Runge Kutta method");
    tRange = generatePointArray(t0,limit,h);
    xRange = getZeroArray(generatePointArray(t0,limit,h));

    for(let i = 0; i < xRange.length - 1; i++){
        gamma1 = math.evaluate(f,{x:xRange[i],t:tRange[i]});
        gamma2 = math.evaluate(f,{x:xRange[i]+0.5*h*gamma1,t:tRange[i]+0.5*h});
        gamma3 = math.evaluate(f,{x:xRange[i]+0.5*h*gamma2,t:tRange[i]+0.5*h});
        gamma4 = math.evaluate(f,{x:xRange[i]+gamma3*h,t:tRange[i]+ h});
        xRange[i + 1] = xRange[i] + (gamma1+2*gamma2+2*gamma3+gamma4)*(h/6);
    }

    pointList = getPointList(tRange,xRange);

    console.log(pointList);

    var g = board.create('curve',[tRange,xRange],{dash:2,strokeColor:'#3480eb'});
}

function generatePointArray(start,end,distanceBetweenPoints){
    result = [];
    for(var i = start; i <= end; i += distanceBetweenPoints){
         result.push(i);
     }
    return result;
}

function getZeroArray(array){
    result = [];
    for(var i = 0; i < array.length; i++){
        result.push(0);
    }
    return result;
}



function getPointList(xRange,tRange){
    let result = [];
    for(var i = 0; i < xRange.length; i++){
        let point = [];
        point.push(tRange[i],xRange[i]);
        result.push(point);
    }
    return result;
}

function plot(func,atts){
    if (atts==null) {
        return addCurve(board, func, {strokewidth:2});
     } else {
        return addCurve(board, func, atts);
     }    
}

function addCurve(board, func, atts) {
    var f = board.create('functiongraph', [func], atts);
    return f;
}

function appendGraph(elem,args){
    board = JXG.JSXGraph.initBoard(elem.attr('id'),{
        boundingbox: [-5, 5, 5, -5], axis:true
    });

    const resize = function () {
        board.resizeContainer(board.containerObj.clientWidth, board.containerObj.clientHeight, true);
        board.fullUpdate();
    };

    window.onresize = resize;
}

function appendFooter(elem,args){
    appendOriginalFuncInput(elem,args);
    appendResolveOriginalFunction(elem,args);
    appendCleanButton(elem,args);
}

function appendCleanButton(elem,args){
    elem.append('<div class="resolve" id="clear">Limpiar</div>')
    $('#clear').click(function(){
        cleanMethodBody();
        //Appends the method view if changed.
        drawCard();
    })
}

function appendOriginalFuncInput(elem,args){
    elem.append('<label for="original-equation-input">Función original: </label>');
    elem.append('<textarea class="equation-input" id="original-equation-input" name="original-equation-input" rows="1"></textarea>');
}

function appendResolveOriginalFunction(elem,args){
    elem.append('<div class="resolve" id="resolve-original">Calcular</div>')
    $('#resolve-original').click(function(){
        const expr = $('#original-equation-input').val();
        let c = plot(expr)
    })
}