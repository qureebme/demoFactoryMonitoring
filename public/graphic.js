$(document).ready(function() {
    h = window.screen.availHeight;
    w = window.screen.availWidth;

    var s = Snap(w, h + 200); //drawing board
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

    var s_width = 250; // station width
    var s_height = 150; //station height

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
        });
    //horizontal centre line
    var cLine = s.line(x, y + height / 2 + 150, x + width, y + height / 2 + 150).attr({ //mv dw hr
        stroke: "#000",
        strokeWidth: 4,
        id: "cline",
        opacity: 0
    }); // centre line. make invisible later

    var spread = 50;
    var clipoff = 50;
    var cnvBig = s.rect($("#cline").attr("x1"), Number(cLine.attr("y1")) - spread * 1.3, width, spread * 2.6).attr({
        fill: "#000",
        id: "cnvBig",
        rx: 40,
        ry: 40
    }); // -spread *k,,spread*k*2

    var cnvSm = s.rect(Number($("#cnvBig").attr("x")) + clipoff, Number(cLine.attr("y1")) - spread / 2, width - 2 * clipoff, spread).attr({
        fill: $("#bigrect").attr("fill"),
        id: "cnvSm",
        rx: 15,
        ry: 15
    });

    var c_x = Number(s.select("#cnvBig").attr("x")) + Number(s.select("#cnvBig").attr("width")) / 2;
    var c_y1 = Number(s.select("#cnvBig").attr("y")) + Number(s.select("#cnvBig").attr("height")) + 10; // for hand and proc
    //s.circle(c_x, c_y, 10);

    //UPPER SIDE
    c_y2 = Number(s.select("#cnvBig").attr("y")) - 160; // - 10(spacing) - height_of_asrs// for asrs
    var asrs = s.rect(c_x - 150, c_y2 - 100, 300, 250).attr({
        id: "asrs",
        fill: "#90A4AE"
    }); //asrs station

    //var c_x3 = ;
    var robs = s.rect(x + width - 40 - s_width, s.select("#cnvBig").attr("y") - 160, s_width, s_height).attr({ //mv dw hr
        id: "robs",
        fill: "#90A4AE"
    }); // y + height / 2 - Number($("#bigRect").attr("height")) / 2 - 10 - s_height

    var asse = s.rect(s.select("#robs").attr("x"), s.select("#robs").attr("y") - s_height - 5, s_width, s_height).attr({
        id: "asse",
        fill: "#90A4AE"
    });
    var stor = s.rect(s.select("#asse").attr("x"), s.select("#asse").attr("y") - s_height - 5, s_width, s_height).attr({
        id: "stor",
        fill: "#90A4AE"
    });

    // LOWER SIDE

    var hand = s.rect(c_x - 100, c_y1, s_width, s_height).attr({
        id: "hand",
        fill: "#90A4AE"
    }); // handling station

    var proc = s.rect(s.select("#hand").attr("x"), Number($("#hand").attr("y")) + Number($("#hand").attr("height")) + 5,
        s_width, s_height).attr({
        id: "proc",
        fill: "#90A4AE"
    }); // processing station

    //var c_y3 = ;// for test and dist
    var test = s.rect(Number(s.select("#cnvBig").attr("x")) + 40, c_y1, s_width, s_height).attr({
        id: "test",
        fill: "#90A4AE"
    });

    var dist = s.rect(s.select("#test").attr("x"), Number(s.select("#test").attr("y")) + Number(s.select("#test").attr("height")) + 5,
        s_width, s_height).attr({
        id: "dist",
        fill: "#90A4AE"
    }); // distribution station

    var all = s.group(cnvBig, cnvSm, hand, proc, test, dist, asrs, robs, asse, stor);
    var cnv = s.group(cnvBig, cnvSm).attr({}); // the conveyor

    var procc = s.circle(Number(s.select("#proc").attr("x")) + 100, Number(s.select("#proc").attr("y")) + 75, 65).attr({
            fill: "#ffffff",
            opacity: 0,
            id: "procc"
        }),

        procr1 = s.rect(Number(s.select("#proc").attr("x")) + 90, Number(s.select("#proc").attr("y")) + 10, 20, s.select("#procc").attr("r") * 2).attr({
            fill: "#ffffff",
            rx: 7,
            ry: 7,
            stroke: "#B00020",
            strokeWidth: 2,
            id: "procr1"
        }),

        procr2 = s.rect(Number(s.select("#proc").attr("x")) + 90, Number(s.select("#proc").attr("y")) + 10, 20, s.select("#procc").attr("r") * 2).attr({
            fill: "#ffffff",
            rx: 7,
            ry: 7,
            stroke: "#6200EE",
            strokeWidth: 2,
            id: "procr2"
        }),

        procr3 = s.rect(Number(s.select("#proc").attr("x")) + 90, Number(s.select("#proc").attr("y")) + 10, 20, s.select("#procc").attr("r") * 2).attr({
            fill: "#ffffff",
            rx: 7,
            ry: 7,
            stroke: "#03DAC5",
            strokeWidth: 2,
            id: "procr3"
        }),
        ccc = s.circle(Number(s.select("#proc").attr("x")) + 100, Number(s.select("#proc").attr("y")) + 75, 30).attr({
            fill: "#FFFFFF",
            opacity: 1,
            stroke: "#50FF50",
            strokeWidth: 2
        })


    // GROUPS

    s.select("#procr1").transform("r60"); // 60 deg off procr1
    s.select("#procr3").transform("r120"); // 120 deg off procr1

    var spinner = s.group(procr1, procr2, procr3, ccc).attr({
        id: "spinner"
    }); // make the spinner whole

    //VISIT THIS LATER
    /*
        procc.attr({
            mask: spinner
        })
        */
    spinner.animate({ transform: "r60" }, 0) // turn spinner 60 deg, duration must be included

    //grid, upper line
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
});