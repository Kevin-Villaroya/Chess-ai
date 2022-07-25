google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawBackgroundColor);

function setTypeGame(type){
  setCookie("type", type);
}

window.addEventListener('resize', function(event){
  drawBackgroundColor();
});

function drawBackgroundColor() {
  var data = new google.visualization.DataTable();
  data.addColumn('number', 'X');
  data.addColumn('number', '');

  data.addRows([
    [0, 0],   [1, 50],  [2, 100],  [3, 120],  [4, 140],  [5, 160],
    [6, 180],  [7, 200],  [8, 230],  [9, 260],  [10, 270], [11, 280],
    [12, 300], [13, 340], [14, 360], [15, 340], [16, 380], [17, 415],
    [18, 420], [19, 500], [20, 550], [21, 600], [22, 700], [23, 750],
    [24, 751], [25, 743], [26, 760], [27, 765], [28, 750], [29, 775],
    [30, 789]
  ]);

  var options = {
    title: 'Average elo in the last month',
    hAxis: {
      title: 'Days'
    },
    hAxis: {
      minValue: 0,
      maxValue: 30,
      ticks: [0, 5, 10, 15, 20, 25, 30],
      gridlines: {
        count: 4
      },
      baselineColor: '#f5f5f5'
    },
    colors: ['green'],
    backgroundColor: { fill:'#727170', fillOpacity: 0.2 },
    titleTextStyle: {
      fontSize: 15, // 12, 18 whatever you want (don't specify px)
      bold: true    // true or false
    },
    chartArea: {'width': '100%', 'height': '80%'},
    legend: {position: 'none'},
    width: '100%',
    responsive : true,
    maintainAspectRatio: false
  };

  var chart = new google.visualization.LineChart(document.getElementById('menu-container-chart'));
  chart.draw(data, options);
}