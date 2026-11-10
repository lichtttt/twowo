const { sequelize } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
    await sequelize.sync({ alter: true });
    console.log('表结构同步完成');
    process.exit(0);
  } catch (e) {
    console.error('初始化失败:', e.message);
    process.exit(1);
  }
})();