const bcrypt = require('bcryptjs');
const { sequelize, User, Instructor, Course, CourseChapter, Company, Job } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    const adminPwd = await bcrypt.hash('admin123', 10);
    const teacherPwd = await bcrypt.hash('teacher123', 10);
    const studentPwd = await bcrypt.hash('student123', 10);

    await User.findOrCreate({ where: { username: 'admin' }, defaults: { username: 'admin', password: adminPwd, nickname: '管理员', role: 'admin', email: 'admin@edu.com' } });
    await User.findOrCreate({ where: { username: 'teacher' }, defaults: { username: 'teacher', password: teacherPwd, nickname: '张老师', role: 'teacher', email: 'teacher@edu.com', major: '人工智能' } });
    await User.findOrCreate({ where: { username: 'student' }, defaults: { username: 'student', password: studentPwd, nickname: '小明', role: 'student', email: 'student@edu.com', major: '计算机科学' } });

    const ins1 = await Instructor.findOrCreate({ where: { name: '张伟' }, defaults: { name: '张伟', title: '高级工程师', intro: '10年AI研发经验' } });
    const ins2 = await Instructor.findOrCreate({ where: { name: '李娜' }, defaults: { name: '李娜', title: '大数据专家', intro: '资深大数据架构师' } });

    const courses = [
      { title: 'Python 人工智能入门', techSystem: 'theory', techDirection: 'ai', difficulty: 2, isFree: true, price: 0, instructorId: ins1[0].id, studentCount: 1280, ratingAvg: 4.8 },
      { title: '深度学习实战', techSystem: 'practice', techDirection: 'ai', difficulty: 4, isFree: false, price: 199, instructorId: ins1[0].id, studentCount: 860, ratingAvg: 4.6 },
      { title: '大数据分析与应用', techSystem: 'theory', techDirection: 'bigdata', difficulty: 3, isFree: true, price: 0, instructorId: ins2[0].id, studentCount: 2100, ratingAvg: 4.7 },
      { title: '云计算基础与实战', techSystem: 'practice', techDirection: 'cloud', difficulty: 3, isFree: false, price: 299, instructorId: ins2[0].id, studentCount: 540, ratingAvg: 4.5 },
      { title: 'Web 前端开发', techSystem: 'theory', techDirection: 'web', difficulty: 2, isFree: true, price: 0, instructorId: ins1[0].id, studentCount: 3200, ratingAvg: 4.9 },
      { title: 'AI 工程师认证课程', techSystem: 'cert', techDirection: 'ai', difficulty: 5, isFree: false, price: 599, instructorId: ins1[0].id, studentCount: 320, ratingAvg: 4.7 },
    ];
    for (const c of courses) {
      await Course.findOrCreate({ where: { title: c.title }, defaults: { ...c, description: `${c.title}——系统讲解核心知识，配套实验与项目实战。`, cover: '', status: 1, publishedAt: new Date() } });
    }

    const allCourses = await Course.findAll();
    for (const c of allCourses) {
      if ((await CourseChapter.count({ where: { courseId: c.id } })) === 0) {
        for (let i = 1; i <= 4; i++) {
          await CourseChapter.create({ courseId: c.id, title: `第${i}章 核心内容${i}`, content: `本章讲解${c.title}的第${i}部分核心内容。`, sort: i });
        }
      }
    }

    const company = await Company.findOrCreate({ where: { name: '华为云' }, defaults: { name: '华为云', intro: '全球领先的ICT基础设施和智能终端提供商', scale: '10000人以上' } });
    const company2 = await Company.findOrCreate({ where: { name: '字节跳动' }, defaults: { name: '字节跳动', intro: '全球化互联网公司', scale: '10000人以上' } });

    const jobs = [
      { title: 'AI 算法工程师', companyId: company[0].id, category: '算法', salaryMin: 20, salaryMax: 40, city: '深圳', description: '负责AI模型研发与优化', requirements: '熟悉深度学习、Python、PyTorch' },
      { title: '大数据开发工程师', companyId: company2[0].id, category: '数据', salaryMin: 18, salaryMax: 35, city: '北京', description: '负责数据平台开发', requirements: '熟悉Hadoop/Spark/Flink' },
      { title: '前端开发工程师', companyId: company[0].id, category: '前端', salaryMin: 15, salaryMax: 30, city: '上海', description: '负责Web前端开发', requirements: '熟悉Vue/React' },
    ];
    for (const j of jobs) {
      await Job.findOrCreate({ where: { title: j.title }, defaults: { ...j, status: 1 } });
    }

    console.log('演示数据写入完成');
    console.log('默认账号: admin/admin123, teacher/teacher123, student/student123');
    process.exit(0);
  } catch (e) {
    console.error('种子数据失败:', e.message);
    process.exit(1);
  }
})();