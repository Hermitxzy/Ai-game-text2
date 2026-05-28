@echo off
echo 正在打包极简解压工具...
pyinstaller --onefile --windowed --name="极简解压工具" extract_tool.py
echo.
echo 打包完成！
echo 可执行文件位于 dist 目录中
pause
