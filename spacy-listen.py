import json
import spacy
import pytextrank
nlp = spacy.load("en_core_web_sm")
nlp.add_pipe("merge_noun_chunks")
nlp.add_pipe("merge_entities")
nlp.add_pipe("textrank")

while True:
  text = input()
  doc = nlp(text)

  res = { "keywords": [], "tokens": [] }
  for token in doc:
    res["tokens"].append({
      "text": token.text,
      "tag": token.tag_,
      "is_stop": token.is_stop,
      "ent_type": token.ent_type_
    })

  for phrase in doc._.phrases:
    res["keywords"].append({
      "text": phrase.text,
      "rank": phrase.rank
    })

  print(json.dumps(res))