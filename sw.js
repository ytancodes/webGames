<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="Content-Style-Type" content="text/css">
  <title></title>
  <meta name="Generator" content="Cocoa HTML Writer">
  <meta name="CocoaVersion" content="2113.65">
  <style type="text/css">
    p.p1 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Helvetica}
    p.p2 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Helvetica; min-height: 14.0px}
  </style>
</head>
<body>
<p class="p1">const CACHE_NAME = "snake-game-cache-v1";</p>
<p class="p1">const urlsToCache = [</p>
<p class="p1"><span class="Apple-converted-space">    </span>"/",</p>
<p class="p1"><span class="Apple-converted-space">    </span>"/index.html",</p>
<p class="p1"><span class="Apple-converted-space">    </span>"/sw.js",</p>
<p class="p1"><span class="Apple-converted-space">    </span>"/manifest.json",</p>
<p class="p1"><span class="Apple-converted-space">    </span>"/styles.css",</p>
<p class="p1"><span class="Apple-converted-space">    </span>"/icons/icon-192x192.png",</p>
<p class="p1"><span class="Apple-converted-space">    </span>"/icons/icon-512x512.png"</p>
<p class="p1">];</p>
<p class="p2"><br></p>
<p class="p1">self.addEventListener("install", event =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">    </span>event.waitUntil(</p>
<p class="p1"><span class="Apple-converted-space">        </span>caches.open(CACHE_NAME).then(cache =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">            </span>return cache.addAll(urlsToCache);</p>
<p class="p1"><span class="Apple-converted-space">        </span>})</p>
<p class="p1"><span class="Apple-converted-space">    </span>);</p>
<p class="p1">});</p>
<p class="p2"><br></p>
<p class="p1">self.addEventListener("fetch", event =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">    </span>event.respondWith(</p>
<p class="p1"><span class="Apple-converted-space">        </span>caches.match(event.request).then(response =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">            </span>return response || fetch(event.request);</p>
<p class="p1"><span class="Apple-converted-space">        </span>})</p>
<p class="p1"><span class="Apple-converted-space">    </span>);</p>
<p class="p1">});</p>
<p class="p2"><br></p>
<p class="p1">self.addEventListener("activate", event =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">    </span>event.waitUntil(</p>
<p class="p1"><span class="Apple-converted-space">        </span>caches.keys().then(cacheNames =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">            </span>return Promise.all(</p>
<p class="p1"><span class="Apple-converted-space">                </span>cacheNames.filter(cache =&gt; cache !== CACHE_NAME).map(cache =&gt; caches.delete(cache))</p>
<p class="p1"><span class="Apple-converted-space">            </span>);</p>
<p class="p1"><span class="Apple-converted-space">        </span>})</p>
<p class="p1"><span class="Apple-converted-space">    </span>);</p>
<p class="p1">});</p>
</body>
</html>
