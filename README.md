# Soak Test

- [Background](#background)
- [Cluster Setup](#cluster-setup)
- [Get Started](#get-started)
- [Results](#results)

## Background

The idea is that Pepr create a Watch connection with the Kubernetes API Server for `Pods` with labels `api` and `bug` and for `Secrets` with label `deletedeletedelete`  in `pepr-demo` namespace.

A successful soak should result in:
1. No pods in the `pepr-demo` namespace
2. No secrets in the `pepr-demo` namespace

The Watcher deployment is running at `LOG_LEVEL` debug while the admission deployment is on info to keep the irrelvent noise down.


## Cluster Setup

Create a kind cluster with auditing.  

```yaml
cat <<EOF > audit-policy.yaml
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
- level: Metadata
EOF
cat <<EOF > kind-config.yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: ClusterConfiguration
    apiServer:
        # enable auditing flags on the API server
        extraArgs:
          audit-log-path: /var/log/kubernetes/kube-apiserver-audit.log
          audit-policy-file: /etc/kubernetes/policies/audit-policy.yaml
        # mount new files / directories on the control plane
        extraVolumes:
          - name: audit-policies
            hostPath: /etc/kubernetes/policies
            mountPath: /etc/kubernetes/policies
            readOnly: true
            pathType: "DirectoryOrCreate"
          - name: "audit-logs"
            hostPath: "/var/log/kubernetes"
            mountPath: "/var/log/kubernetes"
            readOnly: false
            pathType: DirectoryOrCreate
  # mount the local file on the control plane
  extraMounts:
  - hostPath: ./audit-policy.yaml
    containerPath: /etc/kubernetes/policies/audit-policy.yaml
    readOnly: true
EOF
kind create cluster --config kind-config.yaml
```

Make sure you got audit logs

```bash
docker exec kind-control-plane cat /var/log/kubernetes/kube-apiserver-audit.log
```

Troubleshoot

```bash
docker exec kind-control-plane ls /etc/kubernetes/policies
```

expected
```bash
audit-policy.yaml
```

API SErver contain the mounts and arugments?

```bash
docker exec kind-control-plane cat /etc/kubernetes/manifests/kube-apiserver.yaml | grep audit
```

expected

```yaml
    - --audit-log-path=/var/log/kubernetes/kube-apiserver-audit.log
    - --audit-policy-file=/etc/kubernetes/policies/audit-policy.yaml
      name: audit-logs
      name: audit-policies
    name: audit-logs
    name: audit-policies
```


## Get Started 

deploy the module and watch logs in one terminal

```yaml
kubectl apply -f dist
```

Logs

```bash
 k logs -n pepr-system -l pepr.dev/controller=watcher -f | jq 'select(.url != "/healthz")'
``` 


In another terminal create a `ConfigMap` every 60 seconds

```yaml
kubectl apply -f -<<EOF
apiVersion: v1
kind: Namespace
metadata:
  creationTimestamp: null
  name: pepr-demo
  labels:
    istio-injection: enabled
spec: {}
status: {}
---
apiVersion: batch/v1
kind: CronJob
metadata:
  creationTimestamp: null
  name: podgen0
  namespace: pepr-demo
spec:
  jobTemplate:
    metadata:
      creationTimestamp: null
      name: podgen
    spec:
      ttlSecondsAfterFinished: 5
      template:
        metadata:
          creationTimestamp: null
          labels:
            bug: "reproduce"
            api: "call"
        spec:
          containers:
          - image: ubuntu
            command: ["sh","-c","sleep 10"]
            name: sleepanddie
            resources: {}
          restartPolicy: Never
  schedule: 0/1 * * * *
status: {}
---
apiVersion: batch/v1
kind: CronJob
metadata:
  creationTimestamp: null
  name: podgen1
  namespace: pepr-demo
spec:
  jobTemplate:
    metadata:
      creationTimestamp: null
      name: podgen
    spec:
      ttlSecondsAfterFinished: 5
      template:
        metadata:
          creationTimestamp: null
          labels:
            bug: "reproduce"
            api: "call"
        spec:
          containers:
          - image: ubuntu
            command: ["sh","-c","sleep 10"]
            name: sleepanddie
            resources: {}
          restartPolicy: Never
  schedule: 0/1 * * * *
status: {}
---
apiVersion: batch/v1
kind: CronJob
metadata:
  creationTimestamp: null
  name: podgen2
  namespace: pepr-demo
spec:
  jobTemplate:
    metadata:
      creationTimestamp: null
      name: podgen
    spec:
      ttlSecondsAfterFinished: 5
      template:
        metadata:
          creationTimestamp: null
          labels:
            bug: "reproduce"
            api: "call"
        spec:
          containers:
          - image: ubuntu
            command: ["sh","-c","sleep 10"]
            name: sleepanddie
            resources: {}
          restartPolicy: Never
  schedule: 0/1 * * * *
status: {}
---
apiVersion: batch/v1
kind: CronJob
metadata:
  creationTimestamp: null
  name: podgen3
  namespace: pepr-demo
spec:
  jobTemplate:
    metadata:
      creationTimestamp: null
      name: podgen
    spec:
      ttlSecondsAfterFinished: 5
      template:
        metadata:
          creationTimestamp: null
          labels:
            bug: "reproduce"
            api: "call"
        spec:
          containers:
          - image: ubuntu
            command: ["sh","-c","sleep 10"]
            name: sleepanddie
            resources: {}
          restartPolicy: Never
  schedule: 0/1 * * * *
status: {}
---
apiVersion: batch/v1
kind: CronJob
metadata:
  creationTimestamp: null
  name: podgen4
  namespace: pepr-demo
spec:
  jobTemplate:
    metadata:
      creationTimestamp: null
      name: podgen
    spec:
      ttlSecondsAfterFinished: 5
      template:
        metadata:
          creationTimestamp: null
          labels:
            bug: "reproduce"
            api: "call"
        spec:
          containers:
          - image: ubuntu
            command: ["sh","-c","sleep 10"]
            name: sleepanddie
            resources: {}
          restartPolicy: Never
  schedule: 0/1 * * * *
status: {}
---
apiVersion: batch/v1
kind: CronJob
metadata:
  creationTimestamp: null
  name: podgen5
  namespace: pepr-demo
spec:
  jobTemplate:
    metadata:
      creationTimestamp: null
      name: podgen
    spec:
      ttlSecondsAfterFinished: 5
      template:
        metadata:
          creationTimestamp: null
          labels:
            bug: "reproduce"
            api: "call"
        spec:
          containers:
          - image: ubuntu
            command: ["sh","-c","sleep 10"]
            name: sleepanddie
            resources: {}
          restartPolicy: Never
  schedule: 0/1 * * * *
status: {}
---
apiVersion: batch/v1
kind: CronJob
metadata:
  creationTimestamp: null
  name: podgen6
  namespace: pepr-demo
spec:
  jobTemplate:
    metadata:
      creationTimestamp: null
      name: podgen
    spec:
      ttlSecondsAfterFinished: 5
      template:
        metadata:
          creationTimestamp: null
          labels:
            bug: "reproduce"
            api: "call"
        spec:
          containers:
          - image: ubuntu
            command: ["sh","-c","sleep 10"]
            name: sleepanddie
            resources: {}
          restartPolicy: Never
  schedule: 0/1 * * * *
status: {}
---
apiVersion: batch/v1
kind: CronJob
metadata:
  creationTimestamp: null
  name: podgen7
  namespace: pepr-demo
spec:
  jobTemplate:
    metadata:
      creationTimestamp: null
      name: podgen
    spec:
      ttlSecondsAfterFinished: 5
      template:
        metadata:
          creationTimestamp: null
          labels:
            bug: "reproduce"
            api: "call"
        spec:
          containers:
          - image: ubuntu
            command: ["sh","-c","sleep 10"]
            name: sleepanddie
            resources: {}
          restartPolicy: Never
  schedule: 0/1 * * * *
status: {}
---
apiVersion: batch/v1
kind: CronJob
metadata:
  creationTimestamp: null
  name: podgen8
  namespace: pepr-demo
spec:
  jobTemplate:
    metadata:
      creationTimestamp: null
      name: podgen
    spec:
      ttlSecondsAfterFinished: 5
      template:
        metadata:
          creationTimestamp: null
          labels:
            bug: "reproduce"
            api: "call"
        spec:
          containers:
          - image: ubuntu
            command: ["sh","-c","sleep 10"]
            name: sleepanddie
            resources: {}
          restartPolicy: Never
  schedule: 0/1 * * * *
status: {}
---
apiVersion: batch/v1
kind: CronJob
metadata:
  creationTimestamp: null
  name: podgen9
  namespace: pepr-demo
spec:
  jobTemplate:
    metadata:
      creationTimestamp: null
      name: podgen
    spec:
      ttlSecondsAfterFinished: 5
      template:
        metadata:
          creationTimestamp: null
          labels:
            bug: "reproduce"
            api: "call"
        spec:
          containers:
          - image: ubuntu
            command: ["sh","-c","sleep 10"]
            name: sleepanddie
            resources: {}
          restartPolicy: Never
  schedule: 0/1 * * * *
status: {}
EOF
```


Watch for secrets and pods, because if any stick around then you have reproduced the issue:

```bash
while true; do
  kubectl get secret,po -n pepr-demo --no-headers
  sleep 5
  clear
done
```

Watch the Watch Controller pods:

```bash
kubectl logs -n pepr-system -l pepr.dev/controller=watcher -f | jq 'select(.url != "/healthz")'
```

Watch the audit logs

```bash
while true; do
  docker exec kind-control-plane cat /var/log/kubernetes/kube-apiserver-audit.log | tail | jq
  sleep 5
done
```

## Results 

**April 25** 
 - Kind ( 10 CronJobs )
```bash
└─[0] <git:(main 9db6935) > k get cj,po,secret -n pepr-demo
NAME                    SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
cronjob.batch/podgen0   0/1 * * * *   False     0        37s             128m
cronjob.batch/podgen1   0/1 * * * *   False     0        37s             128m
cronjob.batch/podgen2   0/1 * * * *   False     0        37s             128m
cronjob.batch/podgen3   0/1 * * * *   False     0        37s             128m
cronjob.batch/podgen4   0/1 * * * *   False     0        37s             128m
cronjob.batch/podgen5   0/1 * * * *   False     0        37s             128m
cronjob.batch/podgen6   0/1 * * * *   False     0        37s             128m
cronjob.batch/podgen7   0/1 * * * *   False     0        37s             128m
cronjob.batch/podgen8   0/1 * * * *   False     0        37s             128m
cronjob.batch/podgen9   0/1 * * * *   False     0        37s             128m
```
 - Kind (amd64) (No Errors - 1 CronJob)
```bash
case@brickell-ave:~$ k get cj,po,secret -n pepr-demo
NAME                   SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
cronjob.batch/podgen   0/1 * * * *   False     0        18s             172m
```
 - Kind 
```bash
┌─[cmwylie19@Cases-MacBook-Pro] - [~/hello-pepr-soak] - [2024-04-25 12:59:31]
└─[0] <git:(main cd8ab79) > k get cj,secret,po -n pepr-demo 
NAME                   SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
cronjob.batch/podgen   0/1 * * * *   False     0        49s             175m
```
## Random Debugging /Ignore


```bash
kubectl apply -f -<<EOF
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: test
    batch.kubernetes.io/job-name: "yes"
    service.istio.io/canonical-name: "yes"
    zarf.dev/agent: ignore 
  name: testt
  namespace: neuvector
spec:
  containers:
  - image: ubuntu
    command: ["sh", "-c", "sleep 9999"]
    name: test
    resources: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}
EOF
```
```bash
kubectl apply -f dist/pepr-module-6233c672-7fca-5603-8e90-771828dd30fa.yaml
kubectl create ns pepr-demo
sleep 15
kubectl wait --for=condition=read po -l pepr.dev/controller=watcher --timeout=300s
kubectl logs -n pepr-system -l pepr.dev/controller=watcher -f | jq 'select(.url != "/healthz")'
```
`jq 'select(.msg | test("^Watch event.+"))' `
`jq 'select(.msg | test("^EndpointSlice.+"))' `
```bash
k logs -n pepr-system deploy/pepr-uds-core-watcher --since=1h |jq 'select(.msg | test("^Processing Pod.+"))' | less

k logs -n pepr-system deploy/pepr-uds-core-watcher --since=1h |jq 'select(.msg | test("^Invalid pod.+"))' | less

k logs -n pepr-system deploy/pepr-uds-core-watcher --since=1h | egrep "for istio job termination" | jq 'select(.msg | test("neuvector-updater-pod-28563738-z8s9l "))'


kubectl get events --field-selector involvedObject.name=pod_name

k logs -n pepr-system pepr-uds-core-watcher-b8d8c5c5b-mzh45  --since=5m  | jq 'select(.url != "/healthz")' | jq 'select(.msg | test("^Processing Pod.+"))' | grep Processing
```

```
apiVersion: v1
data:
  a: YQ==
kind: Secret
metadata:
  creationTimestamp: null
  name: t
  namespace: pepr-demo
  labels:
    deletedeletedelete: "yes"
```
