pipeline {
    agent any

    environment {
        NODE_VERSION = '14.x'
        FIREBASE_PROJECT_ID = 'ai-aid'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Set Node Version') {
            steps {
                script {
                    // Set Node.js version
                    sh 'nvm install ${NODE_VERSION}'
                    sh 'nvm use ${NODE_VERSION}'
                }
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Start Firebase Emulators') {
            steps {
                sh 'firebase emulators:start --only firestore,auth &'
            }
        }
        stage('Run Admin Integration Tests') {
            steps {
                sh 'npx jest tests/AdminIntegration.test.js --testEnvironment=node'
            }
        }
        stage('Run Teacher Integration Tests') {
            steps {
                sh 'npx jest tests/TeacherIntegration.test.js --testEnvironment=node'
            }
        }
        stage('Stop Firebase Emulators') {
            steps {
                sh 'kill $(lsof -t -i:8080)'
                sh 'kill $(lsof -t -i:9099)'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Deploy to Firebase') {
            steps {
                sh 'firebase deploy --project ${FIREBASE_PROJECT_ID}'
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: '**/test-results.xml', allowEmptyArchive: true
            junit 'test-results.xml'
        }
        success {
            echo 'Build and tests were successful.'
        }
        failure {
            echo 'Build or tests failed.'
        }
    }
}
