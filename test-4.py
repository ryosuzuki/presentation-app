import json
import spacy
import pytextrank

text = "Augmented reality (AR) is an enhanced version of the real physical world that is achieved through the use of digital visual elements, sound, or other sensory stimuli delivered via technology. It is a growing trend among companies involved in mobile computing and business applications in particular."

text = "Hello my name is Ryo Suzuki. I am an Assistant Professor at the University of Calgary in Department of Computer Science. Today I want to talk about Real-time Augmented Presentation. As you can see when I talk and present something, we can augment presentation with live kinetic typography, embedded icons, embedded visuals, as well as embedded annotation to a physical object. All components are interactive with gestrual interactions. And most importantly it all happens in real-time. This means no video editing or programming. Thus it can signficiatnly reduces the time and efforts but also expands the tremendous potential of augmented presentation in real-time live talk. Augmented presentation has been widely used technique in YouTube or video documentary. They often use expressive embedded visuals to make the presentation more impressive and engagaging. However it requires a lot of time and efforts to produce such a video through video-editing tools. We wonder what if we can create this kind of videos in real-time. In this talk I want to introduce the system overview and how we implement this demo."

nlp = spacy.load("en_core_web_sm")
nlp.add_pipe("merge_noun_chunks")
nlp.add_pipe("merge_entities")
nlp.add_pipe("textrank")
doc = nlp(text)

res = { "keywords": []}
for phrase in doc._.phrases:
  res["keywords"].append({
    "text": phrase.text,
    "rank": phrase.rank
  })

print(json.dumps(res))
