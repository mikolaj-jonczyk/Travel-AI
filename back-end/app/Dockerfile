FROM python:3.8

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1


RUN pip install -r requirements.txt
