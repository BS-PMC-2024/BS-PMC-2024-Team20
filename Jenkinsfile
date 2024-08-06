/*
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
                script {
                    docker.image("shimonbaruch/ai-aid").inside {
                        // Start the server in the background
                        sh 'node server/index.js &'
                        // Give the server some time to start
                        sh 'sleep 10'
                    }
                }
            }
        }
        stage('Run Admin Integration Tests') {
            steps {
                script {
                    docker.image("shimonbaruch/ai-aid").inside {
                        // Run the Admin integration tests
                        sh 'firebase emulators:exec "npx jest tests/admin/AdminIntegration.test.js"'
                    }
                }
            }
        }
        stage('Run Teacher Integration Tests') {
            steps {
                script {
                    docker.image("shimonbaruch/ai-aid").inside {
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


