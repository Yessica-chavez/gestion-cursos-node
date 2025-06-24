pipeline {
  agent any

  environment {
    NODE_ENV = "production"
    REMOTE_HOST = 'yessica@192.168.111.50'
    APP_DIR = '/home/yessica/app' // Ruta de despliegue en el servidor remoto
  }

  tools {
    nodejs "Node18"
  }

  stages {
    stage('Clonar repositorio') {
      steps {
        git branch: 'main', url: 'https://github.com/Yessica-chavez/gestion-cursos-node.git'
      }
    }

    stage('SAST - Análisis de código (ESLint)') {
      steps {
        sh 'npm install eslint --save-dev'
        sh './node_modules/.bin/eslint src --quiet || true'
      }
    }

    stage('SCA - Análisis de dependencias (Dependency-Check)') {
      steps {
        sh '''
          curl -L https://github.com/jeremylong/DependencyCheck/releases/download/v8.4.0/dependency-check-8.4.0-release.zip -o dc.zip
          unzip -q dc.zip
          ./dependency-check/bin/dependency-check.sh --project gestion-cursos-node --scan . || true
        '''
      }
    }

    stage('SBOM - Inventario de componentes (Syft)') {
      steps {
        sh 'docker run --rm -v $(pwd):/app anchore/syft dir:/app -o json > sbom.json || true'
      }
    }

    stage('Despliegue remoto por SSH') {
      steps {
        sshagent(credentials: ['clave-ssh-produccion']) {
          sh """
            ssh -o StrictHostKeyChecking=no \$REMOTE_HOST '
              mkdir -p \$APP_DIR &&
              docker stop gestion-cursos-node || true &&
              docker rm gestion-cursos-node || true
            '

            # Sincronizar archivos (excluyendo lo innecesario)
            rsync -av --delete \\
              --exclude='.git' \\
              --exclude='node_modules' \\
              --exclude='sbom.json' \\
              --exclude='dc.zip' \\
              --exclude='dependency-check' \\
              ./ \$REMOTE_HOST:\$APP_DIR/

            # Construir y desplegar en el servidor remoto
            ssh \$REMOTE_HOST '
              cd \$APP_DIR &&
              docker compose down &&
              docker compose up -d --build
            '
          """
        }
      }
    }
  }
}
