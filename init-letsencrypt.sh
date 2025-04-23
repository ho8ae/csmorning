#!/bin/bash

# 도메인과 이메일 설정
domains=(csmorning.co.kr www.csmorning.co.kr)
email="xogh22422@naver.com"

# 스크립트 디렉토리로 이동
cd "$(dirname "$0")"

# 디렉토리 확인/생성
mkdir -p ./certbot/conf ./certbot/www

# 임시 nginx 설정 생성
cat > ./nginx/conf.d/default.conf << 'EOT'
server {
    listen 80;
    server_name csmorning.co.kr www.csmorning.co.kr;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 "Hello, World!";
    }
}
EOT

# docker-compose.yml 생성
cat > docker-compose.yml << 'EOT'
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    container_name: nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
  
  certbot:
    image: certbot/certbot
    container_name: certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
EOT

# 기존 컨테이너 정리 (있는 경우)
docker-compose down

# Docker Compose 실행
docker-compose up -d

# 잠시 대기
echo "Waiting for nginx to start..."
sleep 5

# 외부 접속 테스트 가능한지 안내
echo "Now, please check if you can access http://csmorning.co.kr in your browser."
echo "You should see 'Hello, World!' message."
echo "Wait for DNS propagation if needed (this can take up to 24-48 hours, but usually much less)."
read -p "Press Enter to continue with SSL certificate installation..." dummy

# 인증서 발급
docker-compose run --rm certbot certonly --webroot -w /var/www/certbot \
  ${domains[@]/#/-d } \
  --email $email \
  --agree-tos \
  --no-eff-email

# 인증서 발급 성공 확인
if [ ! -d "./certbot/conf/live/csmorning.co.kr" ]; then
  echo "Certificate issuance failed. Check logs and DNS settings."
  exit 1
fi

# HTTPS 설정 생성
cat > ./nginx/conf.d/default.conf << 'EOT'
server {
    listen 80;
    server_name csmorning.co.kr www.csmorning.co.kr;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name csmorning.co.kr www.csmorning.co.kr;

    ssl_certificate /etc/letsencrypt/live/csmorning.co.kr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/csmorning.co.kr/privkey.pem;
    
    # SSL 파라미터 추가
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;

    # 기본 응답
    location / {
        return 200 "HTTPS is working on csmorning.co.kr!";
    }
}
EOT

# Nginx 재시작
docker-compose restart nginx

echo "SSL setup completed! Now you can configure your actual services."
