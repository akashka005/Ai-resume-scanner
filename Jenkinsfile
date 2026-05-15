pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = "resume-scanner-backend"
        DOCKER_IMAGE_FRONTEND = "resume-scanner-frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Build') {
            steps {
                dir('backend') {
                    sh 'docker build -t ${DOCKER_IMAGE_BACKEND} .'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh 'docker build -t ${DOCKER_IMAGE_FRONTEND} .'
                }
            }
        }

        stage('Deploy (Docker Compose)') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
