import tkinter as tk
from tkinter import filedialog, messagebox
import zipfile
import tarfile
import os
from pathlib import Path


def extract_archive():
    file_path = filedialog.askopenfilename(
        title="选择压缩文件",
        filetypes=[
            ("所有支持的格式", "*.zip *.tar *.tar.gz *.tar.bz2 *.tgz"),
            ("ZIP 文件", "*.zip"),
            ("TAR 文件", "*.tar *.tar.gz *.tar.bz2 *.tgz"),
            ("所有文件", "*.*")
        ]
    )
    
    if not file_path:
        return
    
    output_dir = filedialog.askdirectory(title="选择解压位置")
    if not output_dir:
        return
    
    try:
        if file_path.endswith('.zip'):
            with zipfile.ZipFile(file_path, 'r') as zip_ref:
                zip_ref.extractall(output_dir)
        elif file_path.endswith(('.tar', '.tar.gz', '.tar.bz2', '.tgz')):
            with tarfile.open(file_path, 'r:*') as tar_ref:
                tar_ref.extractall(output_dir)
        else:
            messagebox.showerror("错误", "不支持的文件格式")
            return
        
        messagebox.showinfo("成功", f"解压完成！\n文件已保存到：{output_dir}")
    except Exception as e:
        messagebox.showerror("错误", f"解压失败：{str(e)}")


def main():
    root = tk.Tk()
    root.title("极简解压工具")
    root.geometry("300x150")
    root.resizable(False, False)
    
    frame = tk.Frame(root, padx=20, pady=20)
    frame.pack(expand=True)
    
    btn = tk.Button(
        frame,
        text="选择压缩文件并解压",
        command=extract_archive,
        height=2,
        width=25
    )
    btn.pack(expand=True)
    
    root.mainloop()


if __name__ == "__main__":
    main()
