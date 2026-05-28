
#!/usr/bin/env python3

import PyPDF2
import os
import json
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class DocumentLearner:
    def __init__(self):
        self.documents = []
        self.vectorizer = TfidfVectorizer()
        self.tfidf_matrix = None
    
    def extract_text_from_pdf(self, file_path):
        text = ""
        try:
            with open(file_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            return text
        except Exception as e:
            print(f"读取PDF失败: {e}")
            return ""
    
    def chunk_text(self, text, chunk_size=500):
        sentences = re.split(r'(?<=[.!?])\s+', text)
        chunks = []
        current_chunk = ""
        
        for sentence in sentences:
            if len(current_chunk) + len(sentence) < chunk_size:
                current_chunk += sentence + " "
            else:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = sentence + " "
        
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        return chunks
    
    def learn_document(self, file_path):
        print(f"正在学习文档: {file_path}")
        
        if not os.path.exists(file_path):
            print(f"错误: 文件不存在 - {file_path}")
            return False
        
        if not file_path.endswith('.pdf'):
            print("错误: 只支持PDF文件")
            return False
        
        text = self.extract_text_from_pdf(file_path)
        if not text:
            print("错误: 无法从PDF中提取文本")
            return False
        
        chunks = self.chunk_text(text)
        print(f"文档已分割为 {len(chunks)} 个段落")
        
        self.documents.extend(chunks)
        
        if len(self.documents) > 0:
            self.tfidf_matrix = self.vectorizer.fit_transform(self.documents)
            print("✓ 文档学习成功！")
            return True
        
        return False
    
    def query(self, question, top_k=3):
        if not self.documents:
            return "请先学习文档！使用 learn <pdf文件路径> 命令。"
        
        query_vec = self.vectorizer.transform([question])
        similarities = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        
        top_indices = np.argsort(similarities)[::-1][:top_k]
        
        context = "\n\n---\n\n".join([
            f"【段落{i+1}】\n{self.documents[idx]}" 
            for i, idx in enumerate(top_indices) 
            if similarities[idx] > 0.1
        ])
        
        if not context:
            return "没有找到相关内容。"
        
        return f"根据文档内容，相关信息如下：\n\n{context}\n\n---\n\n基于以上内容，我来回答你的问题：\n{question}"

def main():
    learner = DocumentLearner()
    
    print("=" * 60)
    print("    文档学习助手 v1.0")
    print("=" * 60)
    print("命令说明:")
    print("  learn <pdf文件路径>  - 学习PDF文档")
    print("  query <问题>         - 向文档提问")
    print("  status               - 查看学习状态")
    print("  clear                - 清除所有文档")
    print("  exit                 - 退出")
    print("=" * 60)
    
    while True:
        try:
            command = input("\n> ").strip()
            
            if not command:
                continue
            
            if command.startswith('learn '):
                file_path = command[6:].strip()
                learner.learn_document(file_path)
            
            elif command.startswith('query '):
                question = command[6:].strip()
                if question:
                    result = learner.query(question)
                    print("\n" + "=" * 60)
                    print(result)
                    print("=" * 60)
                else:
                    print("请输入问题")
            
            elif command == 'status':
                print(f"已学习 {len(learner.documents)} 个段落")
            
            elif command == 'clear':
                learner = DocumentLearner()
                print("已清除所有学习的文档")
            
            elif command == 'exit':
                print("再见！")
                break
            
            else:
                print("未知命令，请输入 help 查看帮助")
        
        except KeyboardInterrupt:
            print("\n再见！")
            break
        except Exception as e:
            print(f"错误: {e}")

if __name__ == "__main__":
    main()
