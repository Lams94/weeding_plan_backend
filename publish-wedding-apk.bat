@echo off
setlocal

if "%APK_RELEASE_TOKEN%"=="" (
    echo ERREUR: APK_RELEASE_TOKEN doit etre defini dans l'environnement.
    exit /b 1
)
set "TOKEN=%APK_RELEASE_TOKEN%"
set "SERVER=https://devdashapklink-production.up.railway.app/releases/android"
set "APK=android\app\build\outputs\apk\debug\app-debug.apk"

echo === PUBLISH WEDDING PLAN APK ===
curl.exe -f -X POST -H "x-release-token: %TOKEN%" -F "appDomain=Wedding Plan" -F "apk=@%APK%;type=application/vnd.android.package-archive" -F "versionName=1.0.0" -F "versionCode=1" -F "notes=Wedding Plan Prestige Edition (Mise à jour)" %SERVER%

if %ERRORLEVEL% NEQ 0 (
    echo ERREUR LORS DU PUBLISH
    pause
    exit /b 1
)

echo.
echo === TERMINE ===
pause
