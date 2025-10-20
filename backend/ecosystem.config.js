require("dotenv").config({ path: "../.env.deploy" });

const {
  DEPLOY_USER = "user",
  DEPLOY_HOST = "51.250.34.72",
  DEPLOY_SSH_KEY = "~/.ssh/mesto-vm",
  BACKEND_PATH = "/home/user/apps/mesto-api",
  REPO_URL = "git@github.com:fijispawn/nodejs-pm2-deploy.git",
  REF = "origin/main",
} = process.env;

module.exports = {
  apps: [
    {
      name: "mesto-api",
      cwd: __dirname,
      script: "npm",
      args: "start",
      env: { NODE_ENV: "production" },
    },
  ],

  deploy: {
    backend: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: REF,
      repo: REPO_URL,
      path: BACKEND_PATH,
      ssh_options: [`-i ${DEPLOY_SSH_KEY}`, "-o StrictHostKeyChecking=no"],

      "pre-deploy-local": `
        ssh -i ${DEPLOY_SSH_KEY} ${DEPLOY_USER}@${DEPLOY_HOST} 'mkdir -p ${BACKEND_PATH}/shared' &&
        scp -i ${DEPLOY_SSH_KEY} ../backend/.env ${DEPLOY_USER}@${DEPLOY_HOST}:${BACKEND_PATH}/shared/.env
      `,

      "post-deploy": `
        cd current/backend && npm ci &&
        cp ../../shared/.env .env &&
        pm2 reload backend/ecosystem.config.js --only mesto-api --env production
      `,
    },
  },
};
