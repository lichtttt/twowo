const axios = require('axios');
const config = require('../config');

function isConfigured() {
  return !!(config.ai.apiBase && config.ai.apiKey && config.ai.model);
}

function configStatus() {
  return {
    configured: isConfigured(),
    apiBase: config.ai.apiBase || '(未设置)',
    model: config.ai.model || '(未设置)',
    hasKey: !!config.ai.apiKey,
  };
}

async function chat(messages, systemPrompt, options = {}) {
  if (!isConfigured()) {
    return mockChat(messages, systemPrompt);
  }
  const payload = {
    model: config.ai.model,
    messages: [],
    temperature: options.temperature ?? 0.7,
  };
  if (options.maxTokens) payload.max_tokens = options.maxTokens;
  if (systemPrompt) payload.messages.push({ role: 'system', content: systemPrompt });
  payload.messages = payload.messages.concat(messages);

  try {
    const resp = await axios.post(`${config.ai.apiBase}/chat/completions`, payload, {
      headers: { Authorization: `Bearer ${config.ai.apiKey}`, 'Content-Type': 'application/json' },
      timeout: options.timeout ?? 60000,
    });
    const content = resp.data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('AI 返回内容为空，请检查模型 ID 是否正确');
    return content;
  } catch (err) {
    const status = err.response?.status;
    if (status === 401) {
      throw new Error('AI API Key 无效或已过期（401），请检查 backend/.env 中的 AI_API_KEY');
    }
    if (status === 403) {
      throw new Error('AI 调用被拒绝（403），可能 Key 无该模型权限或欠费');
    }
    if (status === 429) {
      throw new Error('AI 调用频率超限（429），请稍后重试');
    }
    if (err.code === 'ECONNABORTED') {
      throw new Error('AI 调用超时，请稍后重试或检查网络/代理是否可用');
    }
    if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
      throw new Error(`无法连接 AI 服务地址 ${config.ai.apiBase}，请检查 AI_API_BASE 与网络`);
    }
    const msg = err.response?.data?.error?.message || err.message;
    throw new Error(`AI 调用失败：${msg}`);
  }
}

function mockChat(messages, systemPrompt) {
  const last = messages[messages.length - 1];
  const q = last ? last.content : '';
  return [
    '[AI 演示模式 - 未配置真实大模型]',
    '',
    `针对你的问题「${q}」，这是一条模拟回复。`,
    '请在 backend/.env 中配置 AI_API_BASE、AI_API_KEY、AI_MODEL 三项后即可获得真实大模型解答。',
    '',
    '相关知识点拓展：建议结合课程内容深入理解核心概念，并通过实践巩固。',
  ].join('\n');
}

module.exports = { chat, isConfigured, configStatus };