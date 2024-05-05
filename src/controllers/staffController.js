import staffService from "../services/staffService"

let getListWaitingPatientForStaff = async (req, res) => {
    try {
        let info = await staffService.getListWaitingPatientForStaff()
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: "Error from server"
        })
    }
}

let updateBookingStatusConfirmed = async (req, res) => {
    try {
        let info = await staffService.updateBookingStatusConfirmed(req.body)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: "Error from server"
        })
    }
}

let getListConfirmedPatientForStaff = async (req, res) => {
    try {
        let info = await staffService.getListConfirmedPatientForStaff()
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: "Error from server"
        })
    }
}

let handleDeleteBooking = async (req,res) => {
    if(!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing requied parameters'
        })
    }
    let message = await staffService.deleteBooking(req.body.id);
    return res.status(200).json(message)
}

module.exports = {
    getListWaitingPatientForStaff: getListWaitingPatientForStaff,
    updateBookingStatusConfirmed: updateBookingStatusConfirmed,
    getListConfirmedPatientForStaff: getListConfirmedPatientForStaff,
    handleDeleteBooking: handleDeleteBooking
}