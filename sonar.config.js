import sonarqubeScanner from 'sonarqube-scanner';
import dotenv from "dotenv";

dotenv.config();

sonarqubeScanner.scan(
  {
    serverUrl: 'https://sonarcloud.io',
    token: process.env.SONAR_TOKEN,
    options: {
      'sonar.projectKey': 'hrqlv',
      'sonar.organization': 'hrqlv',
      'sonar.projectName': 'bookAPI',
      'sonar.projectVersion': '1.0',
      'sonar.sources': 'tests',
      'sonar.junit.reportPaths': 'test-results/results.xml',
      'sonar.exclusions': 'node_modules/**,coverage/**,test-results/**',
    },
  },
  () => process.exit()
);