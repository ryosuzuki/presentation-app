import json
import spacy
import pytextrank
nlp = spacy.load("en_core_web_sm")
nlp.add_pipe("merge_noun_chunks")
nlp.add_pipe("merge_entities")
nlp.add_pipe("textrank")

text = "Augmented reality (AR) is an enhanced version of the real physical world that is achieved through the use of digital visual elements, sound, or other sensory stimuli delivered via technology. It is a growing trend among companies involved in mobile computing and business applications in particular."

doc = nlp(text)

keywords = {}
for phrase in doc._.phrases:
  keywords[phrase.text] = phrase.rank

res = { "tokens": [] }
for token in doc:
  rank = keywords.get(token.text, 0)
  res["tokens"].append({
    "text": token.text,
    "tag": token.tag_,
    "is_stop": token.is_stop,
    "ent_type": token.ent_type_,
    "keyword_rank": rank,
  })

print(json.dumps(res))