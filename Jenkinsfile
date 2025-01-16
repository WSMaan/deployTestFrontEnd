pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID = "583187964056"
        AWS_REGION = "us-east-2"
        ECR_REPOSITORY_NAME = "examninja"
        FRONTEND_DIR = "deployTestFrontEnd"
        BACKEND_DIR = "deployTestBackEnd"
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        NODE_ENV = "production" // Add this line
    }
    stages {
        stage('Setup AWS Credentials') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws_key']]) {
                    echo 'AWS Credentials configured'
                }
            }
        }
        stage('Clone Repositories') {
            steps {
                dir('backend') {
                    git branch: 'master', url: 'https://github.com/WSMaan/deployTestBackEnd.git', credentialsId: 'GIT_HUB'
                }
                dir('frontend') {
                    git branch: 'master', url: 'https://github.com/WSMaan/deployTestFrontEnd.git', credentialsId: 'GIT_HUB'
                }
            }
        }
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'mvn clean install'
                }
            }
        }
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npx start'
                }
            }
        }
        stage('Build Docker Images') {
            steps {
                dir('backend') {
                    sh "docker build -t ${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}:backend ."
                }
                dir('frontend') {
                    sh "docker build -t ${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}:frontend ."
                }
            }
        }
        stage('Push Docker Images to ECR') {
            steps {
                script {
                    // Log in to ECR and push Docker images
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws_key']]) {
                        sh '''
                        aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
                        docker push ${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}:backend
                    //    docker push ${ECR_REGISTRY}/${ECR_REPOSITORY_NAME}:frontend
                        '''
                    }
                }
            }
        }
        stage('Deploy to EKS') {
            steps {
                script {
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws_key']]) {
                        // Configure kubectl for the EKS cluster
                        sh '''
                        export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
                        export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
                        export AWS_REGION=us-east-2
                        aws eks --region $AWS_REGION update-kubeconfig --name exam
                        '''
                        // Clone repositories to ensure files are available
                        dir('deployTestBackEnd') {
                            git branch: 'master', url: 'https://github.com/WSMaan/deployTestBackEnd.git', credentialsId: 'GIT_HUB'
                            sh '''
                            kubectl apply -f k8s/backend-deployment.yaml
                            '''
                        }
                       // dir('deployTestFrontEnd') {
                       //      git branch: 'master', url: 'https://github.com/WSMaan/deployTestFrontEnd.git', credentialsId: 'GIT_HUB'
                       //      sh '''
                       //      kubectl apply -f k8s/frontend-deployment.yaml
                       //      '''
                       //  }
                    }
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
        failure {
            script {
                echo "Pipeline failed in stage: ${env.STAGE_NAME}"
            }
        }
        success {
            echo 'Pipeline succeeded!'
        }
    }
}
