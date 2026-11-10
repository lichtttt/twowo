const { AiConversation, AiMessage, UserCourse, Course, Assignment, LearningPlan, CourseRating } = require('../models');
const { success, fail } = require('../utils/response');
const aiService = require('../services/aiService');

exports.chat = async (req, res, next) => {
  try {
    const { conversationId, message, courseId } = req.body;
    let conv = conversationId ? await AiConversation.findByPk(conversationId) : null;
    if (!conv) {
      conv = await AiConversation.create({ userId: req.user.id, courseId, title: message.slice(0, 30) });
    }
    await AiMessage.create({ conversationId: conv.id, role: 'user', content: message });
    const history = await AiMessage.findAll({ where: { conversationId: conv.id }, order: [['created_at', 'ASC']] });
    const messages = history.map(m => ({ role: m.role, content: m.content }));
    let systemPrompt = '你是智慧教育平台的AI学习助手，请针对课程内容给出精准解答与知识点拓展。';
    if (courseId) {
      const course = await Course.findByPk(courseId);
      if (course) systemPrompt += `当前课程：《${course.title}》，简介：${course.description || ''}。请结合该课程内容回答。`;
    }
    const reply = await aiService.chat(messages, systemPrompt);
    await AiMessage.create({ conversationId: conv.id, role: 'assistant', content: reply });
    res.json(success({ conversationId: conv.id, reply }));
  } catch (e) { next(e); }
};

exports.conversations = async (req, res, next) => {
  try {
    const list = await AiConversation.findAll({ where: { userId: req.user.id }, order: [['created_at', 'DESC']] });
    res.json(success(list));
  } catch (e) { next(e); }
};

exports.conversationDetail = async (req, res, next) => {
  try {
    const conv = await AiConversation.findByPk(req.params.id);
    if (!conv || conv.userId !== req.user.id) return res.json(fail('会话不存在'));
    const messages = await AiMessage.findAll({ where: { conversationId: conv.id }, order: [['created_at', 'ASC']] });
    res.json(success({ conversation: conv, messages }));
  } catch (e) { next(e); }
};

exports.learningPath = async (req, res, next) => {
  try {
    const myCourses = await UserCourse.findAll({
      where: { userId: req.user.id, isLearning: true }, include: [Course],
    });
    const ratings = await CourseRating.findAll({ where: { userId: req.user.id } });
    const profile = {
      learned: myCourses.map(uc => ({ title: uc.Course.title, progress: uc.progress, direction: uc.Course.techDirection })),
      ratings: ratings.map(r => ({ rating: r.rating })),
    };
    const prompt = `根据以下学习记录与测试情况，生成个性化学习计划（JSON数组，每项含 stage、goal、resources、duration）。\n${JSON.stringify(profile)}`;
    const result = await aiService.chat([{ role: 'user', content: prompt }], '你是学习规划师，输出严格JSON数组。');
    let plan = result;
    try { plan = JSON.parse(result.match(/\[[\s\S]*\]/)[0]); } catch (_) {}
    const lp = await LearningPlan.create({ userId: req.user.id, planJson: JSON.stringify(plan), expireAt: new Date(Date.now() + 30 * 864e5) });
    res.json(success({ plan, expireAt: lp.expireAt }, '学习计划已生成'));
  } catch (e) { next(e); }
};

exports.grade = async (req, res, next) => {
  try {
    const { courseId, title, code } = req.body;
    const prompt = `请批改以下编程作业。\n题目：${title}\n代码：\n${code}\n请输出 JSON：{"score":0-100,"feedback":"评分理由与修改建议"}`;
    const result = await aiService.chat([{ role: 'user', content: prompt }], '你是编程教师，输出严格JSON。');
    let parsed = { score: 0, feedback: result };
    try { parsed = JSON.parse(result.match(/\{[\s\S]*\}/)[0]); } catch (_) {}
    const a = await Assignment.create({ userId: req.user.id, courseId, title, code, score: parsed.score, feedback: parsed.feedback });
    res.json(success(a, '批改完成'));
  } catch (e) { next(e); }
};

exports.report = async (req, res, next) => {
  try {
    const { period = 'week' } = req.query;
    const myCourses = await UserCourse.findAll({ where: { userId: req.user.id }, include: [Course] });
    const assignments = await Assignment.findAll({ where: { userId: req.user.id } });
    const summary = {
      period,
      totalCourses: myCourses.length,
      learningCourses: myCourses.filter(uc => uc.isLearning).length,
      avgProgress: myCourses.length ? Math.round(myCourses.reduce((s, uc) => s + uc.progress, 0) / myCourses.length) : 0,
      assignments: assignments.length,
      avgScore: assignments.length ? (assignments.reduce((s, a) => s + Number(a.score || 0), 0) / assignments.length).toFixed(1) : 0,
      weakPoints: myCourses.filter(uc => uc.progress < 50).map(uc => uc.Course.title),
    };
    const prompt = `根据学习数据生成结构化分析报告：${JSON.stringify(summary)}`;
    const analysis = await aiService.chat([{ role: 'user', content: prompt }], '你是学习分析师，生成结构化Markdown报告。');
    res.json(success({ summary, analysis }));
  } catch (e) { next(e); }
};