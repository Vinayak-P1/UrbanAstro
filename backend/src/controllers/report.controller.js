import Booking from '../models/Booking.js';
import Report from '../models/Report.js';
import { generateReportText } from '../utils/reportGenerator.js';


export const generateAuto = async (req, res) => {
try {
const { bookingId } = req.params;
const booking = await Booking.findById(bookingId);
if (!booking) return res.status(404).json({ error: 'Booking not found' });
if (booking.status !== 'paid') return res.status(400).json({ error: 'Payment pending' });


const content = generateReportText(booking);
const report = await Report.create({ booking: booking._id, content, deliveredAt: new Date() });
booking.report = report._id;
await booking.save();


res.json({ ok: true, report });
} catch (e) {
res.status(500).json({ error: e.message });
}
};


export const getMine = async (req, res) => {
const reports = await Report.find({}).populate({ path: 'booking', match: { user: req.user._id } });
const owned = reports.filter(r => r.booking); // only my reports
res.json({ items: owned });
};