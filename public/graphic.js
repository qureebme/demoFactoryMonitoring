//$(document).ready(function() {
h = window.screen.availHeight;
w = window.screen.availWidth;


var s = new Snap(w, h + 200).attr({
    viewBox: "0,0,1536,1024",
    preserveAspectRatio: "xMidYMid meet"
}); //scalable drawing board

var x, y, width, height;
x = 0.1 * w;
y = 0.1 * h;
width = 0.8 * w; // 80% of available space
height = 0.8 * h;

/*
    console.log("width:", width)
    console.log("height:", height)
    console.log("width:", w)
    console.log("height:", h)
*/

var s_width = 250, // station width
    s_height = 150, //station height
    stationFill = "#90a4ae";

// var bigRect = s.rect(0, 0, w, h)
var bigRect = s.rect(0, 0, w, h + 200) //our stuff
    .attr({
        fill: "#9e9e9e",
        stroke: "#125470",
        strokeWidth: 5,
        rx: 5,
        ry: 5,
        id: "bigrect",
        opacity: 0.3
    }),
    //horizontal centre line
    cLine = s.line(x, y + height / 2 + 150, x + width, y + height / 2 + 150).attr({ //mv dw hr
        stroke: "#000000",
        strokeWidth: 4,
        id: "cline",
        opacity: 0
    }); // centre line. make invisible later

var spread = 50,
    clipoff = 50;

//Conveyor, outer part
var cnvBig = s.rect($("#cline").attr("x1"), Number(cLine.attr("y1")) - spread * 1.3, width, spread * 2.6).attr({
        fill: "#000000",
        id: "cnvBig",
        rx: 40,
        ry: 40
    }), // -spread *k,,spread*k*2

    //Conveyor, inner part
    cnvSm = s.rect(Number($("#cnvBig").attr("x")) + clipoff, Number(cLine.attr("y1")) - spread / 2, width - 2 * clipoff, spread).attr({
        fill: $("#bigrect").attr("fill"),
        id: "cnvSm",
        rx: 15,
        ry: 15
    });

var c_x = Number(s.select("#cnvBig").attr("x")) + Number(s.select("#cnvBig").attr("width")) / 2, //cnv, middle
    c_y1 = Number(s.select("#cnvBig").attr("y")) + Number(s.select("#cnvBig").attr("height")) + 10; // for hand and proc


//UPPER SIDE
var c_y2 = Number(s.select("#cnvBig").attr("y")) - 160; // - 10(spacing) - height_of_asrs// for asrs
var asrs = s.rect(c_x - 150, c_y2 - 100, 300, 250).attr({
        id: "asrs",
        fill: stationFill
    }), //asrs station

    //robot station
    robs = s.rect(x + width - 40 - s_width, s.select("#cnvBig").attr("y") - 160, s_width, s_height).attr({ //mv dw hr
        id: "robs",
        fill: stationFill
    }), // y + height / 2 - Number($("#bigRect").attr("height")) / 2 - 10 - s_height

    asse = s.rect(s.select("#robs").attr("x"), s.select("#robs").attr("y") - s_height - 5, s_width, s_height).attr({
        id: "asse",
        fill: stationFill
    }), // assembling station

    stor = s.rect(s.select("#asse").attr("x"), s.select("#asse").attr("y") - s_height - 5, s_width, s_height).attr({
        id: "stor",
        fill: stationFill
    }); // storing station


// LOWER SIDE
var hand = s.rect(c_x - 100, c_y1, s_width, s_height).attr({
        id: "hand",
        fill: stationFill
    }), // handling station

    proc = s.rect(s.select("#hand").attr("x"), Number($("#hand").attr("y")) + Number($("#hand").attr("height")) + 5,
        s_width, s_height).attr({
        id: "proc",
        fill: stationFill
    }), // processing station

    test = s.rect(Number(s.select("#cnvBig").attr("x")) + 40, c_y1, s_width, s_height).attr({
        id: "test",
        fill: stationFill
    }), // testing station

    dist = s.rect(s.select("#test").attr("x"), Number(s.select("#test").attr("y")) + Number(s.select("#test").attr("height")) + 5,
        s_width, s_height).attr({
        id: "dist",
        fill: stationFill
    }); // distribution station

var cnv = s.group(cnvBig, cnvSm).attr({}); // the conveyor

// PROCESSING STATION COMPONENTS

