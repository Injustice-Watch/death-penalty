//var lineChart = document.getElementById('graphic-01').innerHTML += '<div id="line-chart"></div>';
/**************
DRAW EVERYTHING
**************/
//mutable by graph 
var chartTitle = 'Crimes Executed, 1608&mdash;Present';

var inputFile = '../numbers/output_for_graphic.csv';

//mutable styles

var chartHeight = 400;

var chartWidth = parseInt(d3.select('#draw').style('width'));

var activeLine = 'Murder*';

var footnote = '*For simplicity, we consolidated several categories of murder included in the original dataset, including \"Rape Murder\" and "Burglary Murder." See full dataset <a href="">here</a>.'

var colorPalette = ['#B799FF','#9988AA','#9D79F2','#555577','#533F7F','#523399','#413D4C','#442299','#2B2B2B','#331188','#3300A8'];

//draw space
var svg = d3.select('#draw')
	.attr('height', chartHeight);

console.log(parseInt(d3.select("#draw").style("width")));
	
d3.select('svg'),
	margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = chartWidth - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
var title = svg.append('text')
	.attr("transform", "translate(" + (margin.left + 6) + "," + (margin.top + 20) + ")")
	.attr('class','chart-title')
	.html(chartTitle);
	
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var buttonSpace = d3.select('#graphic-01').append('div')
	.attr('id', 'button-space');

var footnote = d3.select('#graphic-01').append('div')
	.attr('id','footnote')
	.html(footnote);
	
//draw tooltip
var tooltip = d3.select('#graphic-01').append('div')
	.attr('id','tooltip')
	.style('display','none');

var info = d3.select('#tooltip')
	.append('p')
	.attr('id','info');

var moreInfo = d3.select('#tooltip')
	.append('p')
	.attr('id','more-info');

var tooltipLeft = margin.left + 12 + 'px';

var tooltipTop = margin.top + 40 + 'px';
/***************	
SET SCALES, ETC.
***************/	
//tell d3 the time format is four-digit year	
var parseTime = d3.timeParse('%Y');

//set scale	
var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .range([chartHeight - margin.top - margin.bottom, 0]);
    
var z = d3.scaleOrdinal(colorPalette);
        
var line = d3.line()
	.curve(d3.curveMonotoneX)
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.count); });


