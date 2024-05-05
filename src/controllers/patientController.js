import patientService from "../services/patientService"

let postBookingAppointment = async (req, res) => {
    try {
        let info = await patientService.postBookingAppointment(req.body)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: "Error from server"
        })
    }
}

let postVerifyBookingAppointment = async (req, res) => {
    try {
        let info = await patientService.postVerifyBookingAppointment(req.body)
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
    postBookingAppointment: postBookingAppointment,
    postVerifyBookingAppointment: postVerifyBookingAppointment
}