var procc = s.circle(Number(s.select("#proc").attr("x")) + 100, Number(s.select("#proc").attr("y")) + 75, 65).attr({
        fill: "#ffffff",
        opacity: 0,
        id: "procc"
    }), // the bounding circle, hidden

    flange0 = s.rect(Number(s.select("#proc").attr("x")) + 90, Number(s.select("#proc").attr("y")) + 10, 20, s.select("#procc").attr("r") * 2).attr({
        fill: "#ffffff",
        rx: 7,
        ry: 7,
        strokeWidth: 2,
        id: "flan1"
    }), // flange 1

    hole1 = s.circle(Number(s.select("#proc").attr("x")) + 100, Number(s.select("#proc").attr("y")) + 20, 8).attr({ fill: stationFill }),

    hole2 = s.circle(Number(s.select("#proc").attr("x")) + 100, Number(s.select("#proc").attr("y")) + 130, 8).attr({ fill: stationFill }),

    flange1 = s.group(flange0, hole1, hole2).attr({ stroke: "#b00020" }),

    flange2 = flange1.clone().attr({
        stroke: "#6200ee",
        id: "flan2"
    }), //flange 2

    flange3 = flange1.clone().attr({
        stroke: "#03dac5",
        id: "flan3"
    }), // flange 3

    ccc = s.circle(Number(s.select("#proc").attr("x")) + 100, Number(s.select("#proc").attr("y")) + 75, 30).attr({
        fill: "#ffffff",
        opacity: 1,
        stroke: "#50ff50",
        strokeWidth: 2,
        id: "ccc"
    }), // the centre circle

    drill1_1 = s.rect(Number(s.select("#proc").attr("x")), Number(s.select("#proc").attr("y")) + 30, 5, 20).attr({
        fill: "#000000",
        opacity: 1
    }),

    drill1_2 = s.rect(Number(s.select("#proc").attr("x")), Number(s.select("#proc").attr("y")) + 36, 10, 8).attr({
        fill: "#000000",
        opacity: 1
    }),
    drill2_1 = s.rect(Number(s.select("#proc").attr("x")), Number(s.select("#proc").attr("y")) + 90, 5, 20).attr({
        fill: "#000000",
        opacity: 1
    }),

    drill2_2 = s.rect(Number(s.select("#proc").attr("x")), Number(s.select("#proc").attr("y")) + 96, 10, 8).attr({
        fill: "#000000",
        opacity: 1
    }); // end of processing station components

// rotate the flanges into position
s.select("#flan2").transform("r60"); // 60 deg off flange1
s.select("#flan3").transform("r120"); // 120 deg off flange1

var spinner = s.group(flange1, flange2, flange3, ccc).attr({
    id: "spin"
}).attr({
    opacity: 1
}); // make the spinner whole


var bb = spinner.getBBox();
var mat = new Snap.Matrix();
//s.circle(bb.cx, bb.cy, 5).attr({ opacity: 0.5 }); //centre circle

const unitTurn = 5; //degrees
setInterval(() => {
    mat.rotate(unitTurn, bb.cx, bb.cy);
    for (let i = 0; i < 60 / unitTurn; i++) {

        s.select("#spin").animate({ transform: mat }, 5);
    }
}, 100);


// HANDLING STATION COMPONENTS
var arm = s.rect(Number(s.select("#hand").attr("x")) + 50, Number(s.select("#hand").attr("y")) - 5, 10, 185).attr({
        id: "harm"
    }),
    /*
        handc = s.circle(Number(s.select("#hand").attr("x")) + 60, Number(s.select("#hand").attr("y")) + 100, 30).attr({
            id: "handb",
            fill: "#03d866",
            opacity: 0.9
        }),*/

    hgext = s.rect(Number(s.select("#harm").attr("x")) + 10, Number(s.select("#harm").attr("y")) + Number(s.select("#harm").attr("height")) - 20, 7, 25).attr({
        opacity: 0.5,
        fill: "#6200ee",
        stroke: "#ffffff",
        strokeWidth: 1
    }),

    hgrip1 = s.rect(Number(s.select("#harm").attr("x")) + 15, Number(s.select("#harm").attr("y")) + Number(s.select("#harm").attr("height")) - 20, 10, 5).attr({
        id: "hgrip1",
        stroke: "#ffffff",
        strokeWidth: 1
    }),

    hgrip2 = s.rect(Number(s.select("#harm").attr("x")) + 15, Number(s.select("#harm").attr("y")) + Number(s.select("#harm").attr("height")), 10, 5).attr({
        id: "hgrip2",
        stroke: "#ffffff",
        strokeWidth: 1
    }),

    hslide1 = s.rect(Number(s.select("#harm").attr("x")) + 35, Number(s.select("#harm").attr("y")) + 10, 50, 20).attr({
        rx: 2,
        ry: 2,
        fill: "#ffffff",
        stroke: "#6200ee"
    }),
    hslide2 = s.rect(Number(s.select("#harm").attr("x")) + 35, Number(s.select("#harm").attr("y")) + 40, 50, 20).attr({
        rx: 2,
        ry: 2,
        fill: "#ffffff",
        stroke: "#6200ee"
    }),
    gbase = s.rect(s.select("#hand").attr("x"), s.select("#hand").attr("y"), 10, s.select("#hand").attr("height"))

