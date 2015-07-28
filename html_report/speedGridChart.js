if (!d3.chart) d3.chart = {};

d3.chart.speedGridChart = function() {

    var width = 600;
    var height = 600;
    var padding = 30; 
    var dispatch = d3.dispatch(chart, "select");
    var data;

    function sizeText(x)
    {
        if (x < 1024) return x + "B";
        x /= 1024;
        if (x < 1024) return x + "kB";
        x /= 1024;
        if (x < 1024) return x + "MB";
        x /= 1024;
        if (x < 1024) return x + "GB";
    }

    function chart(container) {
        var points = [];
        data.forEach(function(test){

            var time = test.threads[test.threads.length-1][0];
            var iterations = d3.sum(test.threads[test.threads.length-1].slice(1));

            if (time < 1) return;

            points.push({
                id: test.id,
                threads: test.threads[0].length-1,
                size: test.content_size,
                speed: test.content_size*iterations*1000.0/time
            });
        });

        points.sort(function(a, b){return a.speed-b.speed})

        var sizeValues = d3.set(points.map(function(d){return d.size})).values();
        var threadsValues = d3.set(points.map(function(d){return d.threads})).values();
        var speedExtent = d3.extent(points, function(d) {return d.speed});

        var d = d3.min([(width-padding*2) / sizeValues.length, (height-padding*2) / threadsValues.length]) - 2;    

        var sizeScale = d3.scale.ordinal().domain(sizeValues).rangePoints([d/2+padding,width-d/2-padding]);
        var threadsScale = d3.scale.ordinal().domain(threadsValues).rangePoints([d/2+padding,height-d/2-padding]);
        var speedScale = d3.scale.linear().domain(speedExtent).range([10,d]);

        var svg = container.append("svg")
            .classed("grid-chart", true)
            .attr({
                width: width,
                height: height
            });

        var graph = svg.append("g").classed("graph", true).attr("transform", "translate("+padding+")");

        var dotType = "circle";

        graph.selectAll(dotType)
            .data(points)
            .enter()
            .append(dotType)
            .classed("point", true)
            .attr({
                cx: function(d) { return sizeScale(d.size) },
                cy: function(d) { return threadsScale(d.threads) },
                r: function(d) { return speedScale(d.speed)/2 }
            })
            .on("click", function(d) {
                graph.selectAll(dotType).classed("selected", false);
                d3.select(this).classed("selected", true);
                dispatch.select(d.id);
            });

        function speedText(x)
        {
            if (x < 1024) return x.toFixed(0) + "B/s";
            x /= 1024;
            if (x < 1024) return x.toFixed(0) + "kB/s";
            x /= 1024;
            if (x < 1024) return x.toFixed(0) + "MB/s";
            x /= 1024;
            if (x < 1024) return x.toFixed(0) + "GB/s";
        }

        graph.selectAll("text")
            .data(points.slice(points.length-1))
            .enter()
            .append("text")
            .attr({
                x: function(d) { return sizeScale(d.size) },
                y: function(d) { return threadsScale(d.threads) },
                "text-anchor": "middle",
                "dominant-baseline": "central",
                "pointer-events": "none"
            })
            .text(function(d){
                return speedText(d.speed)
            });
            

        var sizeAxis = d3.svg.axis().scale(sizeScale).orient("bottom").tickFormat(function(d) { return sizeText(d); });
        svg.append("g").classed("axis", true).attr("transform", "translate("+padding+","+(height-padding)+")").call(sizeAxis);

        var threadsAxis = d3.svg.axis().scale(threadsScale).orient("left");
        svg.append("g").classed("axis", true).attr("transform", "translate("+padding+",0)").call(threadsAxis);
    }

    chart.data = function(value) {
        data = value;
        return chart;
    }



    return d3.rebind(chart, dispatch, "on");
};
