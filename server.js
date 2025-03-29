    require("dotenv").config(); // Đảm bảo dotenv được load đầu tiên
    const express = require('express');
    const mongoose = require('mongoose');
    const cors = require('cors');
    const app = express();
    const bcrypt = require('bcrypt');

    app.use(express.json());
    app.use(cors());
    require('dotenv').config();
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
                user: { _id: user._id, fullname: user.fullname, email: user.email }, // Trả về `_id`
                token
            });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    });

    const randomImages = [
        "https://picsum.photos/800/600?random=58",
        "https://picsum.photos/800/600?random=12",
        "https://picsum.photos/800/600?random=4",
        "https://picsum.photos/800/600?random=2",
    
    ];

    // Định nghĩa schema Lớp học
    const ClassSchema = new mongoose.Schema({
        code: String,
        name: { type: String, required: true },
        topic: String,
        description: String,
        password: String,
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        imageUrl: String, // Thêm ảnh vào Schema
        createdAt: { type: Date, default: Date.now }
    });

    const Class = mongoose.model('Class', ClassSchema);



    app.post('/create-class', async (req, res) => {
        const { code, name, topic, description, password, userId } = req.body;
    
        if (!userId) {
            return res.status(400).json({ message: "Thiếu ID người dùng!" });
        }
    
        try {
            // Kiểm tra xem người dùng đã tạo lớp với mã này chưa
            const existingClass = await Class.findOne({ code, userId });
            if (existingClass) {
                return res.status(400).json({ message: "Mã lớp học đã tồn tại!" });
            }
    
            // Chọn ngẫu nhiên ảnh nền cho lớp học
            const randomImage = randomImages[Math.floor(Math.random() * randomImages.length)];
    
            // Tạo lớp học mới
            const newClass = new Class({
                code,
                name,
                topic,
                description,
                password,
                userId,
                imageUrl: randomImage
            });
    
            await newClass.save();
            res.status(201).json({ message: "Lớp học đã được tạo!", class: newClass });
        } catch (error) {
            console.error("❌ Lỗi server khi tạo lớp:", error);
            res.status(500).json({ message: "Lỗi server!" });
        }
    });
    


    app.get('/classes/:userId', async (req, res) => {
        try {
            const { userId } = req.params;
            const classes = await Class.find({ userId });
    
            if (!classes.length) {
                return res.status(404).json({ message: "Không tìm thấy lớp học nào!" });
            }
    
            res.status(200).json(classes);
        } catch (error) {
            console.error("❌ Lỗi server khi lấy danh sách lớp học:", error);
            res.status(500).json({ message: "Lỗi server!" });
        }
    });
    


    app.get('/class/:classId', async (req, res) => {
        try {
            const { classId } = req.params;
            const classData = await Class.findById(classId);
    
            if (!classData) {
                return res.status(404).json({ message: "Không tìm thấy lớp học!" });
            }
    
            res.status(200).json(classData);
        } catch (error) {
            console.error("❌ Lỗi server khi lấy thông tin lớp:", error);
            res.status(500).json({ message: "Lỗi server!" });
        }
    });
    
    app.put('/class/:classId', async (req, res) => {
        try {
            const { classId } = req.params;
            const { code, name, topic, description, password, userId } = req.body;
    
            // Lấy thông tin lớp học hiện tại để kiểm tra userId
            const existingClass = await Class.findById(classId);
            if (!existingClass) {
                return res.status(404).json({ message: "Không tìm thấy lớp học!" });
            }
    
            // Kiểm tra xem mã lớp học có bị trùng không (ngoại trừ lớp hiện tại)
            const duplicateClass = await Class.findOne({ code, userId, _id: { $ne: classId } });
            if (duplicateClass) {
                return res.status(400).json({ message: "Mã lớp học đã tồn tại!" });
            }
    
            // Cập nhật lớp học
            const updatedClass = await Class.findByIdAndUpdate(
                classId,
                { code, name, topic, description, password },
                { new: true }
            );
    
            res.status(200).json({ message: "Cập nhật lớp học thành công!", class: updatedClass });
        } catch (error) {
            console.error("❌ Lỗi server khi cập nhật lớp học:", error);
            res.status(500).json({ message: "Lỗi server!" });
        }
    });
    
    
    app.delete('/class/:classId', async (req, res) => {
        try {
            const { classId } = req.params;
    
            // Kiểm tra xem lớp học có tồn tại không
            const existingClass = await Class.findById(classId);
            if (!existingClass) {
                return res.status(404).json({ message: "Không tìm thấy lớp học!" });
            }
    
            // Xóa lớp học
            await Class.findByIdAndDelete(classId);
    
            res.status(200).json({ message: "Xóa lớp học thành công!" });
        } catch (error) {
            console.error("❌ Lỗi server khi xóa lớp học:", error);
            res.status(500).json({ message: "Lỗi server!" });
        }
    });



  



    app.listen(3000, () => console.log('🚀 Server chạy trên cổng 3000'))
    .on("error", (err) => console.log("❌ Lỗi server:", err));

