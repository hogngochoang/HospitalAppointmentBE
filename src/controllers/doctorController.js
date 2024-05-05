import doctorService from "../services/doctorService"

let getDoctorHome = async (req,res) => {
    let limit = req.query.limit
    if(!limit) limit=10;
    try {
        let response = await doctorService.getDoctorHome(+limit)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: "Error from server"
        })
    }
}

let getAllDoctorDetail = async (req,res) => {
    try {
        let response = await doctorService.getAllDoctorDetail()
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: "Error from server"
        })
    }
}

let createSchedule = async (req, res) => {
    try {
        let response = await doctorService.createSchedule(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: "Error from server"
        })
    }
}

let deleteSchedule = async (req,res) => {
    if(!req.body.doctorId || !req.body.date) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing requied parameters'
        })
    }
    let message = await doctorService.deleteSchedule(req.body.doctorId, req.body.date);
    return res.status(200).json(message)
}

let getScheduleDoctorByDate = async (req,res) => {
    try {
        let info = await doctorService.getScheduleDoctorByDate(req.query.doctorId, req.query.date)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: "Error from server"
        })
    }
}

let getScheduleDoctorById = async (req,res) => {
    try {
        let info = await doctorService.getScheduleDoctorById(req.query.doctorId)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: "Error from server"
        })
    }
}

let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors()
        return res.status(200).json(doctors)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: "Error from server"
        })
    }
}

let getListScheduleForDoctor = async (req, res) => {
    try {
        let schedules = await doctorService.getListScheduleForDoctor(req.query.doctorId)
        return res.status(200).json(schedules)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: "Error from server"
        })
    }
}

let getListPatientForDoctor = async (req, res) => {
    try {
        let info = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: "Error from server"
        })
    }
}

let getListExaminedPatientForDoctor = async (req, res) => {
    try {
        let info = await doctorService.getListExaminedPatientForDoctor(req.query.doctorId, req.query.date)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: "Error from server"
        })
    }
}

let updateBookingStatusDone = async (req, res) => {
    try {
        let info = await doctorService.updateBookingStatusDone(req.body)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: "Error from server"
        })
    }
}

let updateBookingStatusCancel = async (req, res) => {
    try {
        let info = await doctorService.updateBookingStatusCancel(req.body)
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
    getDoctorHome: getDoctorHome,
    getAllDoctorDetail: getAllDoctorDetail,
    createSchedule: createSchedule,
    deleteSchedule:deleteSchedule,
    getScheduleDoctorByDate: getScheduleDoctorByDate,
    getScheduleDoctorById: getScheduleDoctorById,
    getAllDoctors: getAllDoctors,
    getListScheduleForDoctor:getListScheduleForDoctor,
    getListPatientForDoctor: getListPatientForDoctor,
    getListExaminedPatientForDoctor: getListExaminedPatientForDoctor,
    updateBookingStatusDone: updateBookingStatusDone,
    updateBookingStatusCancel: updateBookingStatusCancel
}