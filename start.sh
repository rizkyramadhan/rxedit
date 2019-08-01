#!/usr/bin/env bash
sudo pkill node
cd backend && yarn start &
cd frontend && yarn start &