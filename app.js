const vigicrues = require('./services/vigicrues')

vigicrues.observations('F700000103', 'Q')
  .then(res => {
    const observations = res.Serie.ObssHydro
    import('./modules/charts').then(charts => {
      charts.draw1(observations)
      charts.draw2(observations)
    })
})
