pipeline {
    agent any
    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("my-react-app", ".")
                }
            }
        }
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_HUB_USERNAME', passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
                    script {
                        docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                            docker.image("my-react-app").push('latest')
                        }
                    }
                }
            }
        }
    }
}
