const getData = async endpoint => {
    try {
        const stream = await fetch(`https://cloud.dvrpc.org/api/econ-data/v1/${endpoint}`)
        return stream.json()
    }
    catch {
        return false
    }
}

export default getData