docker build -t bloopletech/json2html .
@if %errorlevel% neq 0 exit /b %errorlevel%
REM docker push bloopletech/json2html
REM @if %errorlevel% neq 0 exit /b %errorlevel%
