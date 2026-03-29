import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email & include password
        const user = await User.findOne({ email }).select('+password');

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


import nodemailer from 'nodemailer';

// Remove the global transporter initialization to ensure process.env.EMAIL is ready
const getTransporter = async () => {
    if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
        try {
            const testAccount = await nodemailer.createTestAccount();
            return nodemailer.createTransport({
                host: testAccount.smtp.host,
                port: testAccount.smtp.port,
                secure: testAccount.smtp.secure,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
        } catch (e) {
            console.error('Failed to create Ethereal test account:', e);
            return null;
        }
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// @desc    Send OTP to email/phone
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOTP = async (req, res) => {
    try {
        const { identifier } = req.body; // Can be email or phone

        if (!identifier) {
            return res.status(400).json({ message: 'Please provide an email or phone number' });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        const isEmail = identifier.includes('@');

        let user = await User.findOne(isEmail ? { email: identifier } : { phone: identifier });

        if (!user) {
            // Need a name for creation. Use part of email/phone as temp name
            const tempName = isEmail ? identifier.split('@')[0] : identifier;
            user = await User.create({
                name: tempName,
                ...(isEmail ? { email: identifier } : { phone: identifier, email: `${identifier}@temp.com` }),
                otp,
                otpExpiry
            });
        } else {
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            await user.save();
        }

        let emailSent = false;
        if (isEmail) {
            // Send email
            try {
                const transporter = await getTransporter();
                if (transporter) {
                    const info = await transporter.sendMail({
                        from: `"CampusShare Auth" <${process.env.EMAIL || 'noreply@campusshare.com'}>`,
                        to: identifier,
                        subject: 'Your CampusShare Login OTP',
                        text: `Your OTP is ${otp}. It will expire in 5 minutes.`
                    });
                    
                    if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
                        console.log(`\n================= Ethereal Mock Email =================`);
                        console.log(`Preview Email URL: %s`, nodemailer.getTestMessageUrl(info));
                        console.log(`=======================================================\n`);
                    }
                    emailSent = true;
                }
            } catch (err) {
                console.error("\n❌ EMAIL FAILED TO SEND. Please check your .env credentials!");
                console.error("Error details:", err.message);
                console.log("Fallback Mock Email Sent OTP: ", otp);
            }
        } else {
            // Hackathon pseudo-SMS
            console.log(`Mock SMS sent to ${identifier}: ${otp}`);
        }

        res.json({ 
            message: emailSent ? 'OTP sent successfully' : 'OTP generated (Email not configured, check console)',
            mockOtp: !emailSent ? otp : undefined // Useful fallback for hackathons
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
    try {
        const { identifier, otp } = req.body;

        const isEmail = identifier.includes('@');
        const user = await User.findOne(isEmail ? { email: identifier } : { phone: identifier }).select('+otp');

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.otp !== otp) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        if (new Date() > user.otpExpiry) {
            return res.status(401).json({ message: 'OTP has expired' });
        }

        // Clear OTP
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            token: generateToken(user._id)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
