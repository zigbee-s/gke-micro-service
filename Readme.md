# Project Title
Building and Deploying a Microservice Application on Kubernetes using 

# Project Description
This project demonstrates how to build and deploy a simple microservice application using Node.js and Express on Kubernetes. The application is containerized using Docker, and the image is pushed to DockerHub. Deployment to Kubernetes is done using Helm, which allows for easy management and configuration of Kubernetes resources.

The project also covers the creation of an Ingress, which routes requests to the microservice application. This allows for easy access to the application from a single endpoint, and simplifies the management of multiple services.

This project is useful for developers who want to learn how to build and deploy microservice applications on Kubernetes, and how to use Docker and Helm to simplify the deployment process. It is also a great starting point for anyone who wants to learn about containerization and Kubernetes, as it covers the basic concepts and provides a step-by-step guide to building and deploying a microservice application.


* Coding a simple microservice application using Node.js and express 
* Creating a Dockerfile to build an image and then deploy it to the DockerHub 
* Deploying it to the Kubernetes.  
* Creating Ingress to route requests to our services  
* The deployment will be done using helm


## Link to step wise implementation:  [docs](https://docs.google.com/document/d/1Se7oRsR-ZcMXefU6vqFt-WXo3KglDhFj0uyVLBrrCbk/edit?usp=sharing)
---
---
---

#  Notes 

# Google Kubernetes Services
## Kubernetes
## Clusters

* Combination of worker nodes and master node

## kubectl
Command line tool for interacting with kubernetes

### Commands
* kubectl get events/pods/depoymeny/services/replicaset
* kubectl explain pods
* kubectl describe pod pod_name>
* kubectl delete pod
* kubectl scale deployment deployment_name --replicas=3
* kubectl get rs -o wide
* kubectl set image deployment hello-world-rest-api hello-world-rest-api=in28min/hello-world-rest-api:0.0.2.RELEASE
* kubectl rollout status deployment deplyment_name
* kubectl rollout undo deployment deployment_name --to-revision=3
* kubectl log pod_name
* kubectl get deployment hello-from-gauraang-api -o yaml > deployment.yaml
* kubectl get service hello-from-gauraang-api -o yaml > service.yaml
* kubectl apply -f deployment.yaml
* kubectl delete all -l app=pod_label
* kubectl get services kube-dns --namespace=kube-system
* kubectl run curl --image=radial/busyboxplus:curl -i --tty
* kubectl apply -f ingress.yaml
* kubectl get serviceaccount

## Pod

* Pod is a collection of containers that can run on a host. This resource is
created by clients and scheduled onto hosts.
* Smallest depoyable units in kubernetes
* Provides a way to put containers together
* Each pod has a unique IP address
* Runs in the default name space
* Namespaces provide isolation
* Labels and selectors helps in tying up services together
* kubectl get componentstatuses
* kubectl get all
* kubectl get pods -l app=my_label
* kubectl cluster-info
* kubectl top node/pod
* kubectl get pv
* kubectl get pvc
* kubectl create configmap configfile_name --from-literal=RDS_DB_NAME=todos
* kubectl create secret generic secretfile_name --from-literal=RDS_PASSWORD=dummytodos

## ReplicaSets

* Ensures a specific number of pods are running at all times
* When you update the image to a newer version using: 
A new replica set is created with pods having the new image and the older replica set's desired pods will be made 0 and scales down
* Can work without a deployment, definition or template is same for the replica set as that of the deployment(Without the field of strategy)

## Services

* Pods IP addresses can get changed when deleted or creation of a new pod
* Services provide always available extternal interface to the applications running inside the pod
* LoadBalancer Service: This is done through google cloud load balancer
* ClusterIp Service: This service can only be accessed through inside the cluster

## Master Node

* etcd (distributed database), stores all the configuration details, deployments, desired state, scaling operations,  etc
* kube-apiserver (API Server), changes made through kubectl are submitted to API server and then further processed
* kube-schedular (Schedular), schedules the pods on the correct nodes
* kube-controller-manager (Controller Manager), It makes sure actual state of the kubernetes cluster matches the desired state
* If a master node goes down, services can still keep working

## Worker Node

* kubelet (Node agent), makes sure it monitors whats happening on the node and reports back to controller manager
* kube-proxy (Networking Component), provides networking like exposing deployment
* Container run time, provides capability to run nodes (many differrent types of CRI available)
* PODS

## How to avoid downtime ?

* use minReadySeconds: 45 (for first 45 seconds pods are given the chance to start up)
* (As containers might not be able to provide a response jst after being set up, i.e not properly intialized yet)

## Setup two different deployments with the same service

* Its possible because services are connected to PODS and not deployment
* My adjusting Labels, and then sepcifying particular in the selector of Service template

## Deploy using a WAR file

* Simply copy war file to the right path within the container

