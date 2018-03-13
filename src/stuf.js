export default function excel() {
    console.log("called at: " + Date.now().toLocaleString());
    var yAs = new Set();
    var xAs = new Set();
    var historie = [];


    // Accepteer copy-paste vanuit Excel in de textarea
    var data = document.getElementById('excel_data').value;
    var separator;
    if (data.indexOf("\t") >= 0) {
        separator = "\t";
    } else if (data.indexOf(";") >= 0) {
        separator = ";";
    } else if (data.indexOf(",") >= 0) {
        separator = ",";
    }
    var rows = data.split("\n");
    if (rows.length > 1) {
        var headers;
        for(var y in rows) {
            if (rows[y].length > 0) {
                var cells = rows[y].split(separator);
                if (headers && cells.length == headers.length) {
                    var voorkomen = {};
                    for (var i = 0; i < cells.length; i++) {
                        voorkomen[headers[i].trim()] = cells[i].trim().length == 0 ? null : cells[i].trim();
                    }
                    historie.push(voorkomen);
                } else if (!headers) {
                    headers = cells;
                }
            }
        }
    }

    // Stel gesorteerde unieke formele (yAs) en materiele (xAs) lijsten tijdstippen op
    yAs = new Set();
    xAs = new Set();
    for (var voorkomen of historie) {
        yAs.add(voorkomen.tijdstipRegistratie);
        if (voorkomen.eindRegistratie) {
            yAs.add(voorkomen.eindRegistratie);
        }
        xAs.add(voorkomen.beginGeldigheid);
        if (voorkomen.eindGeldigheid) {
            xAs.add(voorkomen.eindGeldigheid);
        }
    }
    yAs = Array.from(yAs);
    yAs.sort();
    xAs = Array.from(xAs);
    xAs.sort();

    // Teken het raster
    const xOffset = 150;
    var c = document.getElementById("historie");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle="black";
    const yUnit = 360/yAs.length;
    var yCoordinates = {};
    for (i = yAs.length; i > 0; i--) {
        ctx.beginPath();
        ctx.moveTo(xOffset +  0, yUnit * i);
        ctx.lineTo(xOffset + 720, yUnit * i);
        ctx.stroke();
        ctx.font="10px Helvetica";
        ctx.fillText(yAs[yAs.length - i], 0, yUnit * i);
        yCoordinates[yAs[yAs.length - i]] = yUnit * i;
    }
    const xUnit = 720/xAs.length;
    var xCoordinates = {};
    for (i = 0; i < xAs.length; i++) {
        ctx.beginPath();
        ctx.moveTo(xOffset + xUnit * i,   0);
        ctx.lineTo(xOffset + xUnit * i, 360);
        ctx.stroke();
        ctx.fillText(xAs[i], xOffset + xUnit * i, 380);
        xCoordinates[xAs[i]] = xOffset + xUnit * i;
    }

    // Teken de historie in het raster (met een paar pixels marge zodat het raster zichtbaar blijft)
    for (var voorkomen of historie) {
        var f = voorkomen.tijdstipRegistratie;
        var y = yCoordinates[f];
        var m = voorkomen.beginGeldigheid;
        var x = xCoordinates[m];
        var h = (voorkomen.eindRegistratie ? yAs.indexOf(voorkomen.eindRegistratie) : yAs.length) - yAs.indexOf(voorkomen.tijdstipRegistratie);
        var w = (voorkomen.eindGeldigheid  ? xAs.indexOf(voorkomen.eindGeldigheid ) : xAs.length) - xAs.indexOf(voorkomen.beginGeldigheid );
        ctx.fillStyle= voorkomen.eindRegistratie ? "red" : voorkomen.eindGeldigheid ? "green" : "blue";
        ctx.fillRect(x+4, y+4-h*yUnit, w*xUnit-8, h*yUnit-8);
        ctx.fillStyle="white";
        ctx.font="20px Helvetica";
        ctx.fillText(voorkomen.gegevens ? voorkomen.gegevens : voorkomen.waarde, x+1 + 20, y+1 - 20);
    }
}

