import sonarqubeScanner from 'sonarqube-scanner';

sonarqubeScanner.scan(
  {
    serverUrl: 'https://sonarcloud.io',
    token: '3bbadb3bf1496cd8c95170c9eacca39387d3dbab',
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