const launches = require('../../models/launches.model')

const {
    getPagination
} = require('../../services/query')


async function getAllLaunches(req,res) {
    const { skip, limit} = getPagination(req.query)
    const launchesData = await launches.getAllLaunches(skip, limit)
    res.status(200).json(launchesData)
}

async function addNewLaunch(req, res) {
    const launch = req.body

    if (!launch.mission || !launch.rocket || !launch.launchDate
        || !launch.destination) {
            return res.status(400).json({
                error: 'Missing required launch property'
            })
        } 
    launch.launchDate = new Date(launch.launchDate)
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date'
        })
    }
    await launches.scheduleNewLaunch(launch)
    console.log(launch)
    return res.status(201).json(launch)
}

async function abortLaunch(req, res) {
    const launchId = +req.params.id 
    //if launch does not exist
    const existLaunch = await launches.existLaunchWithId(launchId)
    if (!existLaunch) {
        return res.status(404).json({
            error: 'Launch not found'
        })
    }
    //if launch does exist 
    const aborted = await launches.abortLaunchById(launchId)
    if (!aborted) {
        return res.status(400).json({
            error: 'Launch not aborted!'
        })
    }
    return res.status(200).json({
        ok: true 
    })
}
module.exports = {
    getAllLaunches, 
    addNewLaunch, 
    abortLaunch
}