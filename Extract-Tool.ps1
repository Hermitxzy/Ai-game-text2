# 极简解压工具 - PowerShell版本
# 支持拖拽文件到脚本上，或右键菜单解压

param([string[]]$Files)

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

function Extract-Archive {
    param([string]$FilePath)
    
    if (-not (Test-Path $FilePath)) {
        [System.Windows.Forms.MessageBox]::Show("文件不存在: $FilePath", "错误", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
        return
    }
    
    $fileInfo = Get-Item $FilePath
    $outputDir = Join-Path $fileInfo.DirectoryName $fileInfo.BaseName
    
    # 创建输出目录（如果不存在）
    if (-not (Test-Path $outputDir)) {
        New-Item -ItemType Directory -Path $outputDir | Out-Null
    }
    
    try {
        $extension = $fileInfo.Extension.ToLower()
        
        switch ($extension) {
            ".zip" {
                Expand-Archive -Path $FilePath -DestinationPath $outputDir -Force
            }
            { $_ -in @(".tar", ".tar.gz", ".tgz", ".tar.bz2", ".tbz2") } {
                # 使用.NET的TarFile类（PowerShell 7+或.NET 7+）
                try {
                    $tarAssembly = [System.Reflection.Assembly]::LoadWithPartialName("System.Formats.Tar")
                    if ($tarAssembly) {
                        $tarStream = [System.IO.File]::OpenRead($FilePath)
                        $tarReader = [System.Formats.Tar.TarReader]::new($tarStream, $true)
                        while ($entry = $tarReader.GetNextEntry()) {
                            if ($entry.EntryType -eq [System.Formats.Tar.TarEntryType]::RegularFile) {
                                $destPath = Join-Path $outputDir $entry.Name
                                $destDir = Split-Path -Parent $destPath
                                if (-not (Test-Path $destDir)) {
                                    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
                                }
                                $entry.ExtractToFile($destPath, $true)
                            }
                        }
                        $tarReader.Dispose()
                        $tarStream.Dispose()
                    } else {
                        throw "需要.NET 7或更高版本才能解压TAR文件"
                    }
                } catch {
                    [System.Windows.Forms.MessageBox]::Show("TAR解压需要.NET 7或更高版本，或使用7-Zip", "提示", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
                    return
                }
            }
            ".rar" {
                [System.Windows.Forms.MessageBox]::Show("RAR格式需要安装7-Zip", "提示", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
                return
            }
            ".7z" {
                [System.Windows.Forms.MessageBox]::Show("7Z格式需要安装7-Zip", "提示", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
                return
            }
            default {
                [System.Windows.Forms.MessageBox]::Show("不支持的格式: $extension", "错误", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
                return
            }
        }
        
        [System.Windows.Forms.MessageBox]::Show("解压成功！`n位置: $outputDir", "完成", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
    } catch {
        [System.Windows.Forms.MessageBox]::Show("解压失败: $($_.Exception.Message)", "错误", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
    }
}

function Show-GUI {
    $form = New-Object System.Windows.Forms.Form
    $form.Text = "极简解压工具"
    $form.Size = New-Object System.Drawing.Size(400, 250)
    $form.StartPosition = "CenterScreen"
    $form.FormBorderStyle = "FixedDialog"
    $form.MaximizeBox = $false
    
    $label = New-Object System.Windows.Forms.Label
    $label.Text = "将压缩文件拖到此处，或点击按钮选择"
    $label.Location = New-Object System.Drawing.Point(20, 20)
    $label.Size = New-Object System.Drawing.Size(360, 30)
    
    $btnSelect = New-Object System.Windows.Forms.Button
    $btnSelect.Text = "选择压缩文件"
    $btnSelect.Location = New-Object System.Drawing.Point(100, 70)
    $btnSelect.Size = New-Object System.Drawing.Size(200, 40)
    $btnSelect.Add_Click({
        $dialog = New-Object System.Windows.Forms.OpenFileDialog
        $dialog.Filter = "压缩文件|*.zip;*.tar;*.tar.gz;*.tgz|ZIP文件|*.zip|TAR文件|*.tar;*.tar.gz;*.tgz|所有文件|*.*"
        $dialog.Title = "选择要解压的文件"
        if ($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
            Extract-Archive -FilePath $dialog.FileName
        }
    })
    
    $labelDrag = New-Object System.Windows.Forms.Label
    $labelDrag.Text = "或者直接拖拽文件到窗口"
    $labelDrag.Location = New-Object System.Drawing.Point(100, 130)
    $labelDrag.Size = New-Object System.Drawing.Size(200, 30)
    $labelDrag.TextAlign = "MiddleCenter"
    
    $form.Controls.Add($label)
    $form.Controls.Add($btnSelect)
    $form.Controls.Add($labelDrag)
    
    # 启用拖拽
    $form.AllowDrop = $true
    $form.Add_DragEnter({
        if ($_.Data.GetDataPresent([System.Windows.Forms.DataFormats]::FileDrop)) {
            $_.Effect = [System.Windows.Forms.DragDropEffects]::Copy
        }
    })
    $form.Add_DragDrop({
        $files = $_.Data.GetData([System.Windows.Forms.DataFormats]::FileDrop)
        foreach ($file in $files) {
            Extract-Archive -FilePath $file
        }
    })
    
    $form.ShowDialog()
}

# 主程序
if ($Files.Count -gt 0) {
    foreach ($file in $Files) {
        Extract-Archive -FilePath $file
    }
} else {
    Show-GUI
}
