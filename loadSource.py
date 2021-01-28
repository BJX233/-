import requests
import os,re
with open("source.txt", "r") as f:
    os.system("mkdir res/raw-assets")
    for i in range(74):
        url = f.readline().strip()
        print(url)
        g = re.match(".*res/raw-assets/(.*)/(.*)",url)
        path = ['res/raw-assets/']
        path.append(g.group(1))
        path.append(g.group(2))
        os.system("cd {0} && touch {1}/{2}".format(*path))
        req = requests.get("http:"+url)
        with open("{0}/{1}/{2}".format(*path),"wb") as fc:
            fc.write(req.content)