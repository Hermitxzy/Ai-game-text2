# 添加右键菜单 - 极简解压工具

param(
    [switch]$Remove
)

$scriptPath = Join-Path $PSScriptRoot "Extract-Tool.ps1"
$menuName = "使用极简解压工具解压"

if ($Remove) {
    # 移除右键菜单
    $regPaths = @(
        "HKCU:\Software\Classes\*\shell\ExtractTool",
        "HKCU:\Software\Classes\CompressedFolder\shell\ExtractTool",
        "HKCU:\Software\Classes\.zip\shell\ExtractTool"
    )
    
    foreach ($path in $regPaths) {
        if (Test-Path $path) {
            Remove-Item -Path $path -Recurse -Force
        }
    }
    
    Write-Host "右键菜单已移除" -ForegroundColor Green
    exit
}

# 添加右键菜单
$command = "powershell.exe -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$scriptPath`" `"%1`""

# 为所有文件添加
$regPath = "HKCU:\Software\Classes\*\shell\ExtractTool"
if (-not (Test-Path $regPath)) {
    New-Item -Path $regPath -Force | Out-Null
}
Set-ItemProperty -Path $regPath -Name "(default)" -Value $menuName
$commandPath = Join-Path $regPath "command"
if (-not (Test-Path $commandPath)) {
    New-Item -Path $commandPath -Force | Out-Null
}
Set-ItemProperty -Path $commandPath -Name "(default)" -Value $command

# 为压缩文件夹添加
$regPath = "HKCU:\Software\Classes\CompressedFolder\shell\ExtractTool"
if (-not (Test-Path $regPath)) {
    New-Item -Path $regPath -Force | Out-Null
}
Set-ItemProperty -Path $regPath -Name "(default)" -Value $menuName
$commandPath = Join-Path $regPath "command"
if (-not (Test-Path $commandPath)) {
    New-Item -Path $commandPath -Force | Out-Null
}
Set-ItemProperty -Path $commandPath -Name "(default)" -Value $command

# 为.zip文件添加
$regPath = "HKCU:\Software\Classes\.zip\shell\ExtractTool"
if (-not (Test-Path $regPath)) {
    New-Item -Path $regPath -Force | Out-Null
}
Set-ItemProperty -Path $regPath -Name "(default)" -Value $menuName
$commandPath = Join-Path $regPath "command"
if (-not (Test-Path $commandPath)) {
    New-Item -Path $commandPath -Force | Out-Null
}
Set-ItemProperty -Path $commandPath -Name "(default)" -Value $command

Write-Host "右键菜单已添加！" -ForegroundColor Green
Write-Host "现在可以右键点击压缩文件，选择 '$menuName' 来解压" -ForegroundColor Cyan
