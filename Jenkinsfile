pipeline {
    agent any

    environment {
        DOTENV = readFile('.env').split("\n").collectEntries { entry ->
            def pair = entry.split("=")
            [(pair.first().trim()): pair.last().trim()]
        }
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("shimonbaruch/ai-aid")
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                        dockerImage.push()
                    }
                }
            }
        }
    }
}
