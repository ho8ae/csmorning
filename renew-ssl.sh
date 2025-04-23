#!/bin/bash
cd ~/cs-morning-project
docker-compose run --rm certbot renew
docker-compose restart nginx
