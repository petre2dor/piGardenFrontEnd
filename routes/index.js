var express = require('express');
var moment  = require('moment');
var Request = require('./request')
var router  = express.Router();

/* GET main page. */
router.get('/', (req, res, next) => {
    let data = []
    let chartOptions = {
        type: 'line',
        fill: true,
        data: {
            datasets: [{
                label: "Dataset with string point data",
                borderColor: 'rgb(255, 99, 132)',
                fill: false,
                data: data,
            }]
        },
        options: {
            responsive: true,
            title:{
                display:true,
                text:"Chart.js Time Point Data"
            },
            scales: {
                xAxes: [{
                    type: "time",
                    display: true,
                    time: {
                        displayFormats: {
                            day: 'MMM DD'
                        }
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }],
                yAxes: [{
                    display: true,
                    ticks: {
                        min: 0,
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'value'
                    }
                }]
            }
        }
    };
    res.render('index', { title: 'Express', chartOptions: JSON.stringify(chartOptions) });
});

router.get('/getStats', (req, res, next) => {
    function processData(raw_data){
        let data = []
        raw_data.forEach(el => {
            data.push({
                x: moment(el.date).format(),
                y: el.value.toFixed(1)
            })
        })
        return data
    }

    let ACRequest = new Request('localhost', 8080)
    ACRequest
    .get('/stats/3/2016-11-27T00:00:00')
    .then(response => {
        data = processData(response.data)
        res.json({ data: data });
    })

});

module.exports = router;
