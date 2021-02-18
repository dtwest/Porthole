FROM python:3.9-slim-buster
WORKDIR /porthole
COPY . .
RUN apt-get update && apt-get -y dist-upgrade
RUN apt-get -y install netcat && apt-get -y install nmap
RUN pip3 install -r requirements.txt
CMD [ "/porthole/start.sh"]