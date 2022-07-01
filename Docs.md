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
        <li>kubectl delete all -l app=pod_label
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
    <p>
    apiVersion: apps/v1
    kind: Deployment                                   # Type of file
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
    </p>
    <br>
    <p>
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
    </p>
