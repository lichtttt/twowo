const sequelize = require('../config/database');
const User = require('./User');
const Instructor = require('./Instructor');
const Course = require('./Course');
const CourseChapter = require('./CourseChapter');
const CourseRating = require('./CourseRating');
const UserCourse = require('./UserCourse');
const Order = require('./Order');
const Company = require('./Company');
const Job = require('./Job');
const JobApplication = require('./JobApplication');
const UserJob = require('./UserJob');
const AiConversation = require('./AiConversation');
const AiMessage = require('./AiMessage');
const LearningPlan = require('./LearningPlan');
const Assignment = require('./Assignment');
const Notification = require('./Notification');
const CommunityPost = require('./CommunityPost');

Instructor.belongsTo(User, { foreignKey: 'userId' });
Course.belongsTo(Instructor, { foreignKey: 'instructorId', as: 'instructor' });
CourseChapter.belongsTo(Course, { foreignKey: 'courseId' });
CourseRating.belongsTo(Course, { foreignKey: 'courseId' });
CourseRating.belongsTo(User, { foreignKey: 'userId', as: 'user' });
UserCourse.belongsTo(User, { foreignKey: 'userId' });
UserCourse.belongsTo(Course, { foreignKey: 'courseId' });
Order.belongsTo(User, { foreignKey: 'userId' });
Order.belongsTo(Course, { foreignKey: 'courseId' });
Job.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
JobApplication.belongsTo(User, { foreignKey: 'userId' });
JobApplication.belongsTo(Job, { foreignKey: 'jobId' });
UserJob.belongsTo(User, { foreignKey: 'userId' });
UserJob.belongsTo(Job, { foreignKey: 'jobId' });
AiConversation.belongsTo(User, { foreignKey: 'userId' });
AiConversation.belongsTo(Course, { foreignKey: 'courseId' });
AiMessage.belongsTo(AiConversation, { foreignKey: 'conversationId' });
LearningPlan.belongsTo(User, { foreignKey: 'userId' });
Assignment.belongsTo(User, { foreignKey: 'userId' });
Assignment.belongsTo(Course, { foreignKey: 'courseId' });
Notification.belongsTo(User, { foreignKey: 'userId' });
CommunityPost.belongsTo(User, { foreignKey: 'userId', as: 'user' });
CommunityPost.belongsTo(Course, { foreignKey: 'courseId' });

module.exports = {
  sequelize, User, Instructor, Course, CourseChapter, CourseRating,
  UserCourse, Order, Company, Job, JobApplication, UserJob,
  AiConversation, AiMessage, LearningPlan, Assignment, Notification, CommunityPost,
};