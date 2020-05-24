let board = "";
let method = "";

$(document).ready(function(){
    console.log("Ready!");
    $('#equation-input').keyup(renderMathText);
    $('.selectable').click(methodClick);
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
    if(evaluateChange(method)){
        cleanMethodBody();
        //Appends the method view if changed.
        drawCard(method,{});
    }
}

function drawCard(method, args){
    //Draws a card. It maintains values from previous cards if they exist.
    elem = $('.method-body');
    elem.append('<div class="card"></div>');

    elem = $('.card');

    elem.append(`<div class="title" id="card-title-${method}">${getCardTitle(method)}</div>`);
    elem.append(`<div class="formula-box" id="formula-box-${method}"></div>`);
    elem.append(`<div class="graph-container" id="graph-container-${method}"></div>`);
    elem.append(`<div class="card-footer" id="card-footer-${method}"></div>`);
    appendInputs($(`#formula-box-${method}`),args);
    appendGraph($(`#graph-container-${method}`),args)
    appendCleanButton($(`#card-footer-${method}`),args)
}

function getCardTitle(method){
    switch(method){
        case "euler": return "Euler";
        case "enhanced-euler": return "Euler mejorado";
        case "runge-kutta": return "Runge Kutta";
    }
}

function appendInputs(elem,args){
    elem.append(`<div class="container" id="equation"></div>`);
    appendEquation($('#equation'),args);

    elem.append(`<div class="container" id="step"></div>`);
    appendStep($('#step'),args);

    elem.append(`<div class="container" id="start-point"></div>`);
    appendStep($(`#start-point`,args));

    elem.append('<div class="container" id="button"></div>');
    appendButton($('#button'),args);
}

function appendEquation(elem,args){
    elem.append('<label for="equation-input">`dx/dt`</label>');
    elem.append('<textarea class="equation-input" id="equation-input" name="equation-input" rows="1"></textarea>');
}

function appendStep(elem,args){
    elem.append('<label for="step-input">STEP:</label>');
    elem.append('<input type="text" class="text-input" id="step-input" name="step-input">');
}   

function appendStart(elem,args){
    console.log(elem);
    elem.append('<label for="step-input">STEP:</label>');
    elem.append('<input type="text" class="text-input" id="step-input" name="step-input">');
}   

function appendButton(elem,args){
    elem.append('<div class="resolve" id="resolve">Calcular</div>')
    $('#resolve').click(function(){
        let ode = interpretFunction();
    })
}


function interpretFunction(){
    const expr = $('#equation-input').val();
    odeEuler(expr,0,0,0.25,1);
}

function odeEuler(f,x0,t0,h,limit){
    tRange = generatePointArray(t0,limit,h);
    xRange = getZeroArray(tRange);

    for(let i = 0; i < xRange.length - 1; i++){
        //console.log(math.evaluate(f,{x:xRange[i],t:tRange[i]}));
        xRange[i + 1] = xRange[i] + math.evaluate(f,{x:xRange[i],t:tRange[i]})*h;
    }

    pointList = getPointList(tRange,xRange);

    console.log(pointList);

    var g = board.create('curve',[tRange,xRange],{dash:2});
}

function odeEulerImproved(f,x0,t0,h,limit){
    tRange = generatePointArray(t0,limit,h);
    xRange = generatePointArray(t0,limit,h);

    for(let i = 0; i < xRange.length - 1; i++){
        //console.log(math.evaluate(f,{x:xRange[i],t:tRange[i]}));
        xRange[i + 1] = xRange[i] + math.evaluate(f,{x:xRange[i],t:tRange[i]})*h;
    }

    pointList = getPointList(tRange,xRange);

    console.log(pointList);

    var g = board.create('curve',[tRange,xRange],{dash:2});
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

function appendCleanButton(elem,args){
    elem.append('<div class="resolve" id="clear">Limpiar</div>')
    $('#clear').click(function(){
        cleanMethodBody();
        //Appends the method view if changed.
        drawCard(method,{});
    })
}