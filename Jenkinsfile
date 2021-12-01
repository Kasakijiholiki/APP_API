
pipeline {
    agent any
    stages {
        stage('test') {
            steps {
          //   sh 'npm test -- --coverage'
             sh 'sonar-scanner \
  -Dsonar.projectKey=app_api \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://49.0.198.122:9000 \
  -Dsonar.login=de385abedf8e6593cb8725f2179fae173c904ed6'
            }
        }
    }
 
}
