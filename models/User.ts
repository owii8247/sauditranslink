// import mongoose from 'mongoose';

// const UserSchema = new mongoose.Schema({
//     name: String,
//     email: { type: String, unique: true },
//     password: String,
//     role: { type: String, enum: ['user', 'admin'], default: 'user' },
//     isApproved: { type: Boolean, default: false },
// }, { timestamps: true });

// export default mongoose.models.User || mongoose.model('User', UserSchema);


import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isApproved: { type: Boolean, default: false },
}, { timestamps: true });

// Auto-hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Skip hashing if password hasn't changed
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
