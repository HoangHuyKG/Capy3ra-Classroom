require("dotenv").config(); // Đảm bảo dotenv được load đầu tiên
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt');
const multer = require("multer");
const path = require("path");
const fs = require("fs");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
    "https://picsum.photos/800/600?random=1",
    "https://picsum.photos/800/600?random=2",
    "https://picsum.photos/800/600?random=3",
    "https://picsum.photos/800/600?random=4",
    "https://picsum.photos/800/600?random=5",
    "https://picsum.photos/800/600?random=6",
    "https://picsum.photos/800/600?random=7",
    "https://picsum.photos/800/600?random=8",
    "https://picsum.photos/800/600?random=9",
    "https://picsum.photos/800/600?random=10",
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
// thông báo
// Notification Schema
const NotificationSchema = new mongoose.Schema({
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    content: { type: String, required: true },
    username: { type: String, required: true },
    fileUrl: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now }
});
const Notification = mongoose.model('Notification', NotificationSchema);

// File upload configuration
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    })
});

// Serve files from the 'uploads' folder
app.use('/uploads', express.static('uploads'));

// File upload route
app.post('/upload', upload.array('files'), async (req, res) => {
    try {

        const { message, classId } = req.body;
        const files = req.files;

        if (!classId) {
            return res.status(400).json({ message: "Thiếu classId!" });
        }

        let fileUrl = null;
        if (files.length > 0) {
            fileUrl = files.map(file => file.path.replace(/\\/g, '/'));
        }

        const username = req.body.username || 'Ẩn danh';

        const newNotification = new Notification({
            classId,
            content: message,
            fileUrl,
            username
        });

        await newNotification.save();

        res.status(201).json({ message: "Upload thành công!", notification: newNotification });
    } catch (error) {
        console.error("Lỗi khi upload:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});


app.get('/notifications/class/:classId', async (req, res) => {
    try {
        const { classId } = req.params;
        const notifications = await Notification.find({ classId });
        res.status(200).json(notifications);
    } catch (error) {
        console.error("❌ Lỗi khi lấy thông báo:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});
app.delete('/notifications/:notificationId', async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.notificationId);
        if (!notification) {
            return res.status(404).json({ message: 'Thông báo không tồn tại.' });
        }

        // Xóa các file đính kèm nếu có
        if (Array.isArray(notification.fileUrl)) {
            for (const file of notification.fileUrl) {
                const filePath = path.resolve('uploads', path.basename(file));



                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath); 
                } else {
                    console.log(`Không tìm thấy file: ${filePath}`);
                }
            }
        }

        // Xóa thông báo
        await Notification.findByIdAndDelete(req.params.notificationId);
        res.json({ message: 'Xóa thông báo và file thành công.' });
    } catch (error) {
        console.error("❌ Lỗi khi xóa thông báo và file:", error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi xóa thông báo.' });
    }
});

app.get('/notifications/:id', async (req, res) => {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).send("Notification not found");
    res.json(notification);
  });

  app.put('/notifications/:id', upload.array('files'), async (req, res) => {
    try {
      const { id } = req.params;
      const { content, keptOldFiles } = req.body;
  
      // Lấy danh sách tệp mới upload lên
      const newUploadedFiles = req.files.map(file => file.path);
  
      // Parse danh sách tệp cũ còn giữ lại từ client (dưới dạng JSON string)
      let oldFilesToKeep = [];
      try {
        oldFilesToKeep = keptOldFiles ? JSON.parse(keptOldFiles) : [];
      } catch (e) {
        return res.status(400).json({ message: "Dữ liệu keptOldFiles không hợp lệ!" });
      }
  
      // Lấy thông báo cũ để kiểm tra và xử lý file cũ
      const oldNotification = await Notification.findById(id);
      if (!oldNotification) {
        return res.status(404).json({ message: "Không tìm thấy thông báo!" });
      }
  
      // Tìm các file cũ không được giữ lại
      const filesToDelete = Array.isArray(oldNotification.fileUrl) ? 
        oldNotification.fileUrl.filter(file => !oldFilesToKeep.includes(file)) : [];
  
      for (const file of filesToDelete) {
        const filePath = path.resolve('uploads', path.basename(file));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Xóa khỏi ổ đĩa
        } else {
          console.log(`⚠️ Không tìm thấy file để xóa: ${filePath}`);
        }
      }
  
      // Tạo danh sách file mới sau khi cập nhật
      const updatedFileUrls = [...oldFilesToKeep, ...newUploadedFiles];
  
      // Cập nhật nội dung và fileUrl mới
      const updatedNotification = await Notification.findByIdAndUpdate(
        id,
        {
          content,
          fileUrl: updatedFileUrls,
        },
        { new: true }
      );
  
      if (!updatedNotification) {
        return res.status(404).json({ message: "Không tìm thấy thông báo!" });
      }
  
      res.status(200).json({
        message: "Cập nhật thông báo thành công!",
        notification: updatedNotification
      });
  
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật thông báo:", error);
      res.status(500).json({ message: "Lỗi server!" });
    }
  });
  
  


const ExerciseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    points: { type: Number },
    dueDate: { type: Date },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    createdAt: { type: Date, default: Date.now },
    fileUrls: { type: [String], default: [] } // Thêm thuộc tính để lưu đường dẫn file
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);
module.exports = Exercise;
app.post('/create-exercise', upload.array('files'), async (req, res) => {
    const { title, description, points, dueDate, classId } = req.body;

    if (!title || !classId) {
        return res.status(400).json({ message: "Tiêu đề và classId là bắt buộc!" });
    }

    try {
        const newExercise = new Exercise({
            title,
            description,
            points,
            dueDate,
            classId
        });

        // Nếu có file được upload, lưu đường dẫn file vào exercise
        if (req.files && req.files.length > 0) {
            newExercise.fileUrls = req.files.map(file => file.path); // Lưu đường dẫn file
        }

        await newExercise.save();
        res.status(201).json({ message: "Bài tập đã được tạo thành công!", exercise: newExercise });
    } catch (error) {
        console.error("❌ Lỗi khi tạo bài tập:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});
app.get('/exercises/class/:classId', async (req, res) => {
    const { classId } = req.params;

    try {
        const exercises = await Exercise.find({ classId }); // Tìm tất cả bài tập cho lớp học
        res.status(200).json(exercises);
    } catch (error) {
        console.error("❌ Lỗi khi lấy bài tập:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});
app.delete('/exercises/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const exercise = await Exercise.findById(id);
        if (!exercise) {
            return res.status(404).json({ message: "Bài tập không tìm thấy!" });
        }

        // Nếu có file đính kèm → xóa file
        if (Array.isArray(exercise.fileUrls)) {
            for (const file of exercise.fileUrls) {
                const filePath = path.resolve('uploads', path.basename(file));
                console.log(filePath)
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                } else {
                }
            }
        }

        // Xóa bài tập khỏi DB
        await Exercise.findByIdAndDelete(id);
        res.status(200).json({ message: "Bài tập và các file đính kèm đã được xóa!" });

    } catch (error) {
        console.error("❌ Lỗi khi xóa bài tập:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});



app.put('/exercises/:id', upload.array('files'), async (req, res) => {
    const { id } = req.params;
    const { title, description, points, dueDate, classId, oldFileUrls } = req.body;

    if (!title || !classId) {
        return res.status(400).json({ message: "Tiêu đề và classId là bắt buộc!" });
    }

    try {
        const exercise = await Exercise.findById(id);
        if (!exercise) {
            return res.status(404).json({ message: "Bài tập không tìm thấy!" });
        }

        // Lấy danh sách file hiện tại
        const currentFileUrls = exercise.fileUrls || [];

        // Phân tích file giữ lại từ client
        const oldFiles = oldFileUrls ? JSON.parse(oldFileUrls) : [];

        // Xác định file cần xóa (không còn trong danh sách oldFileUrls)
        const filesToDelete = currentFileUrls.filter(file => !oldFiles.includes(file));

        // Tiến hành xóa file khỏi hệ thống
        for (const file of filesToDelete) {
            const filePath = path.resolve('uploads', path.basename(file));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            } else {
            }
        }

        // Cập nhật các trường khác
        exercise.title = title;
        exercise.description = description;
        exercise.points = points;
        exercise.dueDate = dueDate;
        exercise.classId = classId;

        // Gộp file mới và cũ
        const newFiles = req.files?.map(file => file.path) || [];
        exercise.fileUrls = [...oldFiles, ...newFiles];

        await exercise.save();
        res.status(200).json({ message: "Bài tập đã được cập nhật thành công!", exercise });
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật bài tập:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});


app.get('/exercises/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const exercise = await Exercise.findById(id); // Tìm bài tập theo ID
        if (!exercise) {
            return res.status(404).json({ message: "Bài tập không tìm thấy!" });
        }
        res.status(200).json(exercise); // Trả về thông tin bài tập
    } catch (error) {
        console.error("❌ Lỗi khi lấy bài tập:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});
const ClassMemberSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    joinedAt: { type: Date, default: Date.now }
});
app.post('/join-class', async (req, res) => {
    const { classCode, classPassword, userId } = req.body;

    try {
        // Tìm lớp học theo mã lớp
        const classData = await Class.findOne({ code: classCode });

        if (!classData) {
            return res.status(404).json({ message: "Không tìm thấy lớp học!" });
        }

        // Kiểm tra mật khẩu lớp học
        if (classData.password !== classPassword) {
            return res.status(400).json({ message: "Mật khẩu không đúng!" });
        }

        // Kiểm tra xem người dùng đã tham gia lớp học chưa
        const existingMember = await ClassMember.findOne({ userId, classId: classData._id });
        if (existingMember) {
            return res.status(400).json({ message: "Bạn đã tham gia lớp học này rồi!" });
        }

        // Thêm người dùng vào bảng ClassMember
        const newMember = new ClassMember({
            userId,
            classId: classData._id
        });

        await newMember.save();

        res.status(201).json({ message: "Tham gia lớp học thành công!", member: newMember });
    } catch (error) {
        console.error("❌ Lỗi khi tham gia lớp học:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});
app.get('/joined-classes/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Tìm tất cả classId mà user đã tham gia
        const memberships = await ClassMember.find({ userId });

        const classIds = memberships.map(m => m.classId);

        // Lấy thông tin lớp học tương ứng
        const classes = await Class.find({ _id: { $in: classIds } });

        res.json(classes);
    } catch (err) {
        console.error("Lỗi khi lấy lớp đã tham gia:", err);
        res.status(500).json({ error: 'Server error' });
    }
});
const ClassMember = mongoose.model('ClassMember', ClassMemberSchema);

// API để lấy thông tin giảng viên dựa trên classId
app.get('/teacher/class/:classId', async (req, res) => {
    try {
        const { classId } = req.params;

        // Tìm lớp học theo classId
        const classData = await Class.findById(classId).populate('userId', 'fullname'); // Kết nối với bảng User

        if (!classData) {
            return res.status(404).json({ message: "Không tìm thấy lớp học!" });
        }

        // Lấy thông tin giảng viên
        const teacher = classData.userId; // Đây là thông tin giảng viên

        res.status(200).json({ teacher });
    } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin giảng viên:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});


// API để lấy danh sách học viên dựa trên classId
app.get('/students/class/:classId', async (req, res) => {
    try {
        const { classId } = req.params;

        // Log classId để đảm bảo nó được nhận đúng
        console.log("Nhận classId:", classId);

        // Tìm tất cả ClassMember theo classId
        const classMembers = await ClassMember.find({ classId }).populate('userId', 'fullname');

        // Log classMembers đã được truy xuất
        console.log("Đã truy xuất classMembers:", classMembers);

        if (!classMembers.length) {
            return res.status(404).json({ message: "Không tìm thấy học viên nào trong lớp học!" });
        }

        // Lấy danh sách học viên
        const students = classMembers.map(member => member.userId); // Đây là danh sách học viên

        res.status(200).json({ students });
    } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin học viên:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});
app.listen(3000, () => console.log('🚀 Server chạy trên cổng 3000'))
    .on("error", (err) => console.log("❌ Lỗi server:", err));