/****************    
BRING IN THE DATA    
****************/    
//load csv    
d3.csv(inputFile, type, function(error, data){
	
	if (error) throw error;

	//function slugifies crime strings for classing later on 
	function slug(s){
		return s.split(' ').join('-').split('/').join('').split('*').join('').split('---').join('-').toLowerCase();
	};
	
	//flip original dataset's columns into rows, one for each line on chart (dynamically)
	//sorted by crimes originally, too scared to change the name of this variable now sorry
	var crimes = data.columns.slice(1).map(function(key){
		return {
			key:key,
			keySlug:slug(key),
			values:data.map(function(d){
				return {year:d['PERIOD'], count: d[key]};
			}),
		};
	});

	//set domain
	x.domain(d3.extent(data, function(d) { return d['PERIOD']; }));
  	y.domain([
    	d3.min(crimes, function(c) { return d3.min(c.values, function(d) { return d.count; }); }),
    	d3.max(crimes, function(c) { return d3.max(c.values, function(d) { return d.count; }); })
  	]);
  	
  	z.domain(crimes.map(function(c) {return c.id;}));
  	
  	//x axis
  	g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + (chartHeight - margin.top - margin.bottom) + ")")
      .call(d3.axisBottom(x));
     
    //y axis 
    g.append("g")
		.attr('class','y-axis')	
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr('x',-((chartHeight - margin.top - margin.bottom) / 2))
      .attr("dy", "0.71em")
      .attr("text-anchor", "middle")
      .text("Executions"); 
    
    
    //data paths
    var crime = g.selectAll(".crime")
      .data(crimes)
      .enter().append('g')
      .attr('class','crime')
      .attr('data-color',function(d){return z(d.key);})
      .attr('id',function(d){return 'crime-'+d.keySlug;})
      .on('mouseover',function(d){
      	d3.select('#info')
      		.text(d.key);
      });
    
    crime.append('path')
    	.attr('class','line')
    	.attr("d", function(d) { return line(d.values); })
    	.attr('id',function(d) {return 'line-'+d.keySlug;})
    	.style('stroke',function(d){
    		if (d.key == activeLine) {return z(d.key);}
    		else {return '#d3d3d3';}
    	})
    	.style('fill','none')
    	.style('stroke-width',function(d){
    		if (d.key == activeLine) {return 3;}
    		else {return 1;}
    	})
    	.on('mouseover',function(d){
    		
    		d3.select('#tooltip')
    			.style('display','block')
    			.style("left", tooltipLeft)		
                .style("top", tooltipTop);
             
    	})
    	.on('mouseout',lineMouseOut)
    	.on('click',function(d){
    	
    	});
    
    crime.selectAll("circle")
    	.data(function(d){return d.values})
    	.enter()
    	.append("circle")
    	.attr("r", 3)
    	.attr("cx", function(d) { return x(d.year); })
    	.attr("cy", function(d) { return y(d.count); })
    	.attr('class','point')
    	.style('fill',function(){
    		var gColor = d3.select(this.parentNode).attr('data-color');
    		return gColor;
    	
    	})
    	.style('stroke',function(){
    		var gStroke = d3.select(this.parentNode).attr('data-color');
    		return gStroke;
    	})
    	.style('stroke-width',1)
    	.on('mouseover',function(d){
    		d3.select('#tooltip')
    			.style('display','block')
    			.style("left", tooltipLeft)
    			.style("top", tooltipTop);
    		
    		var formatYear = d3.timeFormat('%Y');
    		d3.select('#more-info')
    			.html('<strong>Decade: </strong>' + formatYear(d.year) + 's <br> <strong>Executions: </strong>' + d.count);
    	})
    	.on('mouseout',function(){
    		d3.select('#tooltip')
    			.style('display','none');
    		d3.select('#more-info')
    			.html('');
    	})
    	.style('display','none');
   	
    //set default active line
    crimes.forEach(function(d){
    	if (d.key == activeLine){
    		d.active = true;
    		d3.selectAll('#crime-'+d.keySlug+' .point')
    			.style('display','block')
    			.style('stroke',function(d){
    			
    				return d3.select(this.parentNode).attr('data-color');
    				
    			});
    	}
    	else{
    		d.active = false;
    	}
    	/*d3.selectAll('#crime-'+d.keySlug+' .point')
    		.on('mouseover',function(d){
    			d3.select('#info')
    				.text(d.key);
    		});*/
    });	
    d3.select('#crime-'+slug(activeLine)).raise();
   
    var activePaths = [];
    
    //button stuff!
    d3.select('#button-space').selectAll('.buttons')
    	.data(crimes)
    	.enter()
    	.append('span')
    	.attr('class','buttons')
    	.text(function(d){return d.key;})
    	.attr('id',function(d){
    		return 'button-'+d.keySlug;
    	})
    	.style('color',function(d){
    		if (d.active == true) {return '#fff';}
    		else {return '#000';}
    	})
    	.style('background-color',function(d){
    		if (d.active == true) {return z(d.key);}
    		else {return '#d3d3d3';}
    	})
    	.on('click',function(d){
    		
    		//toggle between active and inactive
    		var active = d.active ? false : true,
    		newBgColor = active ? function(d){return z(d.key);} : '#d3d3d3',
    		newFontColor = active ? '#fafafa' : '#000',
    		newLineStroke = active ? function(d){return z(d.key);} : '#d3d3d3',
    		newLineWidth = active ? 3 : 1,
    		newClass = active ? 'active-line' : 'inactive-line',
    		newOpacity = active ? 1 : 1,
    		newDisplay = active ? 'block':'none';
    		
    		d3.select('#button-'+d.keySlug)
    			.style('background-color',newBgColor)
    			.style('color',newFontColor);
    		
    		/*d3.select('#crime-'+d.keySlug)
    			.raise();*/
    		
    		d3.select('#line-'+d.keySlug)
    			.style('stroke-width',newLineWidth)
    			.style('stroke',newLineStroke)
    			.style('opacity',newOpacity)
    			.style('class',newClass);

  			d.active = active;
  			//UPDATE SCALE BASED ON WHAT'S ACTIVE
  			//empty active paths array
  			activePaths = [];
  			//push active data points to active paths array 
  			crimes.forEach(function(d){
  				if (d.active == true) {
  					activePaths.push(d);
  					d3.select('#crime-'+d.keySlug)
    					.raise();
  				}
  				else{
  					d3.select('#crime-'+d.keySlug)
  						.lower();
  				}
  			});
  			
  			//show points on line that's selected
  			d3.selectAll('#crime-'+d.keySlug+' .point')
  				.style('display',newDisplay);
  			//update scale; provide for if no lines are active
  			if (activePaths.length === 0) {
  				y.domain([
    				d3.min(crimes, function(c) {
    					return d3.min(c.values, function(d) 
    						{ return d.count; }); 
    					}),
    				d3.max(crimes, function(c) { 
    					return d3.max(c.values, function(d) 
    						{ return d.count; }); 
    					})
  					]);
  				}
  			else {
  			//graph looks crazy for methods with low frequencies, set minimum zoom to 50
  				var maxi = d3.max(activePaths, function(c) {return d3.max(c.values, function(d) { return d.count; }); });
  				
  				if (maxi < 50){
  					y.domain([
    					d3.min(activePaths, function(c) {
    						return d3.min(c.values, function(d) 
    							{ return d.count; }); 
    						}),
    					50
  					]);
  				}
  				else {
  					y.domain([
    					d3.min(activePaths, function(c) {
    						return d3.min(c.values, function(d) 
    							{ return d.count; }); 
    						}),
    					maxi
  					]);
  				}
  			}
  			//update lines to new scale
  			d3.selectAll('.line')
    			.transition().duration(200).ease(d3.easeLinear)
    			.attr('d',function(d) {return line(d.values);});
    		
    		//update y axis to new scale
    		d3.select('.y-axis')
    			.transition().duration(200).ease(d3.easeLinear)
    			.call(d3.axisLeft(y));
    		
    		//update circle to new scale 
			d3.selectAll('circle')
				.transition().duration(200).ease(d3.easeLinear)
				.attr("cx", function(d) { return x(d.year); })
    			.attr("cy", function(d) { return y(d.count); });
    	});
  	
    console.log(crimes);
    //get data on mouseover via mouse position; though not sure this is the best way (would rather grab from the actual data)
    /*function xPos(p){
    	return x.invert(d3.mouse(p)[0]);
    }
    function yPos(q){
    	return y.invert(d3.mouse(q)[1]);
    }*/
    function lineMouseOver(crimes, i){
    	d3.select('#tooltip')
    			.style('display','block')
    			.style("left", (d3.event.pageX + 25) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");
    		console.log(crimes.values[i].count);
    		d3.select('#info')
    			.text(crimes.key);
    		
    		d3.select('#more-info')
    			.data(crimes)
    			.html(d.year);
    		
    };
    function lineMouseOut(d){
    
    		d3.select('#tooltip')
    			.style('display','none');
    		
    };
    	
});

//parse data
function type(d, _, columns){
  	d['PERIOD'] = parseTime(d['PERIOD']);
  	//loop so strings for column beyond 1st column
  	//always parsed to int no matter how many columns
  	for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
  	return d;
	}
/****************
MOBILIZE THIS ISH
****************/
 function resize(){
    	var chartWidth = parseInt(d3.select('#draw').style('width'));
		var width = chartWidth - margin.left - margin.right; 
		
			x.rangeRound([0, width]);
			
			d3.select('.axis--x')
				.call(d3.axisBottom(x));
    
    		d3.selectAll('.line')
    			.attr('d',function(d) {return line(d.values);});
    			
    		d3.selectAll('.point')
    			.attr("cx", function(d) { return x(d.year); })
    			.attr("cy", function(d) { return y(d.count); });
    	
    	
    	console.log(chartWidth);
    
    };
	d3.select(window).on('resize',resize);
	resize();


