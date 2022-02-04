import json
import spacy
nlp = spacy.load("en_core_web_sm")
nlp.add_pipe("merge_noun_chunks")
nlp.add_pipe("merge_entities")

while True:
  text = input()
  doc = nlp(text)

  res = { "tokens": [], "entities" : [] }
  for token in doc:
    res["tokens"].append({
      "text": token.text,
      "tag": token.tag_,
      "is_stop": token.is_stop,
      "ent_type": token.ent_type_
    })

  for ent in doc.ents:
    res["entities"].append({
      "text": ent.text,
      "label": ent.label_
    })

  print(json.dumps(res))