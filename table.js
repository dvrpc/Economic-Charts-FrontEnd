const makeTableTopRow = month => {
    const tr = document.createElement('tr')

    tr.insertAdjacentHTML('afterbegin', 
        `
            <td class="first-row industry-cell">Industry Group</td>
            <td colspan="2" class="centered">${month}</td>
            <td colspan="2" class="centered">Change</td>
            <td colspan="2" class="centered">${month}</td>
            <td colspan="2" class="centered">Change</td>
        `
    )

    return tr
}

const makeTableSecondRow = () => {
    const tr = document.createElement('tr')

    tr.insertAdjacentHTML('afterbegin',
        `
            <tr>
                <td></td>
                <td>Number</td>
                <td>Share</td>
                <td>Number</td>
                <td>Percent</td>
                <td>Number</td>
                <td>Share</td>
                <td>Number</td>
                <td>Percent</td>
            </tr>
        `
    )

    return tr
}

const makeContentRows = (month, response) => {
    const frag = document.createDocumentFragment()
    const phillyLabel = 'Philadelphia MSA'
    const trentonLabel = 'Trenton MSA'

    Object.entries(response[month]).forEach(data => {
        const vals = data[1]

        const tr = document.createElement('tr')
        const title = document.createElement('td')
        const numOne = document.createElement('td')
        const shareOne = document.createElement('td')
        const numTwo = document.createElement('td')
        const percOne = document.createElement('td')
        const numThree = document.createElement('td')
        const shareTwo = document.createElement('td')
        const numFour = document.createElement('td')
        const percTwo = document.createElement('td')

        title.classList.add('first-row')

        title.textContent = data[0]

        //philly
        numOne.textContent = vals[phillyLabel].employment
        shareOne.textContent = vals[phillyLabel]['share of total'] + '%'
        numTwo.textContent = vals[phillyLabel]['one-year change (number)']
        percOne.textContent = vals[phillyLabel]['one-year change (percent)'] + '%'

        // trenton
        numThree.textContent = vals[trentonLabel].employment
        shareTwo.textContent = vals[trentonLabel]['share of total'] + '%'
        numFour.textContent = vals[trentonLabel]['one-year change (number)']
        percTwo.textContent = vals[trentonLabel]['one-year change (percent)'] +'%'

        tr.appendChild(title)
        tr.appendChild(numOne)
        tr.appendChild(shareOne)
        tr.appendChild(numTwo)
        tr.appendChild(percOne)
        tr.appendChild(numThree)
        tr.appendChild(shareTwo)
        tr.appendChild(numFour)
        tr.appendChild(percTwo)

        frag.appendChild(tr)
    })

    return frag
}


const makeTable = response => {
    const tBody = document.getElementById('employment-table-body')
    const sectionSubheader = tBody.parentElement.parentElement.parentElement.firstElementChild

    const month = Object.keys(response)[0]

    const topRow = makeTableTopRow(month)
    const secondRow = makeTableSecondRow()
    const contentRows = makeContentRows(month, response)

    // add table content
    tBody.appendChild(topRow)
    tBody.appendChild(secondRow)
    tBody.appendChild(contentRows)

    // update section area header
    sectionSubheader.insertAdjacentHTML('beforeend', `<br>${month} <small>(1,000s of jobs)</small>`)
}

export default makeTable