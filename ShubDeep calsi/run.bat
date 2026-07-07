@echo off
echo Scanning for connected mobile devices...
for /f "usebackq tokens=*" %%i in (`powershell -NoProfile -Command "$device = (flutter devices | Select-String '(mobile)'); if ($device) { ($device.ToString() -split ' • ')[1].Trim() } else { '' }"`) do set DEVICE_ID=%%i

if "%DEVICE_ID%"=="" (
    echo.
    echo WARNING: No connected mobile device found!
    echo Please connect your Android device or start an emulator.
    echo.
    echo Available devices:
    call flutter devices
    echo.
    echo Attempting to run with default device selection...
    call flutter run --release
) else (
    echo Found mobile device: %DEVICE_ID%
    echo Starting ShubDeep Calsi in release mode on %DEVICE_ID%...
    set "JAVA_HOME=%USERPROFILE%\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2"
    call flutter run -d %DEVICE_ID% --release
)
pause
