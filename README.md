# 🚀 S08 | AP6 - Proyecto Kubernetes: Backend + MongoDB

## ⚡ DESPLIEGUE RÁPIDO (< 15 minutos)

### 1️⃣ Pre-requisitos
```bash
# Verificar que Minikube está corriendo
minikube status

# Si no está iniciado:
minikube start
```

### 2️⃣ Desplegar TODO (UN SOLO COMANDO)
```bash
# Crear namespace y desplegar todos los recursos
kubectl create namespace practica-s08
kubectl apply -f k8s/ -n practica-s08
```

### 3️⃣ Verificar Despliegue
```bash
# Ver todos los recursos (CAPTURA 1)
kubectl get pods,svc,configmaps,secrets -n practica-s08

# Esperar a que los pods estén Running
kubectl wait --for=condition=ready pod -l app=backend -n practica-s08 --timeout=120s
```

### 4️⃣ Verificar Variables de Entorno (CAPTURA 2)
```bash
# Obtener nombre del pod del backend
export BACKEND_POD=$(kubectl get pod -n practica-s08 -l app=backend -o jsonpath="{.items[0].metadata.name}")

# Ver variables inyectadas
kubectl exec -it $BACKEND_POD -n practica-s08 -- env | grep -E "DB_|APP_"
```

### 5️⃣ Acceder a la Aplicación (CAPTURA 3)
```bash
# Obtener URL del servicio
minikube service backend-service -n practica-s08 --url

# O usar port-forward:
kubectl port-forward -n practica-s08 svc/backend-service 8080:3000
# Luego abrir: http://localhost:8080
```

---

## 📊 ARQUITECTURA

```
┌─────────────────────────────────────────┐
│         Kubernetes Cluster              │
│  ┌───────────────────────────────────┐  │
│  │   Namespace: practica-s08         │  │
│  │                                   │  │
│  │  ┌──────────────┐  ┌───────────┐ │  │
│  │  │   Backend    │→ │  MongoDB  │ │  │
│  │  │  (NodePort)  │  │(ClusterIP)│ │  │
│  │  └──────────────┘  └───────────┘ │  │
│  │        ↑                          │  │
│  │        │                          │  │
│  │   ConfigMap + Secret              │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 📁 ESTRUCTURA DEL PROYECTO

```
/
├── k8s/
│   ├── 01-app-configmap.yaml    # Variables no sensibles
│   ├── 02-db-secret.yaml        # Credenciales en Base64
│   ├── 03-mongo-stack.yaml      # MongoDB Deployment + Service
│   └── 04-backend-stack.yaml    # Backend Deployment + Service
├── src/
│   ├── app.js                   # Código Node.js
│   ├── package.json
│   └── Dockerfile
└── README.md
```

---

## 🔐 SEGURIDAD

### ConfigMap (Variables NO sensibles)
- `DB_HOST`: mongo-service
- `DB_NAME`: myappdb
- `APP_PORT`: 3000

### Secret (Credenciales en Base64)
- `DB_USER`: admin (base64: YWRtaW4=)
- `DB_PASS`: secret123 (base64: c2VjcmV0MTIz)

---

## 🧪 COMANDOS DE VALIDACIÓN

```bash
# Ver logs del backend
kubectl logs -n practica-s08 -l app=backend

# Ver logs de MongoDB
kubectl logs -n practica-s08 -l app=mongodb

# Entrar al pod del backend
kubectl exec -it -n practica-s08 $BACKEND_POD -- sh

# Ver descripción del deployment
kubectl describe deployment backend -n practica-s08

# Limpiar todo
kubectl delete namespace practica-s08
```

---

## 📸 CAPTURAS REQUERIDAS

1. **Estado del Clúster**: `kubectl get pods,svc,configmaps,secrets -n practica-s08`
2. **Variables Inyectadas**: `kubectl exec -it <pod> -n practica-s08 -- env`
3. **Navegador**: Acceso a `http://<MINIKUBE_IP>:<NODEPORT>`

---

## 👨‍💻 AUTOR

**Curso**: Orquestación y Automatización de Software  
**Sesión**: S08 | AP6  
**Fecha**: 2024

---

## 🎓 CONCEPTOS APLICADOS

✅ Namespace para aislamiento  
✅ ConfigMap para configuración no sensible  
✅ Secret para credenciales (Base64)  
✅ ClusterIP para comunicación interna  
✅ NodePort para exposición externa  
✅ Inyección de variables con `envFrom`
