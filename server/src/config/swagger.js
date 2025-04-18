const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger 기본 정보 설정
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CS Morning API',
      version: '1.0.0',
      description: '매일 아침 CS 면접 질문을 받아보는 서비스 API',
      contact: {
        name: 'CS Morning 개발팀',
        url: 'https://github.com/your-username/cs-morning-project'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://csmorning.co.kr' 
          : 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' ? '운영 서버' : '개발 서버'
      }
    ],
    // 보안 스키마 추가
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: '관리자 API 키'
        }
      },
      schemas: {}
    }
  },
  // API 경로를 자동으로 찾아볼 경로
  apis: [
    './src/docs/*.js'
  ]
};

const specs = swaggerJsdoc(options);

// Swagger UI 옵션 설정
const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true, // 페이지 새로고침 후에도 인증 유지
  }
};

// Express에 Swagger 미들웨어 등록
const setupSwagger = (app) => {
  app.use('/僕の話', swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));
  
  // Swagger JSON 엔드포인트
  app.get('/僕の話.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
  
  console.log(`📝 Swagger 문서가 사용 가능합니다: http://localhost:${process.env.PORT || 3000}/api-docs`);
};

module.exports = { setupSwagger };