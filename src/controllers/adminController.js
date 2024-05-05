import adminService from '../services/adminService'

let getListPatientForAdmin = async (req, res) => {
    try {
        let info = await adminService.getListPatientForAdmin(req.query.date)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: "Error from server"
        })
    }
}

let getTotalPatientForAdmin = async (req, res) => {
    try {
        let info = await adminService.getTotalPatientForAdmin(req.query.doctorId)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: "Error from server"
        })
    }
}

module.exports = {
    getListPatientForAdmin: getListPatientForAdmin,
    getTotalPatientForAdmin:getTotalPatientForAdmin
}