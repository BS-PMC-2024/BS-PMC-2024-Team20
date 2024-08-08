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
        stage('Start Server') {
            steps {
                script {
                    // Start the server in the background
                    sh 'node server/index.js &'
                    sleep 10 // Wait for the server to start
                }
            }
        }
        stage('Start Firebase Emulators') {
            steps {
                sh 'firebase emulators:start --only firestore,auth &'
                sleep 10 // Wait for emulators to start
            }
        }
        stage('Run Admin Integration Tests') {
            steps {
                script {
                    // Generate a unique email based on the current date
                    def date = new Date().format("yyyyMMdd")
                    def adminEmail = "admin${date}@example.com"
                    def adminPassword = "password"
                    def adminFirstName = "Admin"
                    def adminLastName = "User"
                    def adminRole = "admin"

                    // Update the AdminIntegration.test.js file with the unique email
                    sh """
                        sed -i 's/admin5admin5@example.com/${adminEmail}/' tests/AdminIntegration.test.js
                    """

                    // Run the tests
                    sh 'npx jest tests/AdminIntegration.test.js --testEnvironment=node'
                }
            }
        }
        stage('Run Teacher Integration Tests') {
            steps {
                script {
                    // Generate a unique email based on the current date
                    def date = new Date().format("yyyyMMdd")
                    def teacherEmail = "teacher${date}@example.com"
                    def teacherPassword = "password"
                    def teacherFirstName = "Teacher"
                    def teacherLastName = "User"
                    def teacherRole = "teacher"

                    // Update the TeacherIntegration.test.js file with the unique email
                    sh """
                        sed -i 's/teacher@example.com/${teacherEmail}/' tests/TeacherIntegration.test.js
                    """

                    // Run the tests
                    sh 'npx jest tests/TeacherIntegration.test.js --testEnvironment=node'
                }
            }
        }
        stage('Stop Firebase Emulators and Server') {
            steps {
                sh 'kill $(lsof -t -i:8080)'
                sh 'kill $(lsof -t -i:9099)'
                sh 'kill $(lsof -t -i:5000)'
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
