docker build -t bloopletech/json2html .
@if %errorlevel% neq 0 exit /b %errorlevel%
docker push bloopletech/json2html
@if %errorlevel% neq 0 exit /b %errorlevel%
