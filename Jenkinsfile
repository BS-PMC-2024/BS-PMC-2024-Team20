/*
//old version of the pipeline without the testing
pipeline {
    agent any
    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("shimonbaruch/ai-aid", ".")
                }
            }
        }
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_HUB_USERNAME', passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
                    script {
                        docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                            docker.image("shimonbaruch/ai-aid").push('latest')
                        }
                    }
                }
            }
        }
    }
}
*/
// new version after adding the sdk to the jenkins Credentials.
pipeline {
    agent any
    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("shimonbaruch/ai-aid", ".")
                }
            }
        }
        stage('Start Server') {
            steps {
                withCredentials([file(credentialsId: 'firebase-admin-sdk', variable: 'SERVICE_ACCOUNT_JSON')]) {
                    script {
                        // Run the container with root privileges
                        docker.image("shimonbaruch/ai-aid").inside("-u root") {
                            // Copy the secret file into the container
                            sh 'cp $SERVICE_ACCOUNT_JSON /app/server/ai-aid-firebase-adminsdk-c313i-1bdc26f499.json'
                            // Start the server
                            sh 'node /app/server/index.js &'
                            // Wait for the server to start
                            sh 'sleep 10'
                        }
                    }
                }
            }
        }
        stage('Run Admin Integration Tests') {
            steps {
                script {
                    docker.image("shimonbaruch/ai-aid").inside("-u root") {
                        // Run the Admin integration tests
                        sh 'firebase emulators:exec "npx jest tests/admin/AdminIntegration.test.js"'
                    }
                }
            }
        }
        stage('Run Teacher Integration Tests') {
            steps {
                script {
                    docker.image("shimonbaruch/ai-aid").inside("-u root") {
                        // Run the Teacher integration tests
                        sh 'firebase emulators:exec "npx jest tests/Teacher/TeacherIntegration.test.js"'
                    }
                }
            }
        }
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_HUB_USERNAME', passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
                    script {
                        docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                            docker.image("shimonbaruch/ai-aid").push('latest')
                        }
                    }
                }
            }
        }
    }
}
