const bcrypt = require('bcryptjs');
const {
  sequelize, User, Instructor, Course, CourseChapter, CourseRating,
  UserCourse, Order, Company, Job, JobApplication, UserJob,
  Notification, CommunityPost, Assignment, LearningPlan,
} = require('../models');

const log = (m) => console.log('[seed] ' + m);

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    log('数据库连接成功，表结构已同步');

    const hash = (s) => bcrypt.hash(s, 10);
    const adminPwd = await hash('admin123');
    const teacherPwd = await hash('teacher123');
    const studentPwd = await hash('student123');

    const userDefs = [
      { username: 'admin', password: adminPwd, nickname: '管理员', role: 'admin', email: 'admin@edu.com', major: '教育管理' },
      { username: 'teacher', password: teacherPwd, nickname: '张老师', role: 'teacher', email: 'zhang@edu.com', major: '人工智能' },
      { username: 'teacher2', password: teacherPwd, nickname: '李老师', role: 'teacher', email: 'li@edu.com', major: '大数据' },
      { username: 'student', password: studentPwd, nickname: '小明', role: 'student', email: 'ming@edu.com', major: '计算机科学' },
      { username: 'student2', password: studentPwd, nickname: '小红', role: 'student', email: 'hong@edu.com', major: '软件工程' },
      { username: 'student3', password: studentPwd, nickname: '小刚', role: 'student', email: 'gang@edu.com', major: '数据科学' },
    ];
    const users = {};
    for (const u of userDefs) {
      const [inst] = await User.findOrCreate({ where: { username: u.username }, defaults: u });
      users[u.username] = inst;
    }
    log(`用户 ${userDefs.length} 个就绪`);

    const insDefs = [
      { name: '张伟', title: '高级算法工程师', intro: '10年AI研发经验，曾任职于头部互联网企业', userId: users.teacher.id },
      { name: '李娜', title: '大数据专家', intro: '资深大数据架构师，主导多个PB级数据平台', userId: users.teacher2.id },
      { name: '王强', title: '云计算架构师', intro: '8年云原生与容器化经验' },
      { name: '陈晨', title: '前端技术专家', intro: 'Vue 核心贡献者，专注前端工程化' },
    ];
    const ins = {};
    for (const i of insDefs) {
      const [inst] = await Instructor.findOrCreate({ where: { name: i.name }, defaults: i });
      ins[i.name] = inst;
    }
    log(`讲师 ${insDefs.length} 个就绪`);

    const courseDefs = [
      { title: 'Python 人工智能入门', techSystem: 'theory', techDirection: 'ai', difficulty: 2, isFree: true, price: 0, instructor: '张伟', studentCount: 1280, ratingAvg: 4.8 },
      { title: '深度学习实战', techSystem: 'practice', techDirection: 'ai', difficulty: 4, isFree: false, price: 199, instructor: '张伟', studentCount: 860, ratingAvg: 4.6 },
      { title: '机器学习算法精讲', techSystem: 'theory', techDirection: 'ai', difficulty: 3, isFree: true, price: 0, instructor: '张伟', studentCount: 1560, ratingAvg: 4.7 },
      { title: 'AI 工程师认证课程', techSystem: 'cert', techDirection: 'ai', difficulty: 5, isFree: false, price: 599, instructor: '张伟', studentCount: 320, ratingAvg: 4.7 },
      { title: '大数据分析与应用', techSystem: 'theory', techDirection: 'bigdata', difficulty: 3, isFree: true, price: 0, instructor: '李娜', studentCount: 2100, ratingAvg: 4.7 },
      { title: 'Spark 大数据处理', techSystem: 'practice', techDirection: 'bigdata', difficulty: 4, isFree: false, price: 399, instructor: '李娜', studentCount: 680, ratingAvg: 4.5 },
      { title: '大数据工程师认证', techSystem: 'cert', techDirection: 'bigdata', difficulty: 5, isFree: false, price: 699, instructor: '李娜', studentCount: 410, ratingAvg: 4.6 },
      { title: '云计算基础与实战', techSystem: 'practice', techDirection: 'cloud', difficulty: 3, isFree: false, price: 299, instructor: '王强', studentCount: 540, ratingAvg: 4.5 },
      { title: 'Docker 与容器化部署', techSystem: 'theory', techDirection: 'cloud', difficulty: 2, isFree: true, price: 0, instructor: '王强', studentCount: 920, ratingAvg: 4.6 },
      { title: 'Web 前端开发', techSystem: 'theory', techDirection: 'web', difficulty: 2, isFree: true, price: 0, instructor: '陈晨', studentCount: 3200, ratingAvg: 4.9 },
      { title: 'Vue3 项目实战', techSystem: 'practice', techDirection: 'web', difficulty: 3, isFree: false, price: 99, instructor: '陈晨', studentCount: 1750, ratingAvg: 4.8 },
      { title: '移动端开发实战', techSystem: 'practice', techDirection: 'mobile', difficulty: 3, isFree: false, price: 159, instructor: '陈晨', studentCount: 460, ratingAvg: 4.4 },
    ];
    const courses = {};
    courseDefs.forEach((c, i) => { c._idx = i; });
    for (const c of courseDefs) {
      const defaults = {
        title: c.title,
        description: `${c.title}——系统讲解核心知识，配套实验与项目实战，适合${c.difficulty <= 2 ? '初学者' : c.difficulty <= 4 ? '有一定基础的学习者' : '高级进阶'}。`,
        cover: '',
        techSystem: c.techSystem,
        techDirection: c.techDirection,
        difficulty: c.difficulty,
        isFree: c.isFree,
        price: c.price,
        instructorId: ins[c.instructor].id,
        studentCount: c.studentCount,
        ratingAvg: c.ratingAvg,
        status: 1,
        publishedAt: new Date(Date.now() - c._idx * 864e5 * 2),
      };
      const [inst] = await Course.findOrCreate({ where: { title: c.title }, defaults });
      courses[c.title] = inst;
    }
    log(`课程 ${courseDefs.length} 门就绪`);

    for (const c of courseDefs) {
      const course = courses[c.title];
      if ((await CourseChapter.count({ where: { courseId: course.id } })) === 0) {
        const chapterTitles = ['基础概念与环境搭建', '核心原理讲解', '典型项目实战', '进阶与面试冲刺'];
        for (let i = 0; i < chapterTitles.length; i++) {
          await CourseChapter.create({
            courseId: course.id,
            title: `第${i + 1}章 ${chapterTitles[i]}`,
            content: `本章讲解《${c.title}》的${chapterTitles[i]}，包含知识点梳理与动手实验。`,
            sort: i + 1,
          });
        }
      }
    }
    log('课程章节就绪');

    const ratingDefs = [
      { course: 'Python 人工智能入门', user: 'student', rating: 5, comment: '讲解清晰，入门友好，强烈推荐！' },
      { course: 'Python 人工智能入门', user: 'student2', rating: 4, comment: '内容不错，希望多一些实战案例。' },
      { course: '机器学习算法精讲', user: 'student', rating: 5, comment: '算法推导很透彻，受益匪浅。' },
      { course: '机器学习算法精讲', user: 'student3', rating: 4, comment: '难度适中，配套习题很有帮助。' },
      { course: '大数据分析与应用', user: 'student2', rating: 5, comment: '案例丰富，贴近实际业务。' },
      { course: '大数据分析与应用', user: 'student3', rating: 5, comment: '老师讲得很好，物超所值。' },
      { course: 'Web 前端开发', user: 'student', rating: 5, comment: '前端入门第一课，好评。' },
      { course: 'Web 前端开发', user: 'student2', rating: 5, comment: '内容全面，适合零基础。' },
      { course: 'Vue3 项目实战', user: 'student', rating: 4, comment: '项目驱动，收获很多。' },
      { course: '深度学习实战', user: 'student3', rating: 4, comment: '内容硬核，需要一定数学基础。' },
      { course: 'Docker 与容器化部署', user: 'student2', rating: 5, comment: '容器化讲得很到位。' },
      { course: '云计算基础与实战', user: 'student3', rating: 4, comment: '实战部分很实用。' },
    ];
    for (const r of ratingDefs) {
      await CourseRating.findOrCreate({
        where: { courseId: courses[r.course].id, userId: users[r.user].id },
        defaults: { courseId: courses[r.course].id, userId: users[r.user].id, rating: r.rating, comment: r.comment },
      });
    }
    log(`评分 ${ratingDefs.length} 条就绪`);

    const learnDefs = [
      { user: 'student', course: 'Python 人工智能入门', fav: true, learning: true, progress: 65 },
      { user: 'student', course: '机器学习算法精讲', fav: true, learning: true, progress: 30 },
      { user: 'student', course: 'Web 前端开发', fav: false, learning: true, progress: 80 },
      { user: 'student', course: 'Vue3 项目实战', fav: true, learning: true, progress: 45 },
      { user: 'student', course: '深度学习实战', fav: true, learning: false, progress: 0 },
      { user: 'student2', course: '大数据分析与应用', fav: true, learning: true, progress: 55 },
      { user: 'student2', course: 'Docker 与容器化部署', fav: false, learning: true, progress: 90 },
      { user: 'student2', course: 'Web 前端开发', fav: true, learning: true, progress: 100 },
      { user: 'student2', course: 'Spark 大数据处理', fav: true, learning: false, progress: 0 },
      { user: 'student3', course: '机器学习算法精讲', fav: true, learning: true, progress: 20 },
      { user: 'student3', course: '大数据分析与应用', fav: true, learning: true, progress: 70 },
      { user: 'student3', course: '云计算基础与实战', fav: false, learning: true, progress: 40 },
    ];
    for (const l of learnDefs) {
      await UserCourse.findOrCreate({
        where: { userId: users[l.user].id, courseId: courses[l.course].id },
        defaults: {
          userId: users[l.user].id, courseId: courses[l.course].id,
          isFavorited: l.fav, isLearning: l.learning, progress: l.progress,
        },
      });
    }
    log(`学习记录 ${learnDefs.length} 条就绪`);

    const orderDefs = [
      { user: 'student', course: 'Vue3 项目实战', amount: 99, status: 'paid', payType: 'wechat' },
      { user: 'student', course: '深度学习实战', amount: 199, status: 'pending', payType: 'alipay' },
      { user: 'student2', course: 'Spark 大数据处理', amount: 399, status: 'paid', payType: 'wechat' },
      { user: 'student3', course: '云计算基础与实战', amount: 299, status: 'paid', payType: 'alipay' },
      { user: 'student3', course: 'AI 工程师认证课程', amount: 599, status: 'paid', payType: 'wechat' },
    ];
    for (const o of orderDefs) {
      const orderNo = `SEED-${users[o.user].id}-${courses[o.course].id}`;
      await Order.findOrCreate({
        where: { orderNo },
        defaults: {
          orderNo, userId: users[o.user].id, courseId: courses[o.course].id,
          amount: o.amount, status: o.status, payType: o.payType,
        },
      });
    }
    log(`订单 ${orderDefs.length} 条就绪`);

    const companyDefs = [
      { name: '华为云', intro: '全球领先的ICT基础设施和智能终端提供商', scale: '10000人以上' },
      { name: '字节跳动', intro: '全球化互联网与内容科技公司', scale: '10000人以上' },
      { name: '腾讯', intro: '世界领先的互联网科技公司', scale: '10000人以上' },
      { name: '阿里云', intro: '全球领先的云计算与人工智能科技公司', scale: '10000人以上' },
      { name: '百度', intro: '拥有强大互联网基础的领先AI公司', scale: '10000人以上' },
      { name: '美团', intro: '以吃为核心的生活服务电子商务平台', scale: '10000人以上' },
    ];
    const comp = {};
    for (const c of companyDefs) {
      const [inst] = await Company.findOrCreate({ where: { name: c.name }, defaults: c });
      comp[c.name] = inst;
    }
    log(`公司 ${companyDefs.length} 个就绪`);

    const jobDefs = [
      { title: 'AI 算法工程师', company: '华为云', category: '算法', salaryMin: 20, salaryMax: 40, city: '深圳', description: '负责AI模型研发与优化，参与端到端算法落地', requirements: '熟悉深度学习、Python、PyTorch，有NLP/CV项目经验' },
      { title: '大模型研发工程师', company: '字节跳动', category: '算法', salaryMin: 30, salaryMax: 60, city: '北京', description: '负责大语言模型预训练与微调', requirements: '熟悉Transformer、分布式训练、LLM微调' },
      { title: '大数据开发工程师', company: '字节跳动', category: '数据', salaryMin: 18, salaryMax: 35, city: '北京', description: '负责数据平台开发与数据治理', requirements: '熟悉Hadoop/Spark/Flink，有数仓经验' },
      { title: '数据分析师', company: '美团', category: '数据', salaryMin: 14, salaryMax: 25, city: '上海', description: '负责业务数据分析与可视化', requirements: '熟悉SQL、Python、Tableau，有业务sense' },
      { title: '前端开发工程师', company: '华为云', category: '前端', salaryMin: 15, salaryMax: 30, city: '上海', description: '负责Web前端开发与工程化', requirements: '熟悉Vue/React、TypeScript、Webpack/Vite' },
      { title: '后端开发工程师', company: '腾讯', category: '后端', salaryMin: 18, salaryMax: 33, city: '深圳', description: '负责高并发后端服务开发', requirements: '熟悉Node.js/Go、MySQL、Redis、微服务' },
      { title: '云架构师', company: '阿里云', category: '云计算', salaryMin: 25, salaryMax: 50, city: '杭州', description: '负责云原生架构设计与咨询', requirements: '熟悉K8s、Docker、云上架构最佳实践' },
      { title: '移动端开发工程师', company: '字节跳动', category: '移动', salaryMin: 16, salaryMax: 30, city: '北京', description: '负责iOS/Android客户端开发', requirements: '熟悉Flutter/原生开发，有性能优化经验' },
      { title: 'AI 产品经理', company: '百度', category: '算法', salaryMin: 20, salaryMax: 38, city: '北京', description: '负责AI产品规划与落地', requirements: '懂AI技术原理，有产品0-1经验' },
    ];
    const jobs = {};
    for (const j of jobDefs) {
      const { company, ...jobFields } = j;
      const [inst] = await Job.findOrCreate({
        where: { title: j.title },
        defaults: { ...jobFields, companyId: comp[company].id, status: 1 },
      });
      jobs[j.title] = inst;
    }
    log(`职位 ${jobDefs.length} 个就绪`);

    const favJobDefs = [
      { user: 'student', job: 'AI 算法工程师' },
      { user: 'student', job: '大模型研发工程师' },
      { user: 'student3', job: '数据分析师' },
    ];
    for (const f of favJobDefs) {
      await UserJob.findOrCreate({
        where: { userId: users[f.user].id, jobId: jobs[f.job].id },
        defaults: { userId: users[f.user].id, jobId: jobs[f.job].id, isFavorited: true },
      });
    }
    log('职位收藏就绪');

    const appDefs = [
      { user: 'student', job: 'AI 算法工程师', status: 'interview', resume: '熟练掌握Python与PyTorch，有图像分类项目经验', aiScore: 82, aiFeedback: '基础扎实，建议加强分布式训练与模型部署相关经验。' },
      { user: 'student3', job: '数据分析师', status: 'applied', resume: '熟悉SQL与Python数据分析，有电商数据分析实习经历' },
      { user: 'student2', job: '前端开发工程师', status: 'offer', resume: 'Vue3项目经验丰富，熟悉工程化与性能优化', aiScore: 88, aiFeedback: '前端能力突出，工程化理解深入，推荐通过。' },
    ];
    for (const a of appDefs) {
      await JobApplication.findOrCreate({
        where: { userId: users[a.user].id, jobId: jobs[a.job].id },
        defaults: {
          userId: users[a.user].id, jobId: jobs[a.job].id, status: a.status, resume: a.resume,
          aiInterviewScore: a.aiScore || null, aiInterviewFeedback: a.aiFeedback || null,
        },
      });
    }
    log(`职位申请 ${appDefs.length} 条就绪`);

    const notifDefs = [
      { user: 'student', type: 'course_update', title: '课程更新提醒', content: '你收藏的《深度学习实战》更新了新章节，快去看看吧！' },
      { user: 'student', type: 'plan_expire', title: '学习计划即将到期', content: '你的个性化学习计划还有3天到期，请及时查看进度。' },
      { user: 'student', type: 'system', title: '欢迎来到智慧教育平台', content: '小明你好！开始你的学习之旅吧。' },
      { user: 'student2', type: 'course_update', title: '课程更新提醒', content: '《Spark 大数据处理》上架了配套实验，欢迎学习。' },
      { user: 'student3', type: 'plan_expire', title: '学习计划即将到期', content: '你的学习计划本周到期，加油完成！' },
    ];
    for (const n of notifDefs) {
      await Notification.findOrCreate({
        where: { userId: users[n.user].id, title: n.title },
        defaults: { userId: users[n.user].id, type: n.type, title: n.title, content: n.content, isRead: false },
      });
    }
    log(`通知 ${notifDefs.length} 条就绪`);

    const postDefs = [
      { course: 'Python 人工智能入门', user: 'student', type: 'qa', title: '环境配置报错求助', content: '安装TensorFlow时提示版本不兼容，有同学遇到过吗？' },
      { course: 'Python 人工智能入门', user: 'teacher', type: 'discuss', title: '本周学习重点', content: '本周重点掌握NumPy数组运算与Pandas数据处理，建议完成课后习题。' },
      { course: '机器学习算法精讲', user: 'student2', type: 'qa', title: '梯度下降学习率怎么选', content: '不同学习率对收敛影响很大，有没有经验法则？' },
      { course: 'Web 前端开发', user: 'student', type: 'discuss', title: 'Vue响应式原理分享', content: '整理了一份Vue3响应式原理的学习笔记，分享给大家。' },
      { course: '大数据分析与应用', user: 'student3', type: 'discuss', title: 'Pandas实战心得', content: '用Pandas处理百万级数据的一些优化技巧总结。' },
    ];
    for (const p of postDefs) {
      await CommunityPost.findOrCreate({
        where: { title: p.title },
        defaults: { courseId: courses[p.course].id, userId: users[p.user].id, type: p.type, title: p.title, content: p.content },
      });
    }
    log(`社区帖 ${postDefs.length} 条就绪`);

    const assignDefs = [
      { user: 'student', course: 'Python 人工智能入门', title: '实现一个简单的线性回归', code: 'import numpy as np\ndef lr(X, y, lr=0.01, epochs=100):\n    w = 0\n    for _ in range(epochs):\n        grad = np.mean((w*X - y)*X)\n        w -= lr*grad\n    return w', score: 85, feedback: '实现正确，建议增加截距项与归一化处理，并补充注释。' },
      { user: 'student', course: 'Web 前端开发', title: '实现一个计数器组件', code: 'const { ref } = Vue\nconst count = ref(0)\nconst inc = () => count.value++', score: 90, feedback: '功能完整，可补充边界处理与单元测试。' },
      { user: 'student2', course: '大数据分析与应用', title: '用Pandas统计各品类销量', code: 'df.groupby("category")["sales"].sum().sort_values(ascending=False)', score: 78, feedback: '思路正确，建议处理空值并增加可视化输出。' },
    ];
    for (const a of assignDefs) {
      await Assignment.findOrCreate({
        where: { userId: users[a.user].id, title: a.title },
        defaults: { userId: users[a.user].id, courseId: courses[a.course].id, title: a.title, code: a.code, score: a.score, feedback: a.feedback },
      });
    }
    log(`作业 ${assignDefs.length} 条就绪`);

    const planJson = JSON.stringify([
      { stage: '第1阶段：夯实基础', goal: '掌握Python与数学基础', resources: '《Python 人工智能入门》第1-2章', duration: '2周' },
      { stage: '第2阶段：核心算法', goal: '理解机器学习十大算法', resources: '《机器学习算法精讲》全册', duration: '4周' },
      { stage: '第3阶段：项目实战', goal: '完成一个端到端AI项目', resources: '《深度学习实战》项目模块', duration: '3周' },
    ]);
    await LearningPlan.findOrCreate({
      where: { userId: users.student.id },
      defaults: { userId: users.student.id, planJson, expireAt: new Date(Date.now() + 21 * 864e5) },
    });
    log('学习计划就绪');

    console.log('\n========================================');
    console.log(' 演示数据写入完成');
    console.log('========================================');
    console.log('默认账号:');
    console.log('  管理员  admin / admin123');
    console.log('  教师    teacher / teacher123   teacher2 / teacher123');
    console.log('  学生    student / student123   student2 / student123   student3 / student123');
    console.log('========================================');
    process.exit(0);
  } catch (e) {
    console.error('种子数据失败:', e.message);
    process.exit(1);
  }
})();