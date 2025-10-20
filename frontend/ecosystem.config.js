require("dotenv").config({ path: "../.env.deploy" });

const {
  DEPLOY_USER = "user",
  DEPLOY_HOST = "51.250.34.72",
  DEPLOY_SSH_KEY = "~/.ssh/mesto-vm",
  FRONTEND_DST = "/home/user/mesto-frontend",
  REPO_URL = "git@github.com:fijispawn/nodejs-pm2-deploy.git",
  REF = "origin/main",
  FRONTEND_PATH = "/home/user/apps/mesto-frontend",
} = process.env;

module.exports = {
  apps: [],

  deploy: {
    frontend: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: REF,
      repo: REPO_URL,
      path: FRONTEND_PATH,
      ssh_options: [`-i ${DEPLOY_SSH_KEY}`, "-o StrictHostKeyChecking=no"],

      "pre-deploy-local": `
        cd frontend &&
        npm ci &&
        npm run build &&
        ssh -i ${DEPLOY_SSH_KEY} ${DEPLOY_USER}@${DEPLOY_HOST} 'mkdir -p ${FRONTEND_DST}' &&
        rsync -az --delete -e "ssh -i ${DEPLOY_SSH_KEY}" dist/ ${DEPLOY_USER}@${DEPLOY_HOST}:${FRONTEND_DST}/
      `,

      "post-deploy": `
        sudo nginx -t && sudo systemctl reload nginx
      `,
    },
  },
};
