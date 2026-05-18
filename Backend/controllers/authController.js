const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');


const registerUser = async (req, res) => {
    try {
        console.log('📩 Register request received');
        console.log('Request Body:', req.body);

        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            console.log('❌ Validation failed - Missing fields');
            return res.status(400).json({ message: 'All fields required' });
        }

        console.log('✅ Validation passed');

        // Check existing user
        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log(`⚠️ User already exists with email: ${email}`);
            return res.status(400).json({ message: 'User already exists' });
        }

        console.log('🔐 Hashing password...');

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log('✅ Password hashed successfully');

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        console.log('🪪 Verification token generated');

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            verificationToken
        });

        console.log('✅ User created successfully');
        console.log('User ID:', user._id);

        // Verification URL
        const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;

        console.log('🔗 Verification URL generated:', verifyUrl);

        // Send email
        console.log('📧 Sending verification email...');

        try {
            await sendEmail({
                to: user.email,
                subject: 'LearnLog — Verify Your Email',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px;">
                        <h2 style="color: #4f46e5;">Welcome to LearnLog! 🎉</h2>
                        <p>Hi <strong>${user.name}</strong>,</p>
                        <p>Apna email verify karne ke liye neeche click karo:</p>
                        <a href="${verifyUrl}"
                           style="display: inline-block; margin: 20px 0; padding: 12px 28px; background-color: #4f46e5; color: white; border-radius: 8px; text-decoration: none; font-weight: bold;">
                            Verify Email
                        </a>
                        <p style="color: #888; font-size: 13px;">Agar aapne account nahi banaya toh ignore karo.</p>
                    </div>
                `
            });

            console.log('✅ Verification email sent successfully to:', user.email);

            res.status(201).json({
                message: 'Registration successful! Email check karo.'
            });
        } catch (emailError) {
            console.error('❌ Failed to send verification email:', emailError);
            await User.findByIdAndDelete(user._id);
            return res.status(500).json({ message: 'Email could not be sent. Please try registering again.' });
        }

    } catch (error) {
        console.log('❌ Error in registerUser controller');
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};


const verifyEmail = async (req, res) => {
    try {
        console.log("📩 Verify email API called");

        const { token } = req.params;

        console.log("🔑 Verification token:", token);

        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            console.log("❌ Invalid or expired verification link");
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=invalid_token`);
        }

        console.log("✅ User found:", user.email);

        user.isVerified = true;
        user.verificationToken = undefined;

        await user.save();

        console.log("🎉 Email verified successfully");

        const redirectURL = `${process.env.FRONTEND_URL}/login?verified=true`;

        console.log("🔄 Redirecting to:", redirectURL);

        res.redirect(redirectURL);

    } catch (error) {
        console.log("🚨 Verify email error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email first' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            photo: user.photo,
            token: generateToken(user._id)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.file) {
            user.photo = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            photo: updatedUser.photo,
            token: generateToken(updatedUser._id)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is wrong' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password changed successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Is email se koi account nahi mila' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');

        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        try {
            await sendEmail({
                to: user.email,
                subject: 'LearnLog — Password Reset',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px;">
                        <h2 style="color: #4f46e5;">Password Reset Request 🔐</h2>
                        <p>Hi <strong>${user.name}</strong>,</p>
                        <p>Apna password reset karne ke liye neeche button pe click karo:</p>
                        <a href="${resetUrl}"
                           style="display: inline-block; margin: 20px 0; padding: 12px 28px; background-color: #4f46e5; color: white; border-radius: 8px; text-decoration: none; font-weight: bold;">
                            Reset Password
                        </a>
                        <p style="color: #888; font-size: 13px;">Yeh link sirf <strong>15 minutes</strong> ke liye valid hai.</p>
                        <p style="color: #888; font-size: 13px;">Agar aapne request nahi ki toh ignore karo.</p>
                    </div>
                `
            });

            res.json({ message: 'Password reset email bhej diya gaya!' });
        } catch (emailError) {
            console.error('❌ Failed to send reset email:', emailError);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ message: 'Email could not be sent. Please try again.' });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Link invalid ya expire ho gaya' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({ message: 'Password successfully reset ho gaya!' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    verifyEmail,
    loginUser,
    getProfile,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword
};