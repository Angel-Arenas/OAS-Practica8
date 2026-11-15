# ⚡ GUÍA RÁPIDA - DESPLIEGUE EN 15 MINUTOS

## 🎯 PASOS EXACTOS A SEGUIR

### ✅ PASO 1: Iniciar Minikube (2 min)
```bash
minikube start
```

### ✅ PASO 2: Crear Namespace (10 seg)
```bash
kubectl create namespace practica-s08
```

### ✅ PASO 3: Desplegar TODO (1 min)
```bash
kubectl apply -f k8s/01-app-configmap.yaml
kubectl apply -f k8s/02-db-secret.yaml
kubectl apply -f k8s/03-mongo-stack.yaml
kubectl apply -f k8s/04-backend-stack.yaml
```

**O EN UN SOLO COMANDO:**
```bash
kubectl apply -f k8s/ -n practica-s08
```

### ✅ PASO 4: Esperar que los Pods estén listos (2-3 min)
```bash
# Ver estado en tiempo real
kubectl get pods -n practica-s08 -w

# Esperar hasta ver:
# mongodb-xxxxx     1/1     Running
# backend-xxxxx     1/1     Running
```

---

## 📸 CAPTURAS PARA EL INFORME

### 📷 CAPTURA 1: Estado del Clúster
```bash
kubectl get pods,svc,configmaps,secrets -n practica-s08
```
**Debes ver:**
- ✅ 2 pods Running
- ✅ 2 servicios (backend-service NodePort + mongo-service ClusterIP)
- ✅ 1 ConfigMap (app-config)
- ✅ 1 Secret (db-secret)

---

### 📷 CAPTURA 2: Variables Inyectadas
```bash
# Obtener nombre del pod
export BACKEND_POD=$(kubectl get pod -n practica-s08 -l app=backend -o jsonpath="{.items[0].metadata.name}")

# Ver variables de entorno
kubectl exec -it $BACKEND_POD -n practica-s08 -- env | grep -E "DB_|APP_"
```

**Debes ver:**
```
DB_HOST=mongo-service
DB_NAME=myappdb
APP_PORT=3000
DB_USER=admin
DB_PASS=secret123
```

---

### 📷 CAPTURA 3: Acceso desde el Navegador
```bash
# Obtener la URL
minikube service backend-service -n practica-s08 --url
```

**Abre la URL en tu navegador** (ejemplo: `http://192.168.49.2:30080`)

Debes ver un JSON con:
```json
{
  "message": "🚀 API Backend funcionando correctamente",
  "environment": {
    "DB_HOST": "mongo-service",
    "DB_NAME": "myappdb",
    "APP_PORT": "3000"
  },
  "mongoStatus": "Conectado ✅"
}
```

---

## 🧪 COMANDOS EXTRAS DE VALIDACIÓN

### Ver logs del backend
```bash
kubectl logs -n practica-s08 -l app=backend --tail=50
```

### Ver logs de MongoDB
```bash
kubectl logs -n practica-s08 -l app=mongodb --tail=50
```

### Probar el endpoint /health
```bash
curl $(minikube service backend-service -n practica-s08 --url)/health
```

### Ver detalles del deployment del backend
```bash
kubectl describe deployment backend -n practica-s08
```

### Ver el Secret decodificado (para verificar)
```bash
# Ver el secret en base64
kubectl get secret db-secret -n practica-s08 -o yaml

# Decodificar manualmente
echo "YWRtaW4=" | base64 -d        # debe mostrar: admin
echo "c2VjcmV0MTIz" | base64 -d   # debe mostrar: secret123
```

---

## 🗑️ LIMPIAR TODO (después de la demostración)
```bash
kubectl delete namespace practica-s08
```

---

## 🎬 VIDEO DEMOSTRATIVO - GUION

1. **Mostrar terminal**: `kubectl get pods,svc -n practica-s08`
2. **Entrar al pod**: `kubectl exec -it <pod> -n practica-s08 -- env`
3. **Abrir navegador**: Acceder a la URL del servicio
4. **Explicar arquitectura**: Backend conectado a MongoDB interno
5. **Mostrar seguridad**: ConfigMap vs Secret (Base64)

---

## 📋 CHECKLIST FINAL

- [ ] Minikube iniciado
- [ ] Namespace creado
- [ ] ConfigMap desplegado
- [ ] Secret desplegado
- [ ] MongoDB corriendo (ClusterIP)
- [ ] Backend corriendo (NodePort)
- [ ] Variables inyectadas correctamente
- [ ] Acceso desde navegador funcional
- [ ] 3 capturas de pantalla tomadas
- [ ] Repositorio subido a GitHub
- [ ] Video grabado
- [ ] Documento Google con todo lo anterior

---

## 🔥 TIPS PRO

- Si el pod no inicia, ver logs: `kubectl logs <pod-name> -n practica-s08`
- Si MongoDB falla, aumentar tiempo de espera: `kubectl wait --for=condition=ready pod -l app=mongodb -n practica-s08 --timeout=180s`
- Para ver los eventos: `kubectl get events -n practica-s08 --sort-by='.lastTimestamp'`
- Si tienes problemas con NodePort en Windows, usa port-forward:
  ```bash
  kubectl port-forward -n practica-s08 svc/backend-service 8080:3000
  # Luego abre: http://localhost:8080
  ```

---

## ⏱️ TIEMPO ESTIMADO POR PASO

| Paso | Tiempo |
|------|--------|
| Iniciar Minikube | 2 min |
| Crear namespace | 10 seg |
| Aplicar manifiestos | 1 min |
| Esperar pods | 2-3 min |
| Validaciones | 2 min |
| Capturas | 3 min |
| **TOTAL** | **~10-12 min** |

¡Tiempo de sobra! 🎉
