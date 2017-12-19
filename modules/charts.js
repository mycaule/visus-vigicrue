/* eslint import/no-unassigned-import: "off" */

const moment = require('moment')
const echarts = require('echarts')

const graph1 = echarts.init(document.getElementById('graph1'))
const graph2 = echarts.init(document.getElementById('graph2'))
const graph3 = echarts.init(document.getElementById('graph3'))

const getDebits = (year, obs) => {
  let min = obs.reduce((acc, x) => Math.min(acc, x.ResObsHydro), obs[0].ResObsHydro)
  min = Math.floor(min / 100) * 100
  let max = obs.reduce((acc, x) => Math.max(acc, x.ResObsHydro), obs[0].ResObsHydro)
  max = Math.ceil(max / 100) * 100

  const data = obs.reduce((acc, x) => {
    const date = moment.unix(x.DtObsHydro / 1000)

    // If (date.isBetween(`${year}-01-01`, `${year}-31-12`)) {
    acc.push([date.format('YYYY-MM-DD'), x.ResObsHydro])
    // }
    return acc
  }, [])

  return [data, min, max]
}

const getDebitsLastMonth = obs => {
  const dateMin = moment.unix(obs[0].DtObsHydro / 1000).format('YYYY-MM-DD')
  const dateMax = moment.unix(obs.slice(-1)[0].DtObsHydro / 1000).format('YYYY-MM-DD')
  const data = obs.reduce((acc, x) => {
    const date = moment.unix(x.DtObsHydro / 1000)
    acc.push([date.format('YYYY-MM-DD'), x.ResObsHydro])
    return acc
  }, [])

  return [data, dateMin, dateMax]
}

const draw1 = obssHydro => {
  const [data] = getDebits(2017, obssHydro)

  const option = {
    backgroundColor: '#404a59',

    title: {
      top: 30,
      text: 'Crues majeures de 2017',
      subtext: 'Source: vigicrues.com',
      left: 'center',
      textStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '30',
      left: '100',
      data: ['Autres', 'Top 12'],
      textStyle: {
        color: '#fff'
      }
    },
    calendar: [{
      top: 100,
      left: 'center',
      range: ['2017-01-01', '2017-06-30'],
      splitLine: {
        show: true,
        lineStyle: {
          color: '#000',
          width: 4,
          type: 'solid'
        }
      },
      yearLabel: {
        formatter: '{start} S1',
        textStyle: {
          color: '#fff'
        }
      },
      itemStyle: {
        normal: {
          color: '#323c48',
          borderWidth: 1,
          borderColor: '#111'
        }
      }
    }, {
      top: 340,
      left: 'center',
      range: ['2017-07-01', '2017-12-31'],
      splitLine: {
        show: true,
        lineStyle: {
          color: '#000',
          width: 4,
          type: 'solid'
        }
      },
      yearLabel: {
        formatter: '{start} S2',
        textStyle: {
          color: '#fff'
        }
      },
      itemStyle: {
        normal: {
          color: '#323c48',
          borderWidth: 1,
          borderColor: '#111'
        }
      }
    }],
    series: [
      {
        name: 'Autres',
        type: 'scatter',
        coordinateSystem: 'calendar',
        data,
        symbolSize(val) {
          return val[1] / 50
        },
        itemStyle: {
          normal: {
            color: '#ddb926'
          }
        }
      },
      {
        name: 'Autres',
        type: 'scatter',
        coordinateSystem: 'calendar',
        calendarIndex: 1,
        data,
        symbolSize(val) {
          return val[1] / 50
        },
        itemStyle: {
          normal: {
            color: '#ddb926'
          }
        }
      },
      {
        name: 'Top 12',
        type: 'effectScatter',
        coordinateSystem: 'calendar',
        calendarIndex: 1,
        data: data.sort((a, b) => {
          return b[1] - a[1]
        }).slice(0, 12),
        symbolSize(val) {
          return val[1] / 50
        },
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: true,
        itemStyle: {
          normal: {
            color: '#f4e925',
            shadowBlur: 10,
            shadowColor: '#333'
          }
        },
        zlevel: 1
      },
      {
        name: 'Top 12',
        type: 'effectScatter',
        coordinateSystem: 'calendar',
        data: data.sort((a, b) => {
          return b[1] - a[1]
        }).slice(0, 12),
        symbolSize(val) {
          return val[1] / 50
        },
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: true,
        itemStyle: {
          normal: {
            color: '#f4e925',
            shadowBlur: 10,
            shadowColor: '#333'
          }
        },
        zlevel: 1
      }
    ]
  }

  graph1.setOption(option, true)
}

