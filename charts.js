// config
const addTooltipPercent = context => `${context.dataset.label}: ${context.parsed.y}%`
const addTooltipCommas = context => `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`

// avoid Date obj month indexing shenanigans + easy shorthand
const dateLookup = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'Aug',
    '09': 'Sept',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec'
}

const formatDate = value => {
    const valArr = value.split('-')
    const month = dateLookup[valArr[1]]
    const year = valArr[0]

    return `${month}, ${year}`
}

const chartMeta = {
    'inflation': {
        type: 'line',
        endpoint: 'cpi-recent?years=2',
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: context => addTooltipPercent(context)
                        
                    }
                },
            },
            scales: {
                y: {
                    ticks: {
                        callback: value => value + '%'
                    }
                },
                x: {
                    ticks: {
                        callback: function(value) {
                            const val = this.getLabelForValue(value)
                            return formatDate(val)
                        }
                    }
                }
            }
        }
    },
    'unemployment': {
            type: 'line',
            endpoint: 'unemployment-recent?years=2',
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: context => addTooltipPercent(context)
                            
                        }
                    },
                },
                scales: {
                    y: {
                        ticks: {
                            callback: value => value + '%'
                        }
                    },
                    x: {
                        ticks: {
                            callback: function(value) {
                                const val = this.getLabelForValue(value)
                                return formatDate(val)
                            }
                        }
                    }
                }
            }
        },
        'housing': {
            type: 'line',
            endpoint: 'housing',
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: context => addTooltipCommas(context)
                        }
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            callback: function(value) {
                                const val = this.getLabelForValue(value)
                                return formatDate(val)
                            }
                        }
                    }
                }
            }
        },
    'employmentYear': {
        type: 'bar',
        endpoint: 'employment-by-industry',
        options: {
            indexAxis: 'y'
        },
        responsive: true
    },
    'employmentTwoYear': {
        type: 'bar',
        endpoint: 'employment-by-industry',
        options: {
            indexAxis: 'y'
        },
        responsive: true
    }
}

// color palette:
    // purple: #673091
    // orange: #f8a440
    // greenish: #69A297
    // pink: #D56AA0

// charting functions
const makeInflationChart = response => {
    let phillyLabel = ''
    let usLabel = ''
    const phillyData = []
    const usData = []
    const labels = []

    response.sort((a, b) => a.period > b.period).forEach(data => {
        switch(data.area) {
            case 'Philadelphia MSA':
                phillyData.push(data.rate)
                phillyLabel = data.area
                break

            default:    
                usData.push(data.rate)
                usLabel = data.area
                labels.push(data.period)
        }
    })

    return {
        labels,
        datasets: [
            {
                label: phillyLabel,
                data: phillyData,
                fill: false,
                tension: 0.2,
                borderColor: '#673091'
            },
            {
                label: usLabel,
                data: usData,
                fill: false,
                tension: 0.2,
                borderColor: '#f8a440'
            }
        ]
    }
}

const makeUnemploymentChart = response => {
    let phillyLabel = ''
    let usLabel = ''
    let trentonLabel = ''
    const phillyData = []
    const usData = []
    const trentonData = []
    const labels = []

    response.sort((a, b) => a.period > b.period).forEach(data => {
        switch(data.area) {
            case 'Philadelphia MSA':
                phillyData.push(data.rate)
                phillyLabel = data.area
                break

            case 'United States':
                usData.push(data.rate)
                usLabel = data.area
                break

            default:
                trentonData.push(data.rate)
                trentonLabel = data.area
                labels.push(data.period)
        }
    })

    return {
        labels,
        datasets: [
            {
                label: phillyLabel,
                data: phillyData,
                fill: false,
                tension: 0.2,
                borderColor: '#673091'
            },
            {
                label: usLabel,
                data: usData,
                fill: false,
                tension: 0.2,
                borderColor: '#f8a440'
            },
            {
                label: trentonLabel,
                data: trentonData,
                fill: false,
                tension: 0.2,
                borderColor: '#69A297'
            }
        ]
    }
}

const makeHousingChart = response => {
    const labels = []
    const units = []
    const length = response.length
    const lastTwelve = length - 12
    const responseYear = response.slice(lastTwelve, length)

    responseYear.forEach(data => {
        labels.push(data.period)
        units.push(data.units)
    })

    return {
        labels, 
        datasets: [{
            label: 'Housing Units',
            data: units,
            tension: 0.2,
            fill: false,
            borderColor: '#D56AA0'
        }
        ]
    }
}

// @NOTE: special return here to include dynamic dates
const makeEmploymentYearChart = (response, changeYears) => {
    const current = Object.keys(response)[0]
    const labels = Object.keys(response[current])

    let phillyLabel = 'Philadelphia MSA'
    let trentonLabel = 'Trenton MSA'
    const phillyData = []
    const trentonData = []

    Object.entries(response[current]).forEach(data => {
        const vals = data[1]

        phillyData.push(vals[phillyLabel][changeYears])
        trentonData.push(vals[trentonLabel][changeYears])
    })

    const data = {
        labels,
        datasets: [
            {
                label: phillyLabel,
                data: phillyData,
                backgroundColor: '#673091'
            },
            {
                label: trentonLabel,
                data: trentonData,
                backgroundColor: '#69A297'
            }
        ]
    }

    return {data, current}
}

const chartObjs = {
    chartMeta,
    makeInflationChart,
    makeUnemploymentChart,
    makeHousingChart,
    makeEmploymentYearChart
}
export default chartObjs