## Yaml files
```
apiVersion: apps/v1
kind: Deployment                                  # Type of file
metadata:                           
name: nginx-deployment
labels:
app: nginx
spec:
replicas: 3
selector:                                     # Defines how the deployment will match against pods 
matchLabels:                                   
app: nginx
strategy:
rollingUpdate:
maxSurge: 25%
maxUnavailable: 25%
type: RollingUpdate
template:
metadata:                                 # Evrything from here is definition of pod
labels:                             
app: nginx                        # Labels are used to match the pod with deployments and services
spec:                           
containers:                  # Containers inside the pod, can contain multiple container having multiple images     
- name: nginx
image: nginx:1.14.2
imagePullPolicy: IfNotPresent/ALways       # What will happen if image is already present
ports:
- containerPort: 80
restartPolicy: Always                 # If a container doesn't start then restart
terminationGracePeriodSeconds: 30     # When a container is stopped it will be given 30 secs to clear all its work
```

```
apiVersion: v1
kind: Service
metadata:
name: my-cip-service
spec:
selector:                                     # Matches services with the Pods using labels
app: metrics
department: sales
sessionAffinity: None/ClientIP                # If requests from a user goes to single pod or different pods
type: ClusterIP/LoadBalancer/NodePort
ports:                                              
- protocol: TCP
port: 80
targetPort: 8080
```
## Deplying different containers connecting to each other

* Create a docker compose file
* Use kompose to convert it to kubernetes comaptible files
* In case of services that use storage like MYSql a persistent storage is used and an extra file for the same is created
* "--ignore-db-dir=lost+found" is added in the args of Mysql, as a persistent storafe has a directory present called lost+found, and the MySql doesn't like that

## Persistent Volume Claim

* Provides a certain amount of storage
* A persistent volume maps an external storage into our cluster
* Persistennt Volume Claim is how a pod can ask for persistent volume

## Config Maps and Secrets

* Helps in storing environment variables and configurations
* kubectl create configmap configfile_name --from-literal=RDS_DB_NAME=todos
* In containers in deployment add:* 
```
- name: RDS_DB_NAME
valueFrom:
configMapKeyRef:
key: RDS_DB_NAME
name: configfile_name
```
* Use: kubectl apply -f deployment.yaml
* Use: kubectl edit configmap/configfile_name
* Add the rest of config key:values
* Restart application by scaling to 0 and then 1
* kubectl create secret generic secretfile_name --from-literal=RDS_PASSWORD=dummytodos* 
* In containers in deployment add:* 
```
- name: RDS_PASSWORD
valueFrom:
secretKeyRef:
key: RDS_PASSWORD
name: secretfile_name
```
* kubectl apply -f deployment.yaml

## Deploying microservices

* Deploy Each service as a different deployment
* Expose each deployment
* To allow services to access each other there are two ways: 1)Using environment Variables2)Using DNS services
* To check if the CoreDns service is runninng in your cluster use: kubectl get services kube-dns --namespace=kube-system
* To test Dns service run : kubectl run curl --image=radial/busyboxplus:curl -i --tty
* Then, hit enter and run nslookup my-nginx

Ingress / Avoiding use of multiple Load balancer for each service in a microservice architecture

* It allows you to have 1 load balancer through which you can send request to different microservices
* Defined using ingress.yaml
```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
name: minimal-ingress
annotations:
nginx.ingress.kubernetes.io/rewrite-target: /
spec:
ingressClassName: nginx-example
rules:
- http:
paths:
- path: /testpath
pathType: Prefix
backend:
service:
name: test
port:
number: 80
- path: /testpath2
pathType: Prefix
backend:
service:
name: test2
port:
number: 80
```
* kubectl apply -f ingress.yaml
* And change LoadBalancers to NodePort

## RBAC | Cluster Role Binding

* Mapping a service account to a role on the cluster in order to able to view all the information on the kubernetes cluster
* Call kubernetes api services from within the applicaiton
* kubectl get serviceaccount

## Auto scaling approaches

* Increase the number of nodes based on the workload (Cluster autoscaling)
* Increase the number of pods to utilize node resources beter (Horizontal pod autoscaling). Ways: 
1) kubectl autoscale deployment currency-exchange --min=1 --max=3 -cpu-percent=70
* Increase the resource limits of POD (Vertical pod autoscaling). Ways:
1) gcloud container cluster create [cluster_name] --enable-vertical-pod-autoscaling --cluster-version=1.14.7
2) gcloud container cluster update [cluster_name] --enable-vertical-pod-autoscaling
3) configure VPA

## Distributed tracing | Google Stackdriver

* Trace the request across multiple microservices
* Check CPU utilization
* You should reduce the trace rate, i.e no. of requests are traced
* Go to API's and services, and enable services related to StackDriver API, StrackDriverr Login API, STrackDriver trace API, StrackDriver reporting API

## Service Mesh | Istio

* 
It allows to put functionalities that are common to each container or a micro service in a different container, which is assosciated with a container inside a pod

* The second container performing service mesh inside a pod is also called sidecar
* Istio is one of the most popular service mesh implementations

## Helm

* Package manager for kubernetes
* Execute multiple scripts in a order
* Manage releases
* Charts: A package of scripts used to deply the app, can be published to a repisotory
* Release: Installation of a specific version of chart on the kubernetes cluster
* Has a server side component (Helm tiller) and a client side component
