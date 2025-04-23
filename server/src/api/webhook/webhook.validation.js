const Joi = require('joi');

const messageSchema = Joi.object({
  // 카카오 챗봇 스킬 API 스키마
  userRequest: Joi.object({
    user: Joi.object({
      id: Joi.string().required(),
      properties: Joi.object().optional()
    }).required(),
    utterance: Joi.string().required(),
    params: Joi.object().optional(),
    timezone: Joi.string().optional(),
    lang: Joi.string().optional()
  }).required(),
  
  action: Joi.object({
    name: Joi.string().optional(),
    clientExtra: Joi.object().optional(),
    params: Joi.object().optional(),
    id: Joi.string().optional(),
    detailParams: Joi.object().optional()
  }).required(),
  
  bot: Joi.object({
    id: Joi.string().optional(),
    name: Joi.string().optional()
  }).optional(),
  
  contexts: Joi.array().optional()
}).unknown(true);

module.exports = {
  messageSchema
};