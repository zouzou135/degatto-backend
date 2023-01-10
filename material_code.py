import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
import sys
import nltk
import re
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle

def remove_stops(df):
    
    newdata=[t for t in df if t not in new_stopping_words]
    return newdata

def remove_num(df):
    text_without_num=[w for w in df if w.isalpha()]
    return text_without_num

def tokenizze(df):
    newdata= word_tokenize(df)
    return newdata

def remove_punc(df):
    new_text= re.sub("n't",'not', df)
    new_text= re.sub('[^\w\s]','', df)
    return new_text

def Cleaning_process(df):
    m = []
    processed_text=remove_punc(str(df))
    tokenized_data=tokenizze(processed_text.lower())
    textwithoutnum= remove_num(tokenized_data)
    data=remove_stops(textwithoutnum)
    return " ".join(data)

model_loaded = load_model(
    'material_model.model')

nltk.download("stopwords")
stop_words = stopwords.words("english")
new_stopping_words = stop_words[:len(stop_words)-36]
new_stopping_words.remove("not")
nltk.download('punkt')

tokenizer = Tokenizer(num_words=10000)

maxlen = 200


df = pd.read_csv("test.csv")

df = df.iloc[:, 0].apply(Cleaning_process)

with open('tokenizer.pickle', 'rb') as handle:
    tokenizer2 = pickle.load(handle)
    tokens = tokenizer2.texts_to_sequences(df.values.tolist())
    tokens_pad = pad_sequences(tokens, padding='post', maxlen=maxlen)
    mod_pred = model_loaded.predict(tokens_pad)
    df_pred = pd.DataFrame(mod_pred, index=df.values.tolist())


    res_values = df_pred.idxmax(axis=1).value_counts()
    for i in range(3):
        if i not in res_values:
            res_values[i] = 0
    # 0 is neutral 1 is negative and 2 is positive
    print(res_values.sort_index().tolist())
    sys.stdout.flush()
