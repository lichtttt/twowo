const axios = require('axios');
const config = require('../config');

async function chat(messages, systemPrompt) {
  if (!config.ai.apiKey) {
    return mockChat(messages, systemPrompt);
  }
  const payload = {
    model: config.ai.model,
    messages: [],
    temperature: 0.7,
  };
  if (systemPrompt) payload.messages.push({ role: 'system', content: systemPrompt });
  payload.messages = payload.messages.concat(messages);
  const resp = await axios.post(`${config.ai.apiBase}/chat/completions`, payload, {
    headers: { Authorization: `Bearer ${config.ai.apiKey}`, 'Content-Type': 'application/json' },
    timeout: 60000,
  });
  return resp.data.choices[0].message.content;
}

function mockChat(messages, systemPrompt) {
  const last = messages[messages.length - 1];
  const q = last ? last.content : '';
  return `[AI 演示模式 - 未配置 AI_API_KEY]\n\n针对你的问题「${q}」，这是一条模拟回复。配置 AI_API_KEY 后将获得真实大模型解答。\n\n相关知识点拓展：建议结合课程内容深入理解核心概念，并通过实践巩固。`;
}

module.exports = { chat };