from fastapi import FastAPI, HTTPException
from langchain_community.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
import pandas as pd
import os
from dotenv import load_dotenv
from langchain.schema import Document
import faiss
import numpy as np
from langchain.chains.question_answering import load_qa_chain
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"], 
)

df = pd.read_csv('transaction_2025.csv')

llm = ChatGoogleGenerativeAI(
    model='gemini-2.0-flash-lite-preview-02-05',
    temperature=0.3
)


def categorize_transactions(transaction_names, llm):
    prompt = (
        "Categorize the expenses into categories like Food, Travel, Entertainment, etc.,"
        " and list them in the format 'Category - Transaction'. Do not group them together.\n"
        f"Transactions: {transaction_names}\n"
        "Output format: Category - Transaction"
    )
    
    response = llm.invoke(prompt).content
    response = response.split('\n')
    cleaned_data = [item.replace("*", "").strip() for item in response]
    
    categories_df = pd.DataFrame({'Transaction vs Category': cleaned_data})
    categories_df[['Category', 'Transaction']] = categories_df['Transaction vs Category'].str.split(' - ', expand=True)
    return categories_df

unique_transactions = df["Description"].unique().tolist()

batch_size = 50
categories_df_all = pd.DataFrame()

for i in range(0, len(unique_transactions), batch_size):
    transaction_batch = unique_transactions[i : i + batch_size]
    transaction_names = ', '.join(transaction_batch)
    
    categories_df = categorize_transactions(transaction_names, llm)
    categories_df_all = pd.concat([categories_df_all, categories_df], ignore_index=True)

df = pd.merge(df, categories_df_all, left_on='Description', right_on='Transaction', how='left')
df.drop(columns=['Transaction vs Category', 'Transaction'], inplace=True)

df['Text'] = df.apply(lambda x: f"Spent ₹{x['Amount (INR)']} on {x['Category']} at {x['Description']} on {x['Date']} using {x['Payment Method']}", axis=1)

embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

documents = [Document(page_content=text) for text in df['Text'].tolist()]
vectorstore = FAISS.from_documents(documents, embeddings)

prompt_template = PromptTemplate(
    input_variables=["context", "question"],
    template="""You are an AI assistant providing detailed answers based on the user's transaction history.

    Context:
    {context}

    Question: {question}

    Provide a well-structured response using the given context. Do not share the raw context with the user.
"""
)

qa_chain = load_qa_chain(llm, chain_type="stuff", prompt=prompt_template)
answer_generation_chain = RetrievalQA(
    retriever=vectorstore.as_retriever(),
    combine_documents_chain=qa_chain
)

class QueryRequest(BaseModel):
    user_query: str

@app.post("/query/")
async def query_chatbot(request: QueryRequest):
    try:
        response = answer_generation_chain.invoke(request.user_query)
        cleaned_response = response["result"].replace("*", "").strip()
        return {"response": cleaned_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


static_dir = os.path.join(os.path.dirname(__file__), "static")

if not os.path.exists(static_dir):
    os.makedirs(static_dir)  
app.mount("/static", StaticFiles(directory=static_dir), name="static")