import express  from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController"
import patientController from "../controllers/patientController"
import adminController from "../controllers/adminController"
import staffController from "../controllers/staffController"

let router = express.Router();
let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage)

    router.get('/create', homeController.getCreateUser)

    router.post('/postcrud', homeController.postCRUD)

    router.get('/getCRUD', homeController.getCRUD)

    router.get('/editcrud', homeController.editCRUD)

    router.post('/putcrud', homeController.putCRUD)

    router.get('/deletecrud', homeController.deleteCRUD)

    router.post('/api/login', userController.handleLogin)

    router.get('/api/get-users', userController.handleGetUsers)

    router.post('/api/create-user', userController.handleCreateUser)
    
    router.put('/api/edit-user', userController.handleEditUser)

    router.delete('/api/delete-user', userController.handleDeleteUser)

    router.get('/api/allcode', userController.getAllCode)

    router.get('/api/doctor-home',doctorController.getDoctorHome)

    router.get('/api/all-doctor-detail',doctorController.getAllDoctorDetail)

    router.post('/api/create-schedule',doctorController.createSchedule)

    router.delete('/api/delete-schedule', doctorController.deleteSchedule)

    router.get('/api/get-schedule-doctor-by-date',doctorController.getScheduleDoctorByDate)

    router.get('/api/get-schedule-doctor-by-id',doctorController.getScheduleDoctorById)

    router.get('/api/get-all-doctors', doctorController.getAllDoctors)

    router.get('/api/get-list-schedule-for-doctor', doctorController.getListScheduleForDoctor)

    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor)
    
    router.get('/api/get-list-examined-patient-for-doctor', doctorController.getListExaminedPatientForDoctor)
    
    router.post('/api/update-booking-status-done', doctorController.updateBookingStatusDone)

    router.post('/api/update-booking-status-cancel', doctorController.updateBookingStatusCancel)

    router.get('/api/get-list-patient-for-admin', adminController.getListPatientForAdmin)

    router.get('/api/get-total-patient-for-admin', adminController.getTotalPatientForAdmin)

    router.post('/api/patient-book-appointment',patientController.postBookingAppointment)

    router.post('/api/patient-verify-book-appointment',patientController.postVerifyBookingAppointment)

    router.get('/api/get-list-waiting-patient-for-staff', staffController.getListWaitingPatientForStaff)

    router.post('/api/update-booking-status-confirmed', staffController.updateBookingStatusConfirmed)

    router.get('/api/get-list-confirmed-patient-for-staff', staffController.getListConfirmedPatientForStaff)

    router.delete('/api/delete-booking', staffController.handleDeleteBooking)


    return app.use('/', router)
}

module.exports = initWebRoutes