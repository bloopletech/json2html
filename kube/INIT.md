Run:

```
kubectl apply -f namespace.yaml
kubectl config set-context json2html --namespace=json2html --cluster=<cluster name> --user=<user name>
kubectl config use-context json2html
```

## Monitoring

It is assumed that monitoring is already set up cluser-wide.

## ingress-nginx

It is assumed that ingress-nginx has already been set up cluster-wide.

## cert-manager

It is assumed that cert-manager has already been set up cluster-wide.

## application configs and secrets

````
kubectl create secret docker-registry regcred --docker-server='https://index.docker.io/v1/' --docker-username='bloopletech' --docker-password='<docker password>' --docker-email='i@bloople.net'
````

## deploy application

````
kubectl apply -f staging-issuer.yaml
kubectl apply -f prod-issuer.yaml
kubectl apply -f json2html.yaml
kubectl apply -f ingress.yaml
````
