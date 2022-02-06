import json
from keybert import KeyBERT
kw_model = KeyBERT()

text = "Augmented reality (AR) is an enhanced version of the real physical world that is achieved through the use of digital visual elements, sound, or other sensory stimuli delivered via technology. It is a growing trend among companies involved in mobile computing and business applications in particular."

keywords = kw_model.extract_keywords(text, keyphrase_ngram_range=(1, 2), stop_words=None)

print(json.dumps(keywords))