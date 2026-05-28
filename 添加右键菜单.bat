@echo off
echo 正在添加右键菜单...
powershell.exe -ExecutionPolicy Bypass -File "%~dp0Add-ContextMenu.ps1"
pause
