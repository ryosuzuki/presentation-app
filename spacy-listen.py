import json
import spacy
nlp = spacy.load("en_core_web_sm")

while True:
  text = input()
  doc = nlp(text)
  print(json.dumps([chunk.text for chunk in doc.noun_chunks]))