// HANDLING STATION GROUPS
var gripper_h = s.group(hgrip1, hgrip2, hgext); //gripper, handling station


// DISTRIBUTING STATION COMPONENTS
var holder = s.rect(Number(s.select("#dist").attr("x")) + 30, Number(s.select("#dist").attr("y")) + 100, 180, 30).attr({
        id: "holder",
        stroke: "#ffffff",
        strokeWidth: 1,
        fill: "#6200ee",
        opacity: 0.5
    }),

    cylinder = s.rect(s.select("#holder").attr("x"), s.select("#holder").attr("y"), 50, s.select("#holder").attr("height")).attr({
        fill: "#03dac5",
        id: "cyl",
    }),

    piston = s.rect(Number(s.select("#holder").attr("x")) + 10, Number(s.select("#holder").attr("y")) + 12, 65, 8).attr({
        opacity: 1,
        id: "piston"
    }),

    piston_ = s.rect(Number(s.select("#piston").attr("x")), Number(s.select("#cyl").attr("y")) + 2, 5, 26),

    mag = s.circle(Number(s.select("#holder").attr("x")) + 90, Number(s.select("#holder").attr("y")) + 15, 13).attr({
        fill: "#b00020",
        opacity: 0.6
    }),

    hook = s.circle(Number(s.select("#dist").attr("x")) + Number(s.select("#dist").attr("width")) - 100,
        Number(s.select("#dist").attr("y")) + Number(s.select("#dist").attr("height")) - 100, 10).attr({
        id: "hook",
        fill: "#b00020"
    }),
    swivel = s.rect(Number(s.select("#hook").attr("cx")) - 40, Number(s.select("#hook").attr("cy")) - 3, 40, 5).attr({
        fill: "#ffffff"
    }),

    cylinder2 = s.rect(Number(s.select("#hook").attr("cx")) + 20, Number(s.select("#hook").attr("cy")) - 70, 25, 70).attr({
        fill: "#ffffff",
        id: "cyl2"
    }),

    piston2_ = s.rect(Number(s.select("#cyl2").attr("x")), Number(s.select("#cyl2").attr("y")) + Number(s.select("#cyl2").attr("height")) - 7, 25, 7).attr({
        id: "pist2_"
    }),

    piston2 = s.rect(Number(s.select("#cyl2").attr("x")) + 10, s.select("#cyl2").attr("y"), 5, 63);

//TESTING STATION COMPONENTS
var testBase = s.circle(Number(s.select("#cyl2").attr("x")) + 12.5, Number(s.select("#cyl2").attr("y")) - 12.5, 12.5).attr({
        fill: "#b00020"
    }),

    upperSlide = s.rect(Number(s.select("#cyl2").attr("x")), Number(s.select("#cyl2").attr("y")) - 140, 25, 110),

    sensor1 = s.rect(Number(s.select("#cyl2").attr("x")) - 4, Number(s.select("#pist2_").attr("y")) + 13, 20, 7).attr({
        id: "sens1"
    }),

    sensor2 = sensor1.clone().attr({
        x: Number(s.select("#cyl2").attr("x")) - 10,
        y: Number(s.select("#sens1").attr("y")) + 12,
        fill: "#ff5555",
        id: "sens2"
    });
s.select("#sens1").transform("r15");
s.select("#sens2").transform("r30");

// STORING STATION COMPONENTS
var rr = 8, // radius of the circles
    transMatrix1 = new Snap.Matrix(),
    transMatrix2 = new Snap.Matrix();

var storBox = stor.getBBox(),
    point = s.circle(storBox.x2 - 100, storBox.y + 75, 2.5).attr({ id: "pt" }),

    cp = [s.select("#pt").attr("cx"), s.select("#pt").attr("cy")], //center coords of point

    line0 = s.line(cp[0] + 10, cp[1], storBox.x + 10, cp[1]).attr({ //hidden line, used for placing circles
        strokeWidth: 2,
        stroke: "#000000",
        id: "line0",
        opacity: 0

    }),
    c0 = s.circle(Number(s.select("#line0").attr("x2")) + rr, s.select("#line0").attr("y2"), rr).attr({
        opacity: 1,
        fill: "#90a4ae" // matches the bg
    }),

    gr0 = s.group(line0, c0).attr({}), // a (hidden) line with a circle on its end

    gr1 = gr0.clone().attr({
        stroke: "#b00020",
        transform: "r-50",
        id: "line1",
        opacity: 1
    }), // lowest

    gr2 = gr0.clone().attr({
        stroke: "#6200ee",
        transform: "r-30",
        id: "line2",
        opacity: 1
    }),

    gr3 = gr0.clone().attr({
        stroke: "#03dac5",
        transform: "r-10",
        id: "line3",
        opacity: 1
    }),

    gr4 = gr0.clone().attr({
        stroke: "#b00020",
        transform: "r10",
        id: "line4",
        opacity: 1
    }),

    gr5 = gr0.clone().attr({
        stroke: "#6200ee",
        transform: "r30",
        id: "line5",
        opacity: 1
    }),

    gr6 = gr0.clone().attr({
        stroke: "#03dac5",
        transform: "r50",
        id: "line6",
        opacity: 1
    }); // highest
