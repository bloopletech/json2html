#!/bin/bash
set -e
docker build -t bloopletech/json2html .
docker push bloopletech/json2html
