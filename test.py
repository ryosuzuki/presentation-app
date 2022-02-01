import json
import spacy
nlp = spacy.load("en_core_web_sm")
text = "Augmented reality (AR) is an enhanced version of the real physical world that is achieved through the use of digital visual elements, sound, or other sensory stimuli delivered via technology. It is a growing trend among companies involved in mobile computing and business applications in particular."

# text = "Apple is looking at buying U.K. startup for $1 billion"

nlp.add_pipe("merge_noun_chunks")
nlp.add_pipe("merge_entities")
doc = nlp(text)

res = { "tokens": [], "entities" : [] }
for token in doc:
  res["tokens"].append({
    "text": token.text,
    "tag": token.tag_
  })

for ent in doc.ents:
  res["entities"].append({
    "text": ent.text,
    "label": ent.label_
  })

print(json.dumps(res))
# print(doc[0])