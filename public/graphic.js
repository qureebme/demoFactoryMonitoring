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
    }); // centre line

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
    }),

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
    }); // the centre circle


// rotate the flanges into position
s.select("#flan2").transform("r60"); // 60 deg off flange1
s.select("#flan3").transform("r120"); // 120 deg off flange1

var spinner = s.group(flange1, flange2, flange3, ccc).attr({
    id: "spin"
}).attr({
    opacity: 1
}); // make the spinner whole

// drilling mach
let base = s.rect(s.select("#proc").attr("x") - 15, Number(s.select("#proc").attr("y")) + 35, 25, 24).attr({
        fill: "blue",
    }),

    jjc = s.line(Number(s.select("#proc").attr("x")) + 10, Number(s.select("#proc").attr("y")) + 47, Number(s.select("#proc").attr("x")) + 27, Number(s.select("#proc").attr("y")) + 47).attr({
        stroke: "#6200ee",
        strokeWidth: 4,
    })

s.path("M678 827 l 10 10 l 0 4 L 678 851").attr({
    stroke: "black",
})

let jjd = s.line(695, Number(s.select("#proc").attr("y")) + 47, 701, Number(s.select("#proc").attr("y")) + 47).attr({
        stroke: "#b00020",
        strokeWidth: 6,
    }) // reddish tip

s.line(Number(s.select("#proc").attr("x")), Number(s.select("#proc").attr("y")) + 103, Number(s.select("#proc").attr("x")) + 100, Number(s.select("#proc").attr("y")) + 103).attr({
    stroke: "black",
})

//gripping mach
let body = s.rect(Number(s.select("#proc").attr("x")) + 5, Number(s.select("#proc").attr("y")) + 93, 25, 20).attr({
        rx: 3,
        ry: 3,
        fill: "black",
    }),

    bodyBox = body.getBBox(body),

    plungerRod = s.line(bodyBox.x - 10, bodyBox.cy, bodyBox.x2 + 5, bodyBox.cy).attr({
        strokeWidth: 5,
        stroke: "black",
    }),

    plunBox = plungerRod.getBBox(),

    capR = s.line(plunBox.x2 - 1, plunBox.y2 - 5, plunBox.x2 - 1, plunBox.y2 + 5).attr({
        strokeWidth: 5,
        stroke: "black",
    }),
    capL = s.line(plunBox.x, plunBox.y - 5, plunBox.x, plunBox.y + 5).attr({
        strokeWidth: 5,
        stroke: "black",
    }),
    plunger = s.group(capL, plungerRod, capR);


var bb = spinner.getBBox();
var mat = new Snap.Matrix();
//s.circle(bb.cx, bb.cy, 5).attr({ opacity: 0.5 }); //centre circle

const unitTurn = 6; //degrees
setInterval(function() {
    mat.rotate(unitTurn, bb.cx, bb.cy);
    //for (let i = 0; i < 60 / unitTurn; i++) {

    s.select("#spin").animate({ transform: mat }, 5);
    //}
}, 100);


// HANDLING STATION COMPONENTS
let handler = s.rect(Number(s.select("#hand").attr("x")) + 50, Number(s.select("#hand").attr("y")) - 5, 16, 183).attr({
        id: "handler",
        rx: 5,
        ry: 5,
        fill: "white",
        stroke: "#6200ee",
        strokeWidth: 4
    }), //anim to h=~185 to reach nxt station

    wkpc = s.circle(Number(s.select("#handler").attr("x")) + 8, Number(s.select("#handler").attr("y")) + Number(s.select("#handler").attr("height")) - 10, 8).attr({
        fill: "red"
    }),

    ggg = s.group(handler, wkpc);
console.log("ggg: ", wkpc.attr("cy"))

setInterval(
    function() {
        wkpc.animate({ cy: 627 }, 2000, mina.easein, function() {
            this.animate({ cy: 805 }, 2000)
        })
        handler.animate({ height: 5 }, 2000, mina.easein, function() {
            this.animate({ height: 183 }, 2000)
        })
    }, 5000
)


// HANDLING STATION GROUPS


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
    transMatrix2 = new Snap.Matrix().translate(10, 0),
    transMatrix3 = new Snap.Matrix().translate(20, 0);

