pipeline {
  agent any

  environment {
    NODE_ENV = "development"
  }

  stages {
    stage('Clonar código') {
      steps {
        git 'https://github.com/Yessica-chavez/gestion-cursos-node.git'
      }
    }

    stage('Instalar dependencias') {
      steps {
        sh 'npm install'
      }
    }

    stage('Test (opcional)') {
      steps {
        echo 'No hay pruebas automatizadas definidas.'
      }
    }

    stage('Construir imagen Docker') {
      steps {
        sh 'docker build -t gestion-cursos-node .'
      }
    }

    stage('Levantar contenedores') {
      steps {
        sh 'docker compose up -d'
      }
    }
  }
}
