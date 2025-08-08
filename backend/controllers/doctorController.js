import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import appointmentModel from "../models/appointmentModel.js";

const changeAvailability = async (req, res) => {

    try {

        const {doctorId} = req.body;

        const docData = await doctorModel.findById(doctorId);

        await doctorModel.findByIdAndUpdate(doctorId, {available: !docData.available});

        res.json({success: true, message: "Availability changed successfully"})
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "something went wrong in doctorController changeAvailability " + error.message})
    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password','-email'])
        res.json({success: true, doctors})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "something went wrong in doctorController doctorList " + error.message})
    }
}

//api for login doctor
const loginDoctor = async (req, res) => {
    try {

        const {email, password} = req.body;
        const doctor = await doctorModel.findOne({email});

        if(!doctor) {
            return res.json({success:false, message:'Invalid credentials'})
        }

        const isMatch = await bcrypt.compare(password, doctor.password);

        if(isMatch) {
            const token = jwt.sign({id: doctor._id}, process.env.JWT_SECRET);
            res.json({success: true, token})
        }
        else {
            res.json({success:false, message:'Invalid credentials'})
        }
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "something went wrong in doctorController loginDoctor " + error.message})
    }
}

//api to get doctor appointments for doctor panels
const appointmentsDoctor = async (req, res) => {
    try {

        const {docId} = req;

        const appointments = await appointmentModel.find({docId})

        res.json({success: true, appointments});

        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "something went wrong in doctorController appointmentsDoctor " + error.message})
    }
}

//api to mark appointment as completed
const appointmentComplete = async (req, res) => {
    try {

        const {docId} = req;
        const {appointmentId} = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if(appointmentData && appointmentData.docId == docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted: true});

            return res.json({success:true, message:'Appointment completed'});
        }
        else {
            return res.json({success:false, message:'mark failed'});
        }
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "something went wrong in doctorController appointmentComplete " + error.message})
    }
}

//api to cancel appointment for doctor panel

const appointmentCancel = async (req, res) => {
    try {

        const {docId} = req;
        const {appointmentId} = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if(appointmentData && appointmentData.docId == docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true});

            return res.json({success:true, message:'Appointment cancelled'});
        }
        else {
            return res.json({success:false, message:'cancellation failed'});
        }
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "something went wrong in doctorController appointmentCancel " + error.message})
    }
}

//api to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {
        
        const {docId} = req;

        const appointments = await appointmentModel.find({docId});

        let earnings = 0;

        appointments.map((item) => {
            if(item.isCompleted || item.payment) {
                earnings += item.amount;
            } 
        })

        let patients = []

        appointments.map((item) => {
            if(!patients.includes(item.userId)) {
                patients.push(item.userId);
            }
        })

        const dashData = {
            earnings, 
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({success: true, dashData})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: "something went wrong in doctorController doctorDashboard " + error.message})
    }
}

//api to get doctor profile for doctor panel
const doctorProfile = async (req, res) => {

    try{

        const {docId} = req;
        const profileData = await doctorModel.findById(docId).select('-password');

        res.json({success: true, profileData})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: "something went wrong in doctorController doctorProfile " + error.message})
    }
}

// api to update doctor profile data from doctor panel

const updateDoctorProfile = async (req, res) => {

    try {

        const {docId} = req;
        const {fees, address, available} = req.body;

        await doctorModel.findByIdAndUpdate(docId, {fees, address, available});

        res.json({success: true, message: "Profile updated successfully"})
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "something went wrong in doctorController updateDoctorProfile " + error.message})
    }
}



export {changeAvailability, doctorList, loginDoctor, appointmentsDoctor, appointmentCancel, appointmentComplete, doctorDashboard, doctorProfile, updateDoctorProfile}