docker build -t pgaida/fib-client:latest -t pgaida/fib-client:$GIT_SHA -f ./client/Dockerfile ./client
docker build -t pgaida/fib-server:latest -t pgaida/fib-server:$GIT_SHA -f ./server/Dockerfile ./server
docker build -t pgaida/fib-worker:latest -t pgaida/fib-worker:$GIT_SHA -f ./worker/Dockerfile ./worker

docker push pgaida/fib-client:latest
docker push pgaida/fib-client:$GIT_SHA
docker push pgaida/fib-server:latest
docker push pgaida/fib-server:$GIT_SHA
docker push pgaida/fib-worker:latest
docker push pgaida/fib-worker:$GIT_SHA

kubectl apply -f k8s

kubectl set image deployments/client-deployment client=pgaida/fib-client:$GIT_SHA
kubectl set image deployments/server-deployment server=pgaida/fib-server:$GIT_SHA
kubectl set image deployments/worker-deployment worker=pgaida/fib-worker:$GIT_SHA

