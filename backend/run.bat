@echo off
cd /d "%~dp0"
"%~dp0apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run
pause
