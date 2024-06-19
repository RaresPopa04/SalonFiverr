const express = require('express');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/create', auth, async (req, res) => {
    const { date, description, time, status } = req.body;

    try {
        const appointment = new Appointment({
            date,
            description,
            time,
            status
        });

        await appointment.save();

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $push: { appointments: appointment._id } },
            { new: true } 
        );




        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
});


router.get('/all', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('appointments');

        res.json(user.appointments);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
});

router.delete('/delete/:id', auth, async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);

        const user = await User.findById(req.user.id);
        
        if(!user.isAdmin){
            return res.status(401).json({ msg: 'Not authorized' });
        }

        user.appointments = user.appointments.filter(appointment => appointment.id !== req.params.id);

        await user.save();

        res.json({ msg: 'Appointment deleted' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
});


router.put('/update/:id', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        const user = await User.findById(req.user.id
        );

        if(!user.isAdmin){
            return res.status(401).json({ msg: 'Not authorized' });
        }

        appointment.status = req.body.status;

        await appointment.save();

        res.json(appointment);

    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }

});


module.exports = router;



