import excel from './stuf.js';
import './style.css';

function component() {
    var element = document.createElement('DIV');

    var para01 = document.createElement("P");
    var text01 = document.createTextNode("Excel (tab als scheidingsteken)");
    para01.appendChild(text01);
    para01.addEventListener("click", excel);

    var input = document.createElement("TEXTAREA");
    input.id = 'excel_data';
    input.addEventListener("click", excel);
    input.addEventListener("change", excel);
    input.addEventListener("keyup", excel);

    var para02 = document.createElement("P");
    var text02 = document.createTextNode("Historiegrafiek");
    para02.appendChild(text02);

    var canvas = document.createElement("CANVAS");
    canvas.id = 'historie';
    canvas.width = 900;
    canvas.height = 400;


    element.appendChild(para01);
    element.appendChild(input);
    element.appendChild(para02);
    element.appendChild(canvas);

    return element;
}

let element = component(); // Store the element to re-render on print.js changes
document.body.appendChild(element);

if (module.hot) {
    module.hot.accept('./stuf.js', function () {
        console.log('Accepting the updated excel module!');
        excel();
        document.body.removeChild(element);
        element = component(); // Re-render the "component" to update the click handler
        document.body.appendChild(element);
    })
}