const draw2 = obssHydro => {
  const [data2017, min2017, max2017] = getDebits(2017, obssHydro)
  const [data2016, min2016, max2016] = getDebits(2016, obssHydro)
  const [data2015, min2015, max2015] = getDebits(2015, obssHydro)

  console.log(min2017, min2016, min2015)
  console.log(max2017, max2016, max2015)
  const option = {
    tooltip: {
      position: 'top'
    },
    visualMap: {
      min: Math.min(min2017, min2016, min2015),
      max: Math.max(max2017, max2016, max2015),
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      top: 'top'
    },
    calendar: [
      {
        range: '2017',
        cellSize: ['auto', 20]
      },
      {
        top: 260,
        range: '2016',
        cellSize: ['auto', 20]
      },
      {
        top: 450,
        range: '2015',
        cellSize: ['auto', 20],
        right: 5
      }],

    series: [{
      type: 'heatmap',
      coordinateSystem: 'calendar',
      calendarIndex: 0,
      data: data2017
    }, {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      calendarIndex: 1,
      data: data2016
    }, {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      calendarIndex: 2,
      data: data2015
    }]
  }

  graph2.setOption(option, true)
}

const drawLastMonth = obssHydro => {
  const [data, dateMin, dateMax] = getDebitsLastMonth(obssHydro)

  console.log('drawLastMonth', dateMin, dateMax)
  const calStart = moment(dateMin).startOf('month').format('2017-MM-DD')
  const calEnd = moment(dateMax).endOf('month').format('2017-MM-DD')

  const option = {
    backgroundColor: '#404a59',

    title: {
      top: 30,
      text: 'Données du mois dernier',
      subtext: 'Source: vigicrues.com',
      left: 'center',
      textStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '30',
      left: '100',
      data: ['Danger'],
      textStyle: {
        color: '#fff'
      }
    },
    calendar: [{
      top: 100,
      left: 'center',
      range: [calStart, calEnd],
      splitLine: {
        show: true,
        lineStyle: {
          color: '#000',
          width: 4,
          type: 'solid'
        }
      },
      yearLabel: {
        formatter: '{start}',
        textStyle: {
          color: '#fff'
        }
      },
      itemStyle: {
        normal: {
          color: '#323c48',
          borderWidth: 1,
          borderColor: '#111'
        }
      }
    }],
    series: [
      {
        name: 'Autres',
        type: 'scatter',
        coordinateSystem: 'calendar',
        data,
        symbolSize(val) {
          return val[1] / 50
        },
        itemStyle: {
          normal: {
            color: '#ddb926'
          }
        }
      },
      {
        name: 'Autres',
        type: 'scatter',
        coordinateSystem: 'calendar',
        calendarIndex: 1,
        data,
        symbolSize(val) {
          return val[1] / 50
        },
        itemStyle: {
          normal: {
            color: '#ddb926'
          }
        }
      },
      {
        name: 'Danger',
        type: 'effectScatter',
        coordinateSystem: 'calendar',
        calendarIndex: 1,
        data: data.filter(x => x[1] > 500),
        symbolSize(val) {
          return val[1] / 50
        },
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: true,
        itemStyle: {
          normal: {
            color: '#f4e925',
            shadowBlur: 10,
            shadowColor: '#333'
          }
        },
        zlevel: 1
      },
      {
        name: 'Danger',
        type: 'effectScatter',
        coordinateSystem: 'calendar',
        data: data.filter(x => x[1] > 500),
        symbolSize(val) {
          return val[1] / 50
        },
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: true,
        itemStyle: {
          normal: {
            color: '#f4e925',
            shadowBlur: 10,
            shadowColor: '#333'
          }
        },
        zlevel: 1
      }
    ]
  }

  graph3.setOption(option, true)
}

module.exports = {draw1, draw2, drawLastMonth}
