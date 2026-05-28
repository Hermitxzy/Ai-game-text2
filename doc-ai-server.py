
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import uvicorn
import PyPDF2
import os
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

app = FastAPI(title="Document AI Assistant", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

model = SentenceTransformer('all-MiniLM-L6-v2')
index = None
documents = []

class ChatRequest(BaseModel):
    model: str
    messages: List[Dict[str, str]]
    temperature: float = 0.7

class ChatResponse(BaseModel):
    id: str
    object: str
    created: int
    model: str
    choices: List[Dict]

def extract_text_from_pdf(file_path):
    text = ""
    with open(file_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    return text

def chunk_text(text, chunk_size=500, chunk_overlap=50):
    chunks = []
    words = text.split()
    for i in range(0, len(words), chunk_size - chunk_overlap):
        chunk = ' '.join(words[i:i + chunk_size])
        chunks.append(chunk)
    return chunks

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    global index, documents
    
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="只支持PDF文件")
    
    file_path = f"/tmp/{file.filename}"
    with open(file_path, 'wb') as f:
        f.write(await file.read())
    
    text = extract_text_from_pdf(file_path)
    chunks = chunk_text(text)
    
    if len(chunks) == 0:
        raise HTTPException(status_code=400, detail="无法从PDF中提取文本")
    
    embeddings = model.encode(chunks)
    
    if index is None:
        index = faiss.IndexFlatL2(embeddings.shape[1])
    else:
        pass
    
    index.add(np.array(embeddings))
    documents.extend(chunks)
    
    os.remove(file_path)
    
    return {"message": f"文档已学习成功！共 {len(chunks)} 个段落"}

@app.post("/chat/completions", response_model=ChatResponse)
async def chat_completions(request: ChatRequest):
    global index, documents
    
    if index is None or len(documents) == 0:
        return ChatResponse(
            id="chatcmpl-no-doc",
            object="chat.completion",
            created=1234567890,
            model=request.model,
            choices=[{
                "message": {
                    "role": "assistant",
                    "content": "请先上传PDF文档进行学习！使用 /upload 接口上传文件。"
                },
                "finish_reason": "stop",
                "index": 0
            }]
        )
    
    user_message = request.messages[-1]["content"]
    query_embedding = model.encode([user_message])
    
    D, I = index.search(np.array(query_embedding), k=3)
    
    context = "\n\n".join([documents[i] for i in I[0] if i >= 0])
    
    response_content = f"根据文档内容，我的回答如下：\n\n**相关内容：**\n{context}\n\n**回答：**\n基于文档中的信息，{user_message}\n\n（注：以上回答基于上传的文档内容生成）"
    
    return ChatResponse(
        id="chatcmpl-doc-001",
        object="chat.completion",
        created=1234567890,
        model=request.model,
        choices=[{
            "message": {
                "role": "assistant",
                "content": response_content
            },
            "finish_reason": "stop",
            "index": 0
        }]
    )

@app.get("/status")
async def status():
    return {
        "documents_count": len(documents),
        "index_size": index.ntotal if index else 0,
        "status": "ready"
    }

@app.post("/clear")
async def clear_documents():
    global index, documents
    index = None
    documents = []
    return {"message": "已清除所有学习的文档"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
