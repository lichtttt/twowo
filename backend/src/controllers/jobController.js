const { Op } = require('sequelize');
const { Job, Company, UserJob, JobApplication, Notification } = require('../models');
const { success, fail } = require('../utils/response');
const aiService = require('../services/aiService');

exports.list = async (req, res, next) => {
  try {
    const { category, keyword, city, page = 1, pageSize = 12 } = req.query;
    const where = { status: 1 };
    if (category) where.category = category;
    if (city) where.city = city;
    if (keyword) {
      where[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { '$company.name$': { [Op.like]: `%${keyword}%` } },
      ];
    }
    const { rows, count } = await Job.findAndCountAll({
      where, include: [{ model: Company, as: 'company' }],
      order: [['created_at', 'DESC']],
      limit: Number(pageSize), offset: (Number(page) - 1) * Number(pageSize),
    });
    res.json(success({ list: rows, total: count, page: Number(page), pageSize: Number(pageSize) }));
  } catch (e) { next(e); }
};

exports.detail = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id, { include: [{ model: Company, as: 'company' }] });
    if (!job) return res.json(fail('职位不存在'));
    let userState = null;
    if (req.user) {
      const fav = await UserJob.findOne({ where: { userId: req.user.id, jobId: job.id } });
      const app = await JobApplication.findOne({ where: { userId: req.user.id, jobId: job.id } });
      userState = { favorited: fav ? fav.isFavorited : false, applied: !!app, application: app };
    }
    res.json(success({ job, userState }));
  } catch (e) { next(e); }
};

exports.toggleFavorite = async (req, res, next) => {
  try {
    const jobId = Number(req.params.id);
    let uj = await UserJob.findOne({ where: { userId: req.user.id, jobId } });
    if (uj) { await uj.update({ isFavorited: !uj.isFavorited }); }
    else { uj = await UserJob.create({ userId: req.user.id, jobId, isFavorited: true }); }
    res.json(success({ isFavorited: uj.isFavorited }));
  } catch (e) { next(e); }
};

exports.apply = async (req, res, next) => {
  try {
    const jobId = Number(req.params.id);
    const { resume } = req.body;
    const exist = await JobApplication.findOne({ where: { userId: req.user.id, jobId } });
    if (exist) return res.json(fail('已申请该职位'));
    const app = await JobApplication.create({ userId: req.user.id, jobId, resume, status: 'applied' });
    res.json(success(app, '申请成功'));
  } catch (e) { next(e); }
};

exports.aiInterview = async (req, res, next) => {
  try {
    const jobId = Number(req.params.id);
    const job = await Job.findByPk(jobId, { include: [{ model: Company, as: 'company' }] });
    if (!job) return res.json(fail('职位不存在'));
    const { answers } = req.body;
    const prompt = `你是一名资深技术面试官。职位：${job.title}（${job.company ? job.company.name : ''}）。
要求：${job.requirements || ''}。
候选人回答：${JSON.stringify(answers || '无，请基于岗位进行模拟面试评价')}。
请输出 JSON：{"score":0-100,"feedback":"评价与建议"}`;
    const result = await aiService.chat([{ role: 'user', content: prompt }], '你是AI面试官，输出严格JSON。');
    let parsed = { score: 0, feedback: result };
    try { parsed = JSON.parse(result.match(/\{[\s\S]*\}/)[0]); } catch (_) {}
    const app = await JobApplication.findOne({ where: { userId: req.user.id, jobId } });
    if (app) {
      await app.update({ aiInterviewScore: parsed.score, aiInterviewFeedback: parsed.feedback, status: 'interview' });
    } else {
      await JobApplication.create({ userId: req.user.id, jobId, aiInterviewScore: parsed.score, aiInterviewFeedback: parsed.feedback, status: 'interview' });
    }
    res.json(success(parsed, 'AI面试完成'));
  } catch (e) { next(e); }
};