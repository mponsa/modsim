let board = "";

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
    let method = $(this).attr('id');
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
    appendInputs($(`#formula-box-${method}`),args);
    appendGraph($(`#graph-container-${method}`),args)
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

    elem.append('<div class="container" id="button"></div>');
    appendButton($('#button'),args);
}

function appendEquation(elem,args){
    console.log(elem)
    elem.append('<label for="equation-input">$$ dx/dt $$</label>');
    elem.append('<textarea class="equation-input" id="equation-input" name="equation-input" rows="1"></textarea>');
}

function appendButton(elem,args){
    elem.append('<div class="resolve" id="resolve">Calcular</div>')
    $('#resolve').click(function(){
        let ode = interpretFunction();
    })
}

function interpretFunction(){
    const expr = $('#equation-input').val();
    let c = plot(expr)
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