import getData from './api.js'
import chartObjs from './charts.js'
import makeTable from './table.js'

const charts = document.querySelectorAll('.chart')
const l = charts.length
let i = 0

// make charts
for( i; i < l; i++ ) {
    const chartEl = charts[i]
    const ctx = chartEl.getContext('2d')
    const chartID = chartEl.id.split('-')[0]
    const chartConfig = chartObjs.chartMeta[chartID]

    try {
        const data = await getData(chartConfig.endpoint)

        switch(chartID) {
            case 'unemployment':
                chartConfig.data = chartObjs.makeUnemploymentChart(data)
                break

            case 'housing':
                chartConfig.data = chartObjs.makeHousingChart(data)
                break

            // @TODO reduce calls by making this 1 jawn
            // rn making 3 calls to the same endpoint (two here + for the table)
            case 'employmentYear':
                const outputYear = chartObjs.makeEmploymentYearChart(data, 'one-year change (number)')
                const title = chartEl.parentElement.firstElementChild

                chartConfig.data = outputYear.data
                title.insertAdjacentHTML('beforeend', `<br>${outputYear.current} <small>(1,000s of jobs)</small>`)
                break

            case 'employmentTwoYear':
                const outputTwoYear = chartObjs.makeEmploymentYearChart(data, 'two-year change (number)')
                const twoYearTitle = chartEl.parentElement.firstElementChild

                chartConfig.data = outputTwoYear.data
                twoYearTitle.insertAdjacentHTML('beforeend', `<br>${outputTwoYear.current} <small>(1,000s of jobs)</small>`)

                break

            default:
                chartConfig.data = chartObjs.makeInflationChart(data)
        }

        new Chart(ctx, chartConfig)

    } catch (error) {
        console.error(error)
    }
}

// make employment table
    // API call in table.js throws error 'await is a reserved identifier' so making it here...
try {
    const bruh = await getData('employment-by-industry')
    makeTable(bruh)
} catch (error) {
    console.error(error)
}
