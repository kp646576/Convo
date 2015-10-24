---
# Back-End 
---
## SignupHandler

**self.user\_model.create_user()**

**Returns:** A tuple (boolean, info). The boolean indicates if the user was created. If creation succeeds, info is the user entity; otherwise it is a list of duplicated unique properties that caused creation to fail.

1. **Currently automatically verified**


---
# Testing
---
## Pre-Reqs
1. Handler Testing: <https://cloud.google.com/appengine/docs/python/tools/handlertesting>
2. Need WebTest:  
`$ pip install WebTest` or `$ easy_install WebTest`

## Frameworks
1. Using NoseGAE: <https://pypi.python.org/pypi/NoseGAE>
`$ sudo easy_install nose`
`$ sudo easy_install NoseGAE`

2. RedNose for coloring: <https://github.com/gfxmonk/rednose/>
3. Basic usage: `nosetests --with-gae --rednose <filename>.py`

## Known Errors
	root: ERROR: Error importing template source loader
	django.template.loaders.filesystem.load_template_source: 
	"'module' object has no attribute 'load_template_source'"
Solution: add follow to top of main.py  
(issue seems to arise from using django 1.4)  

	from google.appengine.dist import use_library
	use_library('django', '1.3') 