transMatrix1.translate(10, 0);
transMatrix2.translate(20, 0);

var bigGr = s.group(gr1, gr2, gr3, gr4, gr5, gr6).attr({
        id: "bg1"
    }),

    bigGr2 = bigGr.clone().attr({ //middle layer of circles
        transform: transMatrix1,
        id: "bg2"
    }),

    bigGr3 = bigGr2.clone().attr({ //top layer of circles
        transform: transMatrix2,
        id: "bg3"
    });

s.circle(Number(s.select("#pt").attr("cx")) + 10, s.select("#pt").attr("cy"), 2.5).attr({ fill: "#FFFFFF" }); //second dot
s.circle(Number(s.select("#pt").attr("cx")) + 20, s.select("#pt").attr("cy"), 2.5).attr({ fill: "#FFFFFF" }); //third dot
s.rect(cp[0] - 5, cp[1] - 5, 30, 10).attr({
    opacity: 0.5,
    rx: 2,
    ry: 2
}); // layer over 3 points

var armMatrix = new Snap.Matrix();
armMatrix.rotate(10, cp[0], cp[1]);
armMatrix.translate(0, 0, 0);

var s_arm = s.line(s.select("#pt").attr("cx") - 70, s.select("#pt").attr("cy"), s.select("#pt").attr("cx"), s.select("#pt").attr("cy")).attr({ //robot arm
        id: "s_arm",
        stroke: "#000000",
        strokeWidth: 4,
        transformm: armMatrix
    }),
    s_grip = s.path(),

    bx0 = s_arm.getBBox();
console.log("bx0:: ", bx0)

var gr_2 = s.line(bx0.x, bx0.y - 7, bx0.x, Number(bx0.y) + 7).attr({ //gripper, base
        stroke: "#000000",
        strokeWidth: 4
    }),

    bx2 = gr_2.getBBox(),

    gr_u = s.line(bx2.x - 10, bx2.y, bx2.x, bx2.y).attr({ //gripper,upper side
        stroke: "#000000",
        strokeWidth: 4
    }),

    gr_d = s.line(bx2.x - 10, bx2.y2, bx2.x, bx2.y2).attr({ //gripper, down side
        stroke: "#000000",
        strokeWidth: 4
    }),

    gripper_s = s.group(s_arm, gr_2, gr_u, gr_d)


//s.select("#s_arm").animate({ transform: armMatrix }, 5000)




////////////////////////////////////////////////////////////////////////////
//var dd = hook.getBBox()
//console.log("dd:::", dd);

//spinner.animate({ transform: "rotate(0 600 5)" }, 3000) // turn spinner 60 deg, duration must be included
//spinner.transform('R60,768.0000000000001,867', 5000) //does it but no anime
//s.select("#spinner").animate???
/*
    var x = proc.attr("x"),
        y = proc.attr("y");
    s.circle(x, y, 5)
*/




/*
s.rect(bb.x, bb.y, bb.x2 - bb.x, bb.y2 - bb.y).attr({
    strokeWidth: 1,
    opacity: 0.5
}); // draw bounding box
*/

////////////////////////////////////////////////////////////////////////////
//grid, upper line
/*
    var r = 10;
    var gridLine1 = s.group(
        s.circle(x, y, r),
        s.circle(x + width / 4, y, r),
        s.circle(x + width / 2, y, r),
        s.circle(x + width * 0.75, y, r),
        s.circle(x + width, y, r)
    )

    //grid, middle line
    var gridLine2 = s.group(
        s.circle(x, y + height / 2, r),
        s.circle(x + width / 4, y + height / 2, r),
        s.circle(x + width / 2, y + height / 2, r),
        s.circle(x + width * 0.75, y + height / 2, r),
        s.circle(x + width, y + height / 2, r)
    )

    //grid, lower line
    var gridLine3 = s.group(
        s.circle(x, y + height, r),
        s.circle(x + width / 4, y + height, r),
        s.circle(x + width / 2, y + height, r),
        s.circle(x + width * 0.75, y + height, r),
        s.circle(x + width, y + height, r)
    )
    gridLine1.attr({ opacity: 0 });
    gridLine2.attr({ opacity: 0 });
    gridLine3.attr({ opacity: 0 });
*/
//});