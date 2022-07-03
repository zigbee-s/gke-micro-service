
<h2> Description </h2>
This project demonstrates following concepts:
<ul>
    <li>Coding a simple microservice application using Node.js and express </li>
    <li>Creating a Dockerfile to build an image and then deploy it to the DockerHub </li>
    <li>Deploying it to the Kubernetes. </li> 
    <li>Creating Ingress to route requests to our services </li> 
    <li>The deployment will be done using helm</li>
</ul>

<h3>Link to step wise implementation:  <link>https://docs.google.com/document/d/1Se7oRsR-ZcMXefU6vqFt-WXo3KglDhFj0uyVLBrrCbk/edit?usp=sharing</link>
<hr>
<hr>
<hr>

<h2> Notes </h2>
<p>
    <h1>Google Kubernetes Services</h1>
    <h3>Kubernetes</h3>
    <h3>Clusters</h3>
    <ul>
        <li>Combination of worker nodes and master node</li>
        <li></li>
    </ul>
    <h3>kubectl</h3>
    <ul>
        <li>Command line tool for interacting with kubernetes</li>
        <h4>Commands</h4>
        <li>kubectl get events/pods/depoymeny/services/replicaset</li>
        <li>kubectl explain pods</li>
        <li>kubectl describe pod pod_name></li>
        <li>kubectl delete pod</li>
        <li>kubectl scale deployment deployment_name --replicas=3</li>
        <li>kubectl get rs -o wide</li>
        <li>kubectl set image deployment hello-world-rest-api hello-world-rest-api=in28min/hello-world-rest-api:0.0.2.RELEASE</li>
        <li>kubectl rollout status deployment deplyment_name</li>
        <li>kubectl rollout undo deployment deployment_name --to-revision=3</li>
        <li>kubectl log pod_name</li>
        <li>kubectl get deployment hello-from-gauraang-api -o yaml > deployment.yaml</li>
        <li>kubectl get service hello-from-gauraang-api -o yaml > service.yaml</li>
        <li>kubectl apply -f deployment.yaml</li>
        <li>kubectl delete all -l app=pod_label</li>
        <li>kubectl get services kube-dns --namespace=kube-system</li>
        <li>kubectl run curl --image=radial/busyboxplus:curl -i --tty</li>
        <li>kubectl apply -f ingress.yaml</li>
        <li>kubectl get serviceaccount</li>
    </ul>
    <h3>Pod</h3>
    <ul>
        <li>Pod is a collection of containers that can run on a host. This resource is
        created by clients and scheduled onto hosts.</li>
        <li>Smallest depoyable units in kubernetes</li>
        <li>Provides a way to put containers together</li>
        <li>Each pod has a unique IP address</li>
        <li>Runs in the default name space</li>
        <li>Namespaces provide isolation</li>
        <li>Labels and selectors helps in tying up services together</li>
        <li>kubectl get componentstatuses</li>
        <li>kubectl get all</li>
        <li>kubectl get pods -l app=my_label</li>
        <li>kubectl cluster-info</li>
        <li>kubectl top node/pod</li>
        <li>kubectl get pv</li>
        <li>kubectl get pvc</li>
        <li>kubectl create configmap configfile_name --from-literal=RDS_DB_NAME=todos</li>
        <li>kubectl create secret generic secretfile_name --from-literal=RDS_PASSWORD=dummytodos</li>
    </ul>
    <h3>ReplicaSets</h3>
    <ul>
        <li>Ensures a specific number of pods are running at all times</li>
        <li>When you update the image to a newer version using: <br>
        A new replica set is created with pods having the new image and the older replica set's desired pods will be made 0 and scales down</li>
        <li>Can work without a deployment, definition or template is same for the replica set as that of the deployment(Without the field of strategy)</li>
    </ul>
    <h3>Services</h3>
    <ul>
        <li>Pods IP addresses can get changed when deleted or creation of a new pod</li>
        <li>Services provide always available extternal interface to the applications running inside the pod</li>
        <li>LoadBalancer Service: This is done through google cloud load balancer</li>
        <li>ClusterIp Service: This service can only be accessed through inside the cluster</li>
    </ul>
    <h3>Master Node</h3>
    <ul>
        <li>etcd (distributed database), stores all the configuration details, deployments, desired state, scaling operations,  etc</li>
        <li>kube-apiserver (API Server), changes made through kubectl are submitted to API server and then further processed</li>
        <li>kube-schedular (Schedular), schedules the pods on the correct nodes</li>
        <li>kube-controller-manager (Controller Manager), It makes sure actual state of the kubernetes cluster matches the desired state</li>
        <li>If a master node goes down, services can still keep working</li>
    </ul>
    <h3>Worker Node</h3>
    <ul>
        <li>kubelet (Node agent), makes sure it monitors whats happening on the node and reports back to controller manager</li>
        <li>kube-proxy (Networking Component), provides networking like exposing deployment</li>
        <li>Container run time, provides capability to run nodes (many differrent types of CRI available)</li>
        <li>PODS</li>
    </ul>
    <h3>How to avoid downtime ?</h3>
    <ul>
        <li>use minReadySeconds: 45 (for first 45 seconds pods are given the chance to start up)</li>
        <li>(As containers might not be able to provide a response jst after being set up, i.e not properly intialized yet)</li>
    </ul>
    <h3>Setup two different deployments with the same service</h3>
    <ul>
        <li>Its possible because services are connected to PODS and not deployment</li>
        <li>My adjusting Labels, and then sepcifying particular in the selector of Service template</li>
    </ul>
    <h3>Deploy using a WAR file</h3>
    <ul>
        <li>Simply copy war file to the right path within the container</li>
    </ul>
    <h3>Yaml files</h3>
    <pre>
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
    </pre>
    <br>
    <pre>
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
    </pre>
    <h3>Deplying different containers connecting to each other</h3>
    <ul>
        <li>Create a docker compose file</li>
        <li>Use kompose to convert it to kubernetes comaptible files</li>
        <li>In case of services that use storage like MYSql a persistent storage is used and an extra file for the same is created</li>
        <li>"--ignore-db-dir=lost+found" is added in the args of Mysql, as a persistent storafe has a directory present called lost+found, and the MySql doesn't like that</li>
    </ul>
    <h3>Persistent Volume Claim</h3>
    <ul>
        <li>Provides a certain amount of storage</li>
        <li>A persistent volume maps an external storage into our cluster</li>
        <li>Persistennt Volume Claim is how a pod can ask for persistent volume</li>
    </ul>
    <h3>Config Maps and Secrets</h3>
    <ul>
        <li>Helps in storing environment variables and configurations</li>
        <li>kubectl create configmap configfile_name --from-literal=RDS_DB_NAME=todos</li>
        <li>In containers in deployment add:<li>
        <pre>
          - name: RDS_DB_NAME
            valueFrom:
                configMapKeyRef:
                    key: RDS_DB_NAME
                    name: configfile_name
        <pre>
        <li>Use: kubectl apply -f deployment.yaml</li>
        <li>Use: kubectl edit configmap/configfile_name</li>
        <li>Add the rest of config key:values</li>
        <li>Restart application by scaling to 0 and then 1</li>
        <li>kubectl create secret generic secretfile_name --from-literal=RDS_PASSWORD=dummytodos<li>
        <li>In containers in deployment add:<li>
        <pre>
          - name: RDS_PASSWORD
            valueFrom:
                secretKeyRef:
                    key: RDS_PASSWORD
                    name: secretfile_name
        <pre>
        <li>kubectl apply -f deployment.yaml</li>
    </ul>
    <h3>Deploying microservices</h3>
    <ul>
        <li>Deploy Each service as a different deployment</li>
        <li>Expose each deployment</li>
        <li>To allow services to access each other there are two ways: <br>1)Using environment Variables<br>2)Using DNS services</li>
        <li>To check if the CoreDns service is runninng in your cluster use: kubectl get services kube-dns --namespace=kube-system</li>
        <li>To test Dns service run : kubectl run curl --image=radial/busyboxplus:curl -i --tty</li>
        <li>Then, hit enter and run nslookup my-nginx</li>
    </ul>
    </h3>Ingress / Avoiding use of multiple Load balancer for each service in a microservice architecture</h3>
    <ul>
        <li>It allows you to have 1 load balancer through which you can send request to different microservices</li>
        <li>Defined using ingress.yaml</li>
        <pre>
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
        </pre>
        <li>kubectl apply -f ingress.yaml</li>
        <li>And change LoadBalancers to NodePort</li>
    </ul>
    <h3>RBAC | Cluster Role Binding</h3>
    <ul>
        <li>Mapping a service account to a role on the cluster in order to able to view all the information on the kubernetes cluster</li>
        <li>Call kubernetes api services from within the applicaiton</li>
        <li>kubectl get serviceaccount</li>
    </ul>
    <h3>Auto scaling approaches</h3>
    <ul>
        <li>Increase the number of nodes based on the workload (Cluster autoscaling)</li>
        <li>Increase the number of pods to utilize node resources beter (Horizontal pod autoscaling). Ways: <br>
        1) kubectl autoscale deployment currency-exchange --min=1 --max=3 -cpu-percent=70</li>
        <li>Increase the resource limits of POD (Vertical pod autoscaling). Ways:<br>
        1) gcloud container cluster create [cluster_name] --enable-vertical-pod-autoscaling --cluster-version=1.14.7<br>
        2) gcloud container cluster update [cluster_name] --enable-vertical-pod-autoscaling
        3) configure VPA</li>
    </ul>
    <h3>Distributed tracing | Google Stackdriver</h3>
    <ul>
        <li>Trace the request across multiple microservices</li>
        <li>Check CPU utilization</li>
        <li>You should reduce the trace rate, i.e no. of requests are traced</li>
        <li>Go to API's and services, and enable services related to StackDriver API, StrackDriverr Login API, STrackDriver trace API, StrackDriver reporting API</li>
    </ul>
    <h3>Service Mesh | Istio</h3>
    <ul>
        <li>
         It allows to put functionalities that are common to each container or a micro service in a different container, which is assosciated with a container inside a pod
        </li>
        <li>The second container performing service mesh inside a pod is also called sidecar</li>
        <li>Istio is one of the most popular service mesh implementations</li>
    </ul>
    <h3>Helm</h3>
    <ul>
        <li>Package manager for kubernetes</li>
        <li>Execute multiple scripts in a order</li>
        <li>Manage releases</li>
        <li>Charts: A package of scripts used to deply the app, can be published to a repisotory</li>
        <li>Release: Installation of a specific version of chart on the kubernetes cluster</li>
        <li>Has a server side component (Helm tiller) and a client side component</li>
