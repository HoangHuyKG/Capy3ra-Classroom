require("dotenv").config(); // Đảm bảo dotenv được load đầu tiên
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(cors());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Kết nối MongoDB thành công!"))
.catch(err => console.log("❌ Lỗi kết nối MongoDB:", err));

// Định nghĩa schema User với mật khẩu đã mã hóa
const UserSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String // Lưu mật khẩu đã mã hóa
});

const User = mongoose.model('User', UserSchema);

// API Đăng ký - Mã hóa mật khẩu trước khi lưu
app.post('/signup', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại!' });
        }

        // Mã hóa mật khẩu
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        console.log("🔑 Mật khẩu ban đầu:", password);
        console.log("🔐 Mật khẩu sau khi mã hóa:", hashedPassword);

        const newUser = new User({ fullname, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server!', error });
    }
});


// API Đăng nhập - So sánh mật khẩu mã hóa


const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Thêm biến môi trường

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng!' });
        }

        // Tạo token JWT chứa thông tin user
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ 
            message: 'Đăng nhập thành công!', 
            user: { fullname: user.fullname, email: user.email },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server!', error });
    }
});




app.listen(3000, () => console.log('🚀 Server chạy trên cổng 3000'))
  .on("error", (err) => console.log("❌ Lỗi server:", err));

