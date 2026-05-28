@echo off
echo 正在移除右键菜单...
powershell.exe -ExecutionPolicy Bypass -File "%~dp0Add-ContextMenu.ps1" -Remove
pause