var storBox = stor.getBBox(),
    point = s.circle(storBox.x2 - 100, storBox.y + 75, 2.5).attr({ id: "pt" }),

    cp = [s.select("#pt").attr("cx"), s.select("#pt").attr("cy")], //center coords of point

    lev1_color = "#03dac5",
    lev2_color = "#b00020", //reddish brown
    lev3_color = "#6200ee", //deep blue

    line0 = s.line(cp[0] + 10, cp[1], storBox.x + 10, cp[1]).attr({ //hidden line, used for placing circles
        strokeWidth: 2,
        stroke: "#000000",
        id: "line0",
        opacity: 0

    }),
    c0 = s.circle(Number(s.select("#line0").attr("x2")) + rr, s.select("#line0").attr("y2"), rr).attr({
        opacity: 1,
        fill: "#90a4ae", // matches the bg
        strokeWidth: 2
    }),

    gr0 = s.group(line0, c0).attr({}), // a (hidden) line with a circle on its end

    gr0b = gr0.clone().attr({
        stroke: lev2_color,
        opacity: 0,
    }),

    gr0c = gr0.clone().attr({
        stroke: lev3_color,
        opacity: 0,
    }),

    gr1a = gr0.clone().attr({
        transform: "r-55",
        id: "line1",
        opacity: 1,
        stroke: lev1_color,

    }), // lowest

    gr1b = gr0.clone().attr({
        transform: "r-30",
        id: "line2",
        opacity: 1,
        stroke: lev1_color,
    }),

    gr1c = gr0.clone().attr({
        transform: "r-10",
        id: "line3",
        opacity: 1,
        stroke: lev1_color,
    }),

    gr1d = gr0.clone().attr({
        transform: "r10",
        id: "line4",
        opacity: 1,
        stroke: lev1_color,
    }),

    gr1e = gr0.clone().attr({
        transform: "r30",
        id: "line5",
        opacity: 1,
        stroke: lev1_color,
    }),

    gr1f = gr0.clone().attr({
        transform: "r55",
        id: "line6",
        opacity: 1,
        stroke: lev1_color,
    }), // highest

    gr2a = gr1a.clone().attr({ stroke: lev2_color, transform: "r-55", }),
    gr2b = gr1b.clone().attr({ stroke: lev2_color, transform: "r-30", }),
    gr2c = gr1c.clone().attr({ stroke: lev2_color, transform: "r-10", }),
    gr2d = gr1d.clone().attr({ stroke: lev2_color, transform: "r10", }),
    gr2e = gr1a.clone().attr({ stroke: lev2_color, transform: "r30", }),
    gr2f = gr1b.clone().attr({ stroke: lev2_color, transform: "r55", }),

    gr3a = gr1a.clone().attr({ stroke: lev3_color, transform: "r-55", }),
    gr3b = gr1b.clone().attr({ stroke: lev3_color, transform: "r-30", }),
    gr3c = gr1c.clone().attr({ stroke: lev3_color, transform: "r-10", }),
    gr3d = gr1d.clone().attr({ stroke: lev3_color, transform: "r10", }),
    gr3e = gr1a.clone().attr({ stroke: lev3_color, transform: "r30", }),
    gr3f = gr1b.clone().attr({ stroke: lev3_color, transform: "r55", });


var bigGr = s.group(gr1a, gr1b, gr1c, gr1d, gr1e, gr1f).attr({ id: "bg1", }), //level1

    bigGr2 = s.group(gr2a, gr2b, gr2c, gr2d, gr2e, gr2f).attr({ transform: transMatrix2 }), //level2

    bigGr3 = s.group(gr3a, gr3b, gr3c, gr3d, gr3e, gr3f).attr({ transform: transMatrix3 }); //level3

s.circle(Number(s.select("#pt").attr("cx")) + 10, s.select("#pt").attr("cy"), 2.5).attr({ fill: "#FFFFFF" }); //second dot
s.circle(Number(s.select("#pt").attr("cx")) + 20, s.select("#pt").attr("cy"), 2.5).attr({ fill: "#FFFFFF" }); //third dot
s.rect(cp[0] - 5, cp[1] - 5, 30, 10).attr({
    opacity: 0.5,
    rx: 2,
    ry: 2
}); // layer over 3 points
/*
var armMatrix = new Snap.Matrix();
armMatrix.rotate(10, cp[0], cp[1]);
armMatrix.translate(0, 0, 0);
*/

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