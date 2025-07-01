pipeline {
  agent any

  environment {
    NODE_ENV = "production"
    REMOTE_HOST = 'yessica@192.168.111.50'
    APP_DIR = '/home/yessica/app'
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
        sh '''
          npm install --save-dev eslint@8.57.0
          if [ -f eslint.config.js ] || [ -f .eslintrc.js ] || [ -f .eslintrc.json ]; then
            npx eslint src --quiet || true
          else
            echo "⚠️ ESLint no se ejecutó: no se encontró configuración válida"
          fi
        '''
      }
    }

    stage('SCA - Análisis de dependencias (Dependency-Check)') {
      steps {
        sh '''
          rm -rf dependency-check dependency-check-report.html dc.zip
          curl -L https://github.com/jeremylong/DependencyCheck/releases/download/v8.4.0/dependency-check-8.4.0-release.zip -o dc.zip
          unzip -q dc.zip
          ./dependency-check/bin/dependency-check.sh \
            --project gestion-cursos-node \
            --scan . \
            --format HTML \
            --out dependency-check-report.html \
            --disableAssembly || true
        '''
      }
    }

    stage('SBOM - Inventario de componentes (Syft)') {
      steps {
        script {
          def dockerExists = sh(script: "command -v docker || true", returnStdout: true).trim()
          if (dockerExists) {
            sh 'docker run --rm -v $(pwd):/app anchore/syft dir:/app -o json > sbom.json || true'
          } else {
            echo "⚠️ Docker no está disponible dentro del contenedor Jenkins. Saltando Syft."
          }
        }
      }
    }

    stage('Prueba SSH') {
      steps {
        sshagent(credentials: ['clave-ssh-produccion']) {
          sh '''
            echo "🔐 Probando conexión SSH con $REMOTE_HOST"
            ssh -o StrictHostKeyChecking=no $REMOTE_HOST "echo ✅ Conexión SSH exitosa" || echo "❌ Falló conexión SSH"
          '''
        }
      }
    }

    stage('Despliegue remoto por SSH') {
      steps {
        sshagent(credentials: ['clave-ssh-produccion']) {
          sh """
            ssh -o StrictHostKeyChecking=no \$REMOTE_HOST '
              mkdir -p "${APP_DIR}" &&
              docker stop gestion-cursos-node || true &&
              docker rm gestion-cursos-node || true
            '

            if ! command -v rsync >/dev/null 2>&1; then
              echo "❌ ERROR: rsync no está instalado en Jenkins. Instálalo con: apt-get update && apt-get install rsync"
              exit 1
            fi

            rsync -av --delete \
              --exclude='.git' \
              --exclude='node_modules' \
              --exclude='sbom.json' \
              --exclude='dc.zip' \
              --exclude='dependency-check' \
              ./ \$REMOTE_HOST:"${APP_DIR}"

            ssh \$REMOTE_HOST '
              cd "${APP_DIR}" &&
              docker compose down &&
              docker compose up -d --build
            '
          """
        }
      }
    }

  }

  post {
    always {
      echo '🧹 Limpieza de artefactos temporales'
      sh 'rm -rf dependency-check dc.zip sbom.json || true'
    }
    failure {
      echo '❌ El pipeline falló. Verificar errores en la salida.'
    }
    success {
      echo '✅ Pipeline ejecutado exitosamente.'
    }
  }
}

