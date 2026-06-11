const Alert = require('../models/Alert');

const registerAlertEvents = (io, socket) => {

    // Register event listeners for alert-related events
    socket.on('send_alert', async (data) => {
        console.log('Received send_alert event:', data);
        try {
            const { orgId, sentBy, section, button, action } = data;

            // save the alert to the database
            const alert = await Alert.create({
                org: orgId,
                sentBy,
                section,
                button,
                action,
            });

            // Broadcast to everyone in the org room
            io.to(orgId).emit('new_alert', {
                _id: alert._id,
                section: alert.section,
                button: alert.button,
                action: alert.action,
                sentBy: alert.sentBy,
                status: alert.status,
                createdAt: alert.createdAt,
            });
        } catch (err) {
            socket.emit('alert_error', { message: err.message });
        }
    });

    // Tech clears an alert
    socket.on('clear_alert', async (data) => {
        try {
            const { alertId, clearedBy, orgId } = data;

            // find and update alert
            const alert = await Alert.findByIdAndUpdate(
                alertId,
                {
                    status: 'cleared',
                    clearedBy,
                    clearedAt: new Date(),
                },
                { new: true }
            );

            if (!alert) {
                return socket.emit('alert_error', { message: 'Alert not found' });
            }

            // Broadcast the updated alert to everyone in the org room
            io.to(orgId).emit('alert_cleared', {
                _id: alert._id,
                status: alert.status,
                clearedBy: alert.clearedBy,
                clearedAt: alert.clearedAt,
            });
        } catch (err) {
            socket.emit('alert_error', { message: err.message });
        }
    });

    // fetch all active alerts
    socket.on('get_active_alerts', async (data) => {
        try {
            const { orgId } = data;

            const alerts = await Alert.find({
                org: orgId,
                status: 'active',
            }).sort({ createdAt: -1 });

            socket.emit('active_alerts', alerts);
        } catch (err) {
            socket.emit('alert_error', { message: err.message });
        }
    });
};

module.exports = registerAlertEvents;