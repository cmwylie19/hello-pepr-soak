# Soak Test

deploy the module and watch logs in one terminal


```bash
kubectl apply -f dist/pepr-module-6233c672-7fca-5603-8e90-771828dd30fa.yaml
kubectl create ns pepr-demo
sleep 5
kubectl wait --for=condition=read po -l pepr.dev/controller=watcher --timeout=300s
kubectl logs -n pepr-system -l pepr.dev/controller=watcher -f | jq 'select(.url != "/healthz")'
```

In another terminal create a `ConfigMap` every 60 seconds

```bash
for x in $(seq 999);
do
kubectl create cm a-$x -n pepr-demo --from-literal=a=a;
sleep 60; 
done
```

In another terminal get secrets every 60 seconds

```bash
for x in $(seq 999);
do
kubectl get secret -n pepr-demo;
sleep 60; 
done
```


**CORRECT RESULT** - There is always a corresponding secret for each